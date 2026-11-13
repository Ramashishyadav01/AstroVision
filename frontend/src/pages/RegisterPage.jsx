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

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw]       = useState(false);
  const [showCPw, setShowCPw]     = useState(false);
  const [errors, setErrors]       = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]     = useState(false);

  /* Set body to light background while on register page */
  useEffect(() => {
    document.body.classList.add('page-light');
    return () => {
      document.body.classList.remove('page-light');
    };
  }, []);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2)
      e.fullName = 'Full name must be at least 2 characters.';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = 'Please enter a valid email address.';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      const { token, user } = res.data.data;
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ field }) =>
    errors[field] ? (
      <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '5px', display: 'flex', gap: '4px', alignItems: 'center', fontWeight: 500 }}>
        <span>⚠️</span> {errors[field]}
      </p>
    ) : null;

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.825rem',
    fontWeight: 600,
    color: '#374151',
    letterSpacing: '0.04em',
  };

  const inputStyle = (hasError, hasVal) => ({
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    background: '#ffffff',
    border: `1.5px solid ${hasError ? '#ef4444' : hasVal ? '#7c3aed' : '#d1d5db'}`,
    color: '#111827',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.25s',
    boxShadow: hasVal && !hasError ? '0 0 0 3px rgba(124,58,237,0.10)' : 'none',
  });

  const onFocus = (e) => {
    e.target.style.borderColor = '#7c3aed';
    e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)';
  };

  const onBlur = (e, field) => {
    const hasError = !!errors[field];
    const hasVal = !!form[field];
    e.target.style.borderColor = hasError ? '#ef4444' : hasVal ? '#7c3aed' : '#d1d5db';
    e.target.style.boxShadow = hasVal && !hasError ? '0 0 0 3px rgba(124,58,237,0.10)' : 'none';
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', background: '#ffffff', color: '#111827' }}>

      {/* ═══════════════════════════════════════════════════════════════════
          LEFT PANEL — Atmospheric light celestial sky
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          width: '48%',
          background: 'linear-gradient(145deg, #fcfaff 0%, #f4efff 40%, #eef3ff 75%, #fffbf2 100%)',
          borderRight: '1px solid #e5e7eb',
        }}
      >
        {/* Floating aura orbs */}
        <Orb size="380px" x="5%"  y="-10%" color="rgba(124,58,237,0.12)" blur="80px" opacity={1} delay={0} />
        <Orb size="300px" x="50%" y="45%"  color="rgba(37,99,235,0.10)"  blur="75px" opacity={1} delay={2} />
        <Orb size="240px" x="-5%" y="65%"  color="rgba(217,119,6,0.10)"  blur="70px" opacity={1} delay={1} />

        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative z-10 p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <span style={{ fontSize: '1.8rem' }}>🌟</span>
            <span className="font-cinzel text-2xl font-bold" style={{
              background: 'linear-gradient(135deg, #7c3aed, #1d4ed8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              AstroVision
            </span>
          </div>

          <h1 className="font-cinzel font-bold leading-tight mb-4" style={{ fontSize: '2.5rem', color: '#111827' }}>
            Begin Your<br/>
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #1d4ed8 50%, #d97706 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Cosmic Journey
            </span>
          </h1>

          <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.7', maxWidth: '360px' }}>
            Create your free account and get access to Vedic &amp; Western astrology
            reports powered by real astronomical calculations.
          </p>

          <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: '🔐', title: '100% Free Forever', desc: 'No credit card required. Free 500 reports/day.' },
              { icon: '📊', title: 'Save Unlimited Reports', desc: 'Review, print, and manage all your reports.' },
              { icon: '🌍', title: 'Global Precision', desc: 'Accurate calculations for any birth coordinates.' },
            ].map((f) => (
              <div key={f.title} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 18px', borderRadius: '14px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              }}>
                <span style={{ fontSize: '1.4rem' }}>{f.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{f.title}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.78rem' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-12 pt-0">
          <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
            Join thousands unlocking their celestial destiny with AstroVision.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT PANEL — Clean white register form with black text
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="flex flex-col justify-center flex-1 px-6 sm:px-10 lg:px-14 py-10"
        style={{
          background: '#ffffff',
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        <div className="relative z-10 w-full max-w-sm mx-auto">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span style={{ fontSize: '1.6rem' }}>🌟</span>
            <span className="font-cinzel font-bold text-2xl" style={{
              background: 'linear-gradient(135deg, #7c3aed, #1d4ed8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              AstroVision
            </span>
          </div>

          <div className="mb-6">
            <h2 className="font-cinzel font-bold mb-2" style={{ fontSize: '2rem', color: '#111827' }}>
              Create Account
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.925rem' }}>
              Start your cosmic journey today — it's 100% free
            </p>
          </div>

          {serverError && (
            <div style={{
              marginBottom: '18px', padding: '12px 16px', borderRadius: '12px',
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', fontSize: '0.875rem', display: 'flex', gap: '10px',
            }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span style={{ fontWeight: 500 }}>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Full Name */}
            <div>
              <label style={labelStyle}>FULL NAME</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Arjun Sharma"
                autoComplete="name"
                style={inputStyle(errors.fullName, form.fullName)}
                onFocus={onFocus}
                onBlur={(e) => onBlur(e, 'fullName')}
              />
              <FieldError field="fullName" />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle(errors.email, form.email)}
                onFocus={onFocus}
                onBlur={(e) => onBlur(e, 'email')}
              />
              <FieldError field="email" />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  style={{ ...inputStyle(errors.password, form.password), paddingRight: '44px' }}
                  onFocus={onFocus}
                  onBlur={(e) => onBlur(e, 'password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#6b7280', display: 'flex', padding: '4px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#111827'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
              <FieldError field="password" />
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>CONFIRM PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCPw ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  style={{ ...inputStyle(errors.confirmPassword, form.confirmPassword), paddingRight: '44px' }}
                  onFocus={onFocus}
                  onBlur={(e) => onBlur(e, 'confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowCPw(v => !v)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#6b7280', display: 'flex', padding: '4px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#111827'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                >
                  <EyeIcon open={showCPw} />
                </button>
              </div>
              {form.confirmPassword && (
                <p style={{
                  fontSize: '0.78rem', marginTop: '6px', fontWeight: 600,
                  color: form.password === form.confirmPassword ? '#16a34a' : '#dc2626',
                }}>
                  {form.password === form.confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                </p>
              )}
              <FieldError field="confirmPassword" />
            </div>

            {/* Submit */}
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
                  Creating Account...
                </>
              ) : '🌟 Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
