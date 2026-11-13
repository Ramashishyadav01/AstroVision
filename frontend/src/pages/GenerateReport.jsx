import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { reportsAPI } from '../utils/api';

const REPORT_TYPES = [
  {
    value: 'planets-extended',
    icon: '🪐',
    title: 'Vedic Planetary Report',
    desc: 'Get detailed planetary positions, sign lords, degrees, and retrograde status in Vedic (Lahiri) astrology.',
    badge: 'badge-vedic',
    badgeText: 'Vedic',
  },
  {
    value: 'western-planets',
    icon: '⭐',
    title: 'Western Birth Chart',
    desc: 'Tropical zodiac planetary placements including outer planets, Chiron, Lilith, and nodal axis positions.',
    badge: 'badge-western',
    badgeText: 'Western',
  },
  {
    value: 'panchang',
    icon: '📅',
    title: 'Daily Panchang',
    desc: 'Vedic almanac with Tithi, Nakshatra, Yoga, Karana, sunrise/sunset times and auspicious muhurtas.',
    badge: 'badge-panchang',
    badgeText: 'Panchang',
  },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = [
  { v: 1, l: 'January' }, { v: 2, l: 'February' }, { v: 3, l: 'March' },
  { v: 4, l: 'April' }, { v: 5, l: 'May' }, { v: 6, l: 'June' },
  { v: 7, l: 'July' }, { v: 8, l: 'August' }, { v: 9, l: 'September' },
  { v: 10, l: 'October' }, { v: 11, l: 'November' }, { v: 12, l: 'December' },
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

const tzOptions = [
  { v: -12, l: 'UTC-12:00' }, { v: -11, l: 'UTC-11:00' }, { v: -10, l: 'UTC-10:00' },
  { v: -9, l: 'UTC-09:00' }, { v: -8, l: 'UTC-08:00' }, { v: -7, l: 'UTC-07:00' },
  { v: -6, l: 'UTC-06:00' }, { v: -5, l: 'UTC-05:00' }, { v: -4, l: 'UTC-04:00' },
  { v: -3, l: 'UTC-03:00' }, { v: -2, l: 'UTC-02:00' }, { v: -1, l: 'UTC-01:00' },
  { v: 0, l: 'UTC+00:00' }, { v: 1, l: 'UTC+01:00' }, { v: 2, l: 'UTC+02:00' },
  { v: 3, l: 'UTC+03:00' }, { v: 3.5, l: 'UTC+03:30' }, { v: 4, l: 'UTC+04:00' },
  { v: 4.5, l: 'UTC+04:30' }, { v: 5, l: 'UTC+05:00' }, { v: 5.5, l: 'UTC+05:30 (IST)' },
  { v: 5.75, l: 'UTC+05:45' }, { v: 6, l: 'UTC+06:00' }, { v: 6.5, l: 'UTC+06:30' },
  { v: 7, l: 'UTC+07:00' }, { v: 8, l: 'UTC+08:00' }, { v: 9, l: 'UTC+09:00' },
  { v: 9.5, l: 'UTC+09:30' }, { v: 10, l: 'UTC+10:00' }, { v: 11, l: 'UTC+11:00' },
  { v: 12, l: 'UTC+12:00' }, { v: 13, l: 'UTC+13:00' }, { v: 14, l: 'UTC+14:00' },
];

const GenerateReport = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preType = searchParams.get('type') || '';

  const [selectedType, setSelectedType] = useState(preType);
  const [form, setForm] = useState({
    year: 1990,
    month: 1,
    date: 1,
    hours: 12,
    minutes: 0,
    seconds: 0,
    latitude: '',
    longitude: '',
    timezone: 5.5,
    placeName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  /* Set body to light background */
  useEffect(() => {
    document.body.classList.add('page-light');
    return () => {
      document.body.classList.remove('page-light');
    };
  }, []);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setApiError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'placeName' ? value : Number(value) || value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!selectedType) errs.type = 'Please select a report type.';
    if (!form.latitude && form.latitude !== 0) errs.latitude = 'Latitude is required.';
    else if (form.latitude < -90 || form.latitude > 90) errs.latitude = 'Latitude must be between -90 and 90.';
    if (!form.longitude && form.longitude !== 0) errs.longitude = 'Longitude is required.';
    else if (form.longitude < -180 || form.longitude > 180) errs.longitude = 'Longitude must be between -180 and 180.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      const payload = {
        reportType: selectedType,
        birthData: {
          year: Number(form.year),
          month: Number(form.month),
          date: Number(form.date),
          hours: Number(form.hours),
          minutes: Number(form.minutes),
          seconds: 0,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
          timezone: parseFloat(form.timezone),
          placeName: form.placeName,
        },
      };
      const res = await reportsAPI.generate(payload);
      const reportId = res.data?.data?.report?._id;
      if (reportId) {
        navigate(`/reports/${reportId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          'Failed to generate report. Please check your inputs and API key.'
      );
    } finally {
      setLoading(false);
    }
  };

  const pad = (n) => String(n).padStart(2, '0');

  const lightInputStyle = (hasError) => ({
    background: '#ffffff',
    border: `1.5px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '10px',
    color: '#111827',
    outline: 'none',
    width: '100%',
    padding: '12px 16px',
    fontSize: '0.925rem',
  });

  return (
    <div style={{ background: '#ffffff', color: '#111827', minHeight: 'calc(100vh - 64px)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🔮</div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#111827' }}>
            Generate Astrology Report
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>
            Select a report type and enter your birth details to receive your cosmic insights.
          </p>
        </div>

        {/* Step 1: Report Type */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}>
          <h2 className="font-cinzel text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#7c3aed', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            Select Report Type
          </h2>
          {errors.type && (
            <p style={{ color: '#dc2626', fontSize: '0.825rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              ⚠️ {errors.type}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {REPORT_TYPES.map((rt) => (
              <button
                key={rt.value}
                type="button"
                onClick={() => handleTypeSelect(rt.value)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: selectedType === rt.value ? '2px solid #7c3aed' : '1.5px solid #e5e7eb',
                  background: selectedType === rt.value ? '#f5f3ff' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div className="text-3xl mb-2">{rt.icon}</div>
                <span className={`report-badge ${rt.badge} mb-2 inline-block text-xs`}>{rt.badgeText}</span>
                <p style={{ color: '#111827', fontWeight: 700, fontSize: '0.9rem' }}>{rt.title}</p>
                <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px', lineHeight: 1.5 }}>{rt.desc}</p>
                {selectedType === rt.value && (
                  <div style={{ marginTop: '8px', color: '#7c3aed', fontSize: '0.75rem', fontWeight: 700 }}>✓ Selected</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Birth Details */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}>
          <h2 className="font-cinzel text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#7c3aed', color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
            Enter Birth Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Place Name */}
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>
                Place of Birth <span style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 400 }}>(optional, for display)</span>
              </label>
              <input
                type="text"
                name="placeName"
                value={form.placeName}
                onChange={handleChange}
                placeholder="e.g. New Delhi, India"
                style={lightInputStyle(false)}
              />
            </div>

            {/* Date Row */}
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>Date of Birth</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Day</label>
                  <select name="date" value={form.date} onChange={handleChange} style={lightInputStyle(false)}>
                    {days.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Month</label>
                  <select name="month" value={form.month} onChange={handleChange} style={lightInputStyle(false)}>
                    {months.map((m) => <option key={m.v} value={m.v}>{m.l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Year</label>
                  <select name="year" value={form.year} onChange={handleChange} style={lightInputStyle(false)}>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Time Row */}
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>Time of Birth</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Hour (24h)</label>
                  <select name="hours" value={form.hours} onChange={handleChange} style={lightInputStyle(false)}>
                    {hours.map((h) => <option key={h} value={h}>{pad(h)}:00</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Minute</label>
                  <select name="minutes" value={form.minutes} onChange={handleChange} style={lightInputStyle(false)}>
                    {minutes.map((m) => <option key={m} value={m}>{pad(m)}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>
                Birth Coordinates{' '}
                <a
                  href="https://www.latlong.net/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#7c3aed', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 500, marginLeft: '4px' }}
                >
                  (Find at latlong.net ↗)
                </a>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Latitude (-90 to 90)</label>
                  <input
                    type="number"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="e.g. 28.6139"
                    step="0.0001"
                    min="-90"
                    max="90"
                    style={lightInputStyle(errors.latitude)}
                  />
                  {errors.latitude && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px' }}>⚠️ {errors.latitude}</p>}
                </div>
                <div>
                  <label style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>Longitude (-180 to 180)</label>
                  <input
                    type="number"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="e.g. 77.2090"
                    step="0.0001"
                    min="-180"
                    max="180"
                    style={lightInputStyle(errors.longitude)}
                  />
                  {errors.longitude && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px' }}>⚠️ {errors.longitude}</p>}
                </div>
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>Timezone</label>
              <select name="timezone" value={form.timezone} onChange={handleChange} style={lightInputStyle(false)}>
                {tzOptions.map((t) => (
                  <option key={t.v} value={t.v}>{t.l}</option>
                ))}
              </select>
            </div>

            {/* API Error */}
            {apiError && (
              <div style={{ padding: '16px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.875rem', display: 'flex', gap: '8px' }}>
                <span>⚠️</span>
                <div>
                  <p style={{ fontWeight: 600 }}>Report Generation Failed</p>
                  <p style={{ marginTop: '4px', opacity: 0.9 }}>{apiError}</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 text-base flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Consulting the Stars...
                </>
              ) : (
                <>🔮 Generate My Report</>
              )}
            </button>
          </form>
        </div>

        {/* Info note */}
        <div style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.8rem',
          lineHeight: 1.6,
        }}>
          <span>ℹ️</span> Reports are generated from live FreeAstrologyAPI data and saved to your account.
          Each generation uses 1 API credit from your free plan (500/day limit).
        </div>

      </div>
    </div>
  );
};

export default GenerateReport;
