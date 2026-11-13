const axios = require('axios');
const Report = require('../models/Report');

// Helper: build astrology API request config
const getApiConfig = (reportType, birthData) => {
  const { year, month, date, hours, minutes, seconds, latitude, longitude, timezone } = birthData;

  const baseBody = { year, month, date, hours, minutes, seconds, latitude, longitude, timezone };

  switch (reportType) {
    case 'planets-extended':
      return {
        endpoint: '/planets/extended',
        body: {
          ...baseBody,
          config: {
            observation_point: 'topocentric',
            ayanamsha: 'lahiri',
            language: 'en',
          },
        },
      };

    case 'western-planets':
      return {
        endpoint: '/western/planets',
        body: {
          ...baseBody,
          config: {
            observation_point: 'topocentric',
            language: 'en',
          },
        },
      };

    case 'panchang':
      return {
        endpoint: '/complete-panchang',
        body: {
          ...baseBody,
          config: {
            observation_point: 'topocentric',
            ayanamsha: 'lahiri',
            language: 'en',
          },
        },
      };

    default:
      return null;
  }
};

// Helper: build a human-readable report name
const buildReportName = (reportType, birthData) => {
  const typeLabels = {
    'planets-extended': 'Extended Planets Report',
    'western-planets': 'Western Planets Report',
    'panchang': 'Panchang Report',
  };
  const label = typeLabels[reportType] || reportType;
  const place = birthData.placeName ? ` - ${birthData.placeName}` : '';
  const dateStr = birthData.year
    ? ` (${birthData.date}/${birthData.month}/${birthData.year})`
    : '';
  return `${label}${place}${dateStr}`;
};

// @desc    Generate an astrology report
// @route   POST /api/reports/generate
// @access  Private
const generateReport = async (req, res) => {
  try {
    const { reportType, birthData } = req.body;

    // Validate reportType
    const validTypes = ['planets-extended', 'western-planets', 'panchang'];
    if (!reportType || !validTypes.includes(reportType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid or missing reportType. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    // Validate birthData
    if (!birthData || typeof birthData !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'birthData object is required',
      });
    }

    const requiredFields = ['year', 'month', 'date', 'hours', 'minutes', 'seconds', 'latitude', 'longitude', 'timezone'];
    const missingFields = requiredFields.filter(
      (field) => birthData[field] === undefined || birthData[field] === null
    );
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required birthData fields: ${missingFields.join(', ')}`,
      });
    }

    // Build API request
    const apiConfig = getApiConfig(reportType, birthData);
    if (!apiConfig) {
      return res.status(400).json({
        success: false,
        message: 'Could not build API configuration for the given report type',
      });
    }

    const baseUrl = process.env.ASTROLOGY_API_BASE_URL;
    const apiKey = process.env.ASTROLOGY_API_KEY;
    const url = `${baseUrl}${apiConfig.endpoint}`;

    // Call freeastrologyapi.com
    let apiResponse;
    try {
      const response = await axios.post(url, apiConfig.body, {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });
      apiResponse = response.data;
    } catch (axiosError) {
      console.error('Astrology API error:', axiosError.message);

      if (axiosError.response) {
        // API responded with an error status
        return res.status(502).json({
          success: false,
          message: `Astrology API error: ${axiosError.response.data?.message || axiosError.response.statusText}`,
          data: { statusCode: axiosError.response.status },
        });
      } else if (axiosError.request) {
        // No response received
        return res.status(503).json({
          success: false,
          message: 'Could not reach the Astrology API. Please try again later.',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to call Astrology API',
      });
    }

    // Save report to MongoDB
    const reportName = buildReportName(reportType, birthData);
    const report = await Report.create({
      userId: req.user.id,
      reportType,
      reportName,
      birthData,
      reportData: apiResponse,
    });

    return res.status(201).json({
      success: true,
      message: 'Report generated and saved successfully',
      data: { report },
    });
  } catch (error) {
    console.error('Generate report error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while generating report. Please try again.',
    });
  }
};

// @desc    Get all reports for authenticated user
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-reportData'); // Omit heavy reportData in list view

    return res.status(200).json({
      success: true,
      message: 'Reports retrieved successfully',
      data: {
        reports,
        count: reports.length,
      },
    });
  } catch (error) {
    console.error('Get reports error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching reports. Please try again.',
    });
  }
};

// @desc    Get a single report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Verify ownership
    if (report.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this report.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Report retrieved successfully',
      data: { report },
    });
  } catch (error) {
    console.error('Get report error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID format',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching report. Please try again.',
    });
  }
};

// @desc    Delete a report by ID
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Verify ownership
    if (report.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this report.',
      });
    }

    await report.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
      data: { deletedReportId: req.params.id },
    });
  } catch (error) {
    console.error('Delete report error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID format',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting report. Please try again.',
    });
  }
};

module.exports = { generateReport, getReports, getReport, deleteReport };
