import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

/* ── Floating soft orbs used in the left panel ─────────────────────────── */
const Orb = ({ size, x, y, color, blur, opacity, delay }) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      left: x,
      top: y,
      background: color,
      borderRadius: '50%',
      filter: `blur(${blur})`,
      opacity,
      animation: `float ${6 + delay}s ease-in-out ${delay}s infinite`,
      pointerEvents: 'none',
    }}
  />
);

/* ── Eye toggle icon ─────────────────────────────────────────────────────── */
const EyeIcon = ({ open }) => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.94 0C6.44 7.11 9 5 12 5s5.56 2.11 6.94 7c-1.38 4.89-3.94 7-6.94 7s-5.56-2.11-6.94-7z"/>
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-3 0-5.56-2.11-6.94-7a10.07 10.07 0 012.17-3.86M9.88 9.88A3 3 0 0114.12 14.12M3 3l18 18"/>
      </>
    )}
  </svg>
);

/* ── Zodiac signs carousel on left panel ─────────────────────────────────── */
const SIGNS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  /* Set body to light background while on login page */
  useEffect(() => {
    document.body.classList.add('page-light');
    return () => {
      document.body.classList.remove('page-light');
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      const { token, user } = res.data.data;
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      let message = err.response?.data?.message;
      if (!message) {
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          message = 'Cannot connect to backend server. Please verify your backend API URL and network connection.';
        } else if (err.response?.status === 404) {
          message = 'API endpoint not found (404). Please ensure the backend is running and VITE_API_BASE_URL is configured.';
        } else {
          message = err.message || 'Invalid email or password.';
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', background: '#ffffff', color: '#111827' }}>

      {/* ═══════════════════════════════════════════════════════════════════
          LEFT PANEL — Atmospheric light celestial sky
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          width: '50%',
          background: 'linear-gradient(145deg, #fcfaff 0%, #f4efff 40%, #eef3ff 75%, #fffbf2 100%)',
          borderRight: '1px solid #e5e7eb',
        }}
      >
        {/* Floating soft aura orbs */}
        <Orb size="380px" x="5%"  y="-10%" color="rgba(124,58,237,0.12)" blur="80px"  opacity={1} delay={0} />
        <Orb size="300px" x="55%" y="40%"  color="rgba(37,99,235,0.10)"  blur="75px"  opacity={1} delay={2} />
        <Orb size="250px" x="-5%" y="60%"  color="rgba(217,119,6,0.10)"  blur="70px"  opacity={1} delay={1} />
        <Orb size="200px" x="60%" y="10%"  color="rgba(16,185,129,0.08)" blur="60px"  opacity={1} delay={3} />

        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Top content */}
        <div className="relative z-10 p-10 pt-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <span style={{ fontSize: '1.8rem' }}>🌟</span>
            <span className="font-cinzel text-2xl font-bold" style={{
              background: 'linear-gradient(135deg, #7c3aed, #1d4ed8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              AstroVision
            </span>
          </div>

          {/* Main headline */}
          <div>
            <h1 className="font-cinzel font-bold leading-tight mb-4"
              style={{ fontSize: '2.6rem', color: '#111827' }}>
              Your Stars Are<br/>
              <span style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #1d4ed8 50%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Waiting For You
              </span>
            </h1>
            <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.7', maxWidth: '380px' }}>
              Sign in and unlock your personalised Vedic &amp; Western astrology
              reports, generated live from real celestial data.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-10">
            {[
              { icon: '🪐', text: 'Vedic Planetary Report' },
              { icon: '⭐', text: 'Western Birth Chart' },
              { icon: '📅', text: 'Daily Panchang' },
            ].map((f) => (
              <div key={f.text} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '9px 18px',
                borderRadius: '100px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                color: '#374151',
                fontSize: '0.825rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}>
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Zodiac ring */}
        <div className="relative z-10 p-10 pb-12">
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
              All 12 Zodiac Signs Supported
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {SIGNS.map((s, i) => (
                <div key={i} style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  color: '#4b5563',
                  fontSize: '0.95rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  cursor: 'default',
                }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT PANEL — Clean white login form with black text
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="flex flex-col justify-center flex-1 px-6 sm:px-12 lg:px-16 py-12"
        style={{
          background: '#ffffff',
          position: 'relative',
        }}
      >
        <div className="relative z-10 w-full max-w-sm mx-auto">

          {/* Mobile logo (only shows on small screens) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span style={{ fontSize: '1.6rem' }}>🌟</span>
            <span className="font-cinzel font-bold text-2xl" style={{
              background: 'linear-gradient(135deg, #7c3aed, #1d4ed8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              AstroVision
            </span>
          </div>

          {/* Greeting */}
          <div className="mb-8">
            <h2 className="font-cinzel font-bold mb-2"
              style={{ fontSize: '2.1rem', color: '#111827', lineHeight: 1.2 }}>
              Welcome Back
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Sign in to your AstroVision account
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              marginBottom: '20px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span style={{ fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Email */}
            <div>
              <label style={{
                display: 'block', marginBottom: '8px',
                fontSize: '0.825rem', fontWeight: 600,
                color: '#374151',
                letterSpacing: '0.04em',
              }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: `1.5px solid ${form.email ? '#7c3aed' : '#d1d5db'}`,
                  color: '#111827',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.25s',
                  boxShadow: form.email ? '0 0 0 3px rgba(124,58,237,0.10)' : 'none',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#7c3aed';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = form.email ? '#7c3aed' : '#d1d5db';
                  e.target.style.boxShadow = form.email ? '0 0 0 3px rgba(124,58,237,0.10)' : 'none';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{
                  fontSize: '0.825rem', fontWeight: 600,
                  color: '#374151',
                  letterSpacing: '0.04em',
                }}>
                  PASSWORD
                </label>
                <Link to="/forgot-password" style={{
                  fontSize: '0.825rem',
                  color: '#7c3aed',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'opacity 0.2s',
                }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '13px 44px 13px 16px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: `1.5px solid ${form.password ? '#7c3aed' : '#d1d5db'}`,
                    color: '#111827',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.25s',
                    boxShadow: form.password ? '0 0 0 3px rgba(124,58,237,0.10)' : 'none',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#7c3aed';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = form.password ? '#7c3aed' : '#d1d5db';
                    e.target.style.boxShadow = form.password ? '0 0 0 3px rgba(124,58,237,0.10)' : 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex', alignItems: 'center',
                    padding: '4px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#111827'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: loading
                  ? '#e5e7eb'
                  : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                border: 'none',
                color: loading ? '#9ca3af' : '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '6px',
                transition: 'all 0.3s',
                boxShadow: loading ? 'none' : '0 4px 18px rgba(124,58,237,0.30)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.45)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(124,58,237,0.30)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '18px', height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Signing In...
                </>
              ) : (
                <>🌟 Sign In</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Register link */}
          <p style={{
            textAlign: 'center',
            color: '#4b5563',
            fontSize: '0.9rem',
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: '#7c3aed',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Create one for free
            </Link>
          </p>

          {/* Trust badges */}
          <div style={{
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
          }}>
            {[
              { icon: '🔒', text: 'Secure Login' },
              { icon: '🛡️', text: 'JWT Protected' },
              { icon: '🌐', text: 'Live API Data' },
            ].map((b) => (
              <div key={b.text} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '4px',
                color: '#6b7280',
                fontSize: '0.72rem',
                letterSpacing: '0.02em',
                fontWeight: 500,
              }}>
                <span style={{ fontSize: '1.1rem' }}>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
