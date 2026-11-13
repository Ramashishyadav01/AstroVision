import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportsAPI } from '../utils/api';
import StatCard from '../components/StatCard';
import ReportCard from '../components/ReportCard';
import LoadingSpinner from '../components/LoadingSpinner';

const QUICK_REPORTS = [
  {
    type: 'planets-extended',
    icon: '🪐',
    title: 'Vedic Planetary Report',
    desc: 'Planetary positions, signs & lords in Vedic astrology',
    badge: 'badge-vedic',
    badgeText: 'Vedic',
  },
  {
    type: 'western-planets',
    icon: '⭐',
    title: 'Western Birth Chart',
    desc: 'Tropical zodiac planetary placements & outer planets',
    badge: 'badge-western',
    badgeText: 'Western',
  },
  {
    type: 'panchang',
    icon: '📅',
    title: 'Daily Panchang',
    desc: 'Vedic almanac with Tithi, Nakshatra and muhurtas',
    badge: 'badge-panchang',
    badgeText: 'Panchang',
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState('');

  /* Set body to light background while on dashboard */
  useEffect(() => {
    document.body.classList.add('page-light');
    return () => {
      document.body.classList.remove('page-light');
    };
  }, []);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportsAPI.getAll();
      setReports(res.data?.data?.reports || []);
    } catch (err) {
      setError('Failed to load reports. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await reportsAPI.delete(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert('Failed to delete report. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const recentReports = reports.slice(0, 5);
  const reportTypes = [...new Set(reports.map((r) => r.reportType))];
  const latestDate =
    reports.length > 0
      ? new Date(reports[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '—';

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ background: '#ffffff', color: '#111827', minHeight: 'calc(100vh - 64px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Welcome Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-xl shadow-sm">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{getGreeting()},</p>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold" style={{ color: '#111827' }}>
                {user?.fullName} <span style={{ color: '#f59e0b' }}>✨</span>
              </h1>
            </div>
          </div>
          <p style={{ color: '#4b5563', fontSize: '0.9rem', marginTop: '6px' }}>
            Explore your cosmic journey — {reports.length} report{reports.length !== 1 ? 's' : ''} generated so far.
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <StatCard
            icon="📊"
            title="Total Reports"
            value={reports.length}
            color="gold"
            subtitle="All time"
          />
          <StatCard
            icon="🌌"
            title="Report Types"
            value={reportTypes.length}
            color="purple"
            subtitle="Out of 3 available"
          />
          <StatCard
            icon="🗓️"
            title="Latest Report"
            value={latestDate}
            color="blue"
            subtitle="Most recent"
          />
        </div>

        {/* ── Quick Generate ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-cinzel text-xl font-bold" style={{ color: '#111827' }}>
              🔮 Generate a Report
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {QUICK_REPORTS.map((r) => (
              <div
                key={r.type}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.3s',
                }}
                className="hover:shadow-md hover:border-purple-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`report-badge ${r.badge} text-xs`}>{r.badgeText}</span>
                    </div>
                    <h3 style={{ color: '#111827', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                      {r.title}
                    </h3>
                    <p style={{ color: '#4b5563', fontSize: '0.825rem', lineHeight: '1.6', marginBottom: '16px' }}>
                      {r.desc}
                    </p>
                    <button
                      onClick={() => navigate(`/generate?type=${r.type}`)}
                      className="btn-gold px-4 py-2 text-xs"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Reports ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-cinzel text-xl font-bold" style={{ color: '#111827' }}>
              📋 Recent Reports
            </h2>
            {reports.length > 5 && (
              <span style={{ color: '#7c3aed', fontWeight: 600, fontSize: '0.875rem' }}>
                {reports.length} total
              </span>
            )}
          </div>

          {loading ? (
            <LoadingSpinner message="Loading your reports..." />
          ) : error ? (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '32px', textAlign: 'center', color: '#dc2626' }}>
              <p>{error}</p>
              <button onClick={fetchReports} className="btn-gold mt-4 px-6 py-2 text-sm">
                Retry
              </button>
            </div>
          ) : recentReports.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #e5e7eb',
              borderRadius: '20px',
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            }}>
              <div className="text-6xl mb-4">🌌</div>
              <h3 className="font-cinzel text-xl font-bold mb-2" style={{ color: '#111827' }}>
                No Reports Yet
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '0.95rem' }}>
                Generate your first cosmic report to begin your celestial journey!
              </p>
              <button
                onClick={() => navigate('/generate')}
                className="btn-gold px-6 py-3"
              >
                🔮 Generate First Report
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  onDelete={handleDelete}
                />
              ))}
              {reports.length > 5 && (
                <div className="text-center pt-4">
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Showing 5 of {reports.length} reports. All reports are accessible via View.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
