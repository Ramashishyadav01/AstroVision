const express = require('express');
const router = express.Router();
const {
  generateReport,
  getReports,
  getReport,
  deleteReport,
} = require('../controllers/reportController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// @route   POST /api/reports/generate
// @desc    Generate a new astrology report
// @access  Private
router.post('/generate', generateReport);

// @route   GET /api/reports
// @desc    Get all reports for the authenticated user
// @access  Private
router.get('/', getReports);

// @route   GET /api/reports/:id
// @desc    Get a single report by ID
// @access  Private
router.get('/:id', getReport);

// @route   DELETE /api/reports/:id
// @desc    Delete a report by ID
// @access  Private
router.delete('/:id', deleteReport);

module.exports = router;
