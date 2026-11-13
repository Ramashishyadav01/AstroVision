import React from 'react';
import { useNavigate } from 'react-router-dom';

const REPORT_META = {
  'planets-extended': {
    icon: '🪐',
    label: 'Vedic Planetary Report',
    badgeClass: 'badge-vedic',
    color: 'purple',
  },
  'western-planets': {
    icon: '⭐',
    label: 'Western Birth Chart',
    badgeClass: 'badge-western',
    color: 'blue',
  },
  panchang: {
    icon: '📅',
    label: 'Daily Panchang',
    badgeClass: 'badge-panchang',
    color: 'gold',
  },
};

const ReportCard = ({ report, onDelete }) => {
  const navigate = useNavigate();
  const meta = REPORT_META[report.reportType] || {
    icon: '🌟',
    label: report.reportType,
    badgeClass: 'badge-panchang',
  };

  const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(report.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleView = () => navigate(`/reports/${report._id}`);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      onDelete(report._id);
    }
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid #e5e7eb',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        transition: 'all 0.2s',
      }}
      className="hover:shadow-md hover:border-purple-300 cursor-pointer group"
      onClick={handleView}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon & Info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            {meta.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`report-badge ${meta.badgeClass}`}>{meta.label}</span>
            </div>
            <h3 style={{ color: '#111827', fontWeight: 700, fontSize: '0.975rem' }} className="truncate leading-tight">
              {report.reportName}
            </h3>
            <div className="flex items-center gap-4 mt-2" style={{ color: '#6b7280', fontSize: '0.8rem' }}>
              <span>📅 {formattedDate}</span>
              <span>🕐 {formattedTime}</span>
              {report.birthData?.placeName && (
                <span>📍 {report.birthData.placeName}</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleView}
            className="btn-gold px-3.5 py-1.5 text-xs no-print"
          >
            View
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition no-print"
              title="Delete report"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
