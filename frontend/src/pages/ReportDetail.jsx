import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

// ── Helpers ─────────────────────────────────────────────
const REPORT_META = {
  'planets-extended': { icon: '🪐', label: 'Vedic Planetary Report', badge: 'badge-vedic' },
  'western-planets': { icon: '⭐', label: 'Western Birth Chart', badge: 'badge-western' },
  panchang: { icon: '📅', label: 'Daily Panchang', badge: 'badge-panchang' },
};

const formatDeg = (deg) => (typeof deg === 'number' ? `${deg.toFixed(2)}°` : deg || '—');

// ── Sub-components ───────────────────────────────────────

/** Render Vedic Planets Extended table */
const VedicPlanetsTable = ({ data }) => {
  const planets = Array.isArray(data) ? data : data?.planets || data?.output || [];
  if (!planets || planets.length === 0) {
    return <RawJson data={data} />;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {['Planet', 'Full Degree', 'Sign', 'Sign Num', 'Sign Lord', 'Nakshatra', 'Retrograde'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {planets.map((p, i) => (
            <tr key={i} className="hover:bg-purple-50/40 transition">
              <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                {p.name || p.planet || `Planet ${i + 1}`}
              </td>
              <td className="px-4 py-3 text-amber-700 font-mono font-semibold whitespace-nowrap">
                {formatDeg(p.fullDegree ?? p.full_degree ?? p.degree)}
              </td>
              <td className="px-4 py-3 text-purple-700 font-medium whitespace-nowrap">
                {p.sign || '—'}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {p.signNum ?? p.sign_num ?? '—'}
              </td>
              <td className="px-4 py-3 text-blue-700 font-medium whitespace-nowrap">
                {p.signLord ?? p.sign_lord ?? '—'}
              </td>
              <td className="px-4 py-3 text-emerald-700 font-medium whitespace-nowrap">
                {p.nakshatra || '—'}
              </td>
              <td className="px-4 py-3">
                {p.isRetro === 'true' || p.isRetro === true || p.retrograde === true ? (
                  <span className="text-red-600 font-bold">℞ Yes</span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** Render Western Planets table */
const WesternPlanetsTable = ({ data }) => {
  const planets = Array.isArray(data) ? data : data?.planets || data?.output || data?.bodies || [];
  if (!planets || planets.length === 0) {
    return <RawJson data={data} />;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {['Planet', 'Degree', 'Sign', 'Retrograde'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {planets.map((p, i) => (
            <tr key={i} className="hover:bg-blue-50/40 transition">
              <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                {p.name || p.planet || `Planet ${i + 1}`}
              </td>
              <td className="px-4 py-3 text-amber-700 font-mono font-semibold">
                {formatDeg(p.fullDegree ?? p.full_degree ?? p.degree)}
              </td>
              <td className="px-4 py-3 text-blue-700 font-medium">
                {p.sign || p.zodiacSign || '—'}
              </td>
              <td className="px-4 py-3">
                {p.isRetro === 'true' || p.isRetro === true || p.retrograde === true ? (
                  <span className="text-red-600 font-bold">℞ Yes</span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** Render Panchang as grid */
const PanchangGrid = ({ data }) => {
  const entries = [];
  const flatten = (obj, prefix = '') => {
    if (!obj || typeof obj !== 'object') return;
    Object.entries(obj).forEach(([k, v]) => {
      const label = (prefix ? `${prefix} › ` : '') + k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        flatten(v, label);
      } else if (Array.isArray(v)) {
        entries.push({ label, value: v.join(', ') });
      } else if (v !== null && v !== undefined && v !== '') {
        entries.push({ label, value: String(v) });
      }
    });
  };
  flatten(data);

  if (entries.length === 0) return <RawJson data={data} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {entries.map((e, i) => (
        <div key={i} style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            {e.label}
          </p>
          <p style={{ color: '#111827', fontWeight: 700, fontSize: '0.925rem' }}>
            {e.value}
          </p>
        </div>
      ))}
    </div>
  );
};

/** Fallback raw JSON viewer */
const RawJson = ({ data }) => (
  <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
    <p style={{ color: '#b45309', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Raw API Response:</p>
    <pre style={{ color: '#374151', fontSize: '0.8rem', overflow: 'auto', maxHeight: '380px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

// ── Main Component ───────────────────────────────────────
const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  /* Set body to light background */
  useEffect(() => {
    document.body.classList.add('page-light');
    return () => {
      document.body.classList.remove('page-light');
    };
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await reportsAPI.getOne(id);
        setReport(res.data?.data?.report);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this report permanently?')) return;
    setDeleting(true);
    try {
      await reportsAPI.delete(id);
      navigate('/dashboard');
    } catch {
      alert('Failed to delete report.');
      setDeleting(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) return <LoadingSpinner fullScreen message="Loading your cosmic report..." />;

  if (error) {
    return (
      <div style={{ background: '#ffffff', color: '#111827', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#ffffff', border: '1.5px solid #e5e7eb', borderRadius: '20px', padding: '40px', textAlign: 'center', maxWidth: '440px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="font-cinzel text-xl font-bold mb-2" style={{ color: '#111827' }}>Report Not Found</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.9rem' }}>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-gold px-6 py-3">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const meta = REPORT_META[report.reportType] || { icon: '🌟', label: report.reportType, badge: 'badge-panchang' };
  const bd = report.birthData || {};
  const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedTime = new Date(report.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div style={{ background: '#ffffff', color: '#111827', minHeight: 'calc(100vh - 64px)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Back + Actions bar */}
        <div className="flex items-center justify-between mb-6 no-print">
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              color: '#4b5563', fontSize: '0.875rem', fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer',
            }}
            className="hover:text-purple-600 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handlePrint} className="btn-outline-gold px-4 py-2 text-sm flex items-center gap-2">
              🖨️ Print
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition flex items-center gap-2 disabled:opacity-50"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
              ) : '🗑️'}
              Delete
            </button>
          </div>
        </div>

        {/* Report Header */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e5e7eb',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-7xl">{meta.icon}</div>
            <div className="flex-1">
              <div className={`report-badge ${meta.badge} mb-2`}>{meta.label}</div>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold mb-2 leading-tight" style={{ color: '#111827' }}>
                {report.reportName}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                <span>📅 Generated: {formattedDate} at {formattedTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Birth Details */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}>
          <h2 className="font-cinzel text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
            👤 Birth Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { l: 'Date', v: `${bd.date}/${bd.month}/${bd.year}` },
              { l: 'Time', v: `${String(bd.hours).padStart(2,'0')}:${String(bd.minutes || 0).padStart(2,'0')}` },
              { l: 'Place', v: bd.placeName || '—' },
              { l: 'Latitude', v: bd.latitude ? `${bd.latitude}°` : '—' },
              { l: 'Longitude', v: bd.longitude ? `${bd.longitude}°` : '—' },
              { l: 'Timezone', v: `UTC${bd.timezone >= 0 ? '+' : ''}${bd.timezone}` },
            ].map((item) => (
              <div key={item.l} style={{ background: '#f9fafb', borderRadius: '12px', padding: '12px 16px', border: '1px solid #f3f4f6' }}>
                <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {item.l}
                </p>
                <p style={{ color: '#111827', fontWeight: 700, fontSize: '0.95rem' }}>
                  {item.v}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Data */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}>
          <h2 className="font-cinzel text-lg font-bold mb-5 flex items-center gap-2" style={{ color: '#111827' }}>
            {meta.icon} Report Results
          </h2>

          {!report.reportData ? (
            <div className="text-center py-8 text-gray-400">No report data available.</div>
          ) : report.reportType === 'planets-extended' ? (
            <VedicPlanetsTable data={report.reportData} />
          ) : report.reportType === 'western-planets' ? (
            <WesternPlanetsTable data={report.reportData} />
          ) : report.reportType === 'panchang' ? (
            <PanchangGrid data={report.reportData} />
          ) : (
            <RawJson data={report.reportData} />
          )}
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-gray-400 text-xs">
          Data sourced from FreeAstrologyAPI.com • Report ID: {report._id}
        </div>

      </div>
    </div>
  );
};

export default ReportDetail;
