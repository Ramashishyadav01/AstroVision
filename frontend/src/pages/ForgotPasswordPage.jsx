import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../utils/api';

// Animated stars (small, reused from landing)
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 2.5 + 1,
  delay: Math.random() * 4,
  dur: Math.random() * 3 + 2,
}));

// Steps shown at the right panel
const STEPS = [
  { icon: '📧', text: 'Enter your registered email address.' },
  { icon: '📬', text: 'We\'ll email you a secure reset link.' },
  { icon: '🔑', text: 'Click the link and set your new password.' },
  { icon: '🌟', text: 'Log in and continue your cosmic journey!' },
];

const ForgotPasswordPage = () => {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');
  // Dev-mode: backend returns resetUrl in development
  const [devLink, setDevLink]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email.trim().toLowerCase());
      setSent(true);
      // If backend returned a devlink (NODE_ENV=development)
      if (res.data?.data?.resetUrl) {
        setDevLink(res.data.data.resetUrl);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cosmic-bg relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Stars */}
      <div className="stars-container">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              left: `${s.left}%`, top: `${s.top}%`,
              width: `${s.size}px`, height: `${s.size}px`,
              animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Glow blobs */}
      <div className="absolute top-20 left-16 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-16 w-72 h-72 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">

        {/* ── Left: Steps panel ─────────────────────────────────────────── */}
        <div className="hidden md:block">
          <div className="mb-8">
            <div className="text-5xl mb-4 animate-float" style={{ animationDuration: '5s' }}>🌙</div>
            <h2 className="font-cinzel text-3xl font-bold gradient-gold-text mb-3">
              Forgot Your<br/>Password?
            </h2>
            <p className="text-white/50 leading-relaxed text-sm">
              No worries — it happens to the best of us. Follow the steps
              and you'll be back exploring your cosmic blueprint in minutes.
            </p>
          </div>

          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-4 glass-card p-4 group hover:border-yellow-400/30 transition"
              >
                <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">{s.icon}</span>
                <div>
                  <span className="text-white/30 text-xs font-semibold uppercase tracking-widest block mb-0.5">
                    Step {i + 1}
                  </span>
                  <span className="text-white/70 text-sm leading-relaxed">{s.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Form / Success ─────────────────────────────────────── */}
        <div className="glass-card p-8">

          {/* ── Success State ── */}
          {sent ? (
            <div className="text-center py-4">
              {/* Animated envelope */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                  <span className="text-5xl">📬</span>
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                  ✓
                </div>
              </div>

              <h2 className="font-cinzel text-2xl font-bold text-white mb-3">
                Check Your Inbox!
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-yellow-400 font-semibold mb-5">{email}</p>
              <p className="text-white/40 text-xs leading-relaxed mb-6">
                The link expires in <strong className="text-white/60">1 hour</strong>.
                Check your spam folder if you don't see it.
              </p>

              {/* Dev-mode link box */}
              {devLink && (
                <div className="mb-6 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-400 text-xs font-bold">
                      DEV MODE
                    </div>
                    <span className="text-white/40 text-xs">Email not configured — use this link:</span>
                  </div>
                  <div className="bg-white/5 border border-yellow-400/20 rounded-xl p-3 break-all">
                    <a
                      href={devLink}
                      className="text-yellow-400 text-xs hover:text-yellow-300 transition underline"
                    >
                      {devLink}
                    </a>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => { setSent(false); setEmail(''); setDevLink(''); }}
                  className="btn-outline-gold w-full py-2.5 text-sm"
                >
                  ↩ Try a different email
                </button>
                <Link to="/login" className="btn-gold w-full py-2.5 text-sm flex items-center justify-center">
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (

          /* ── Form State ── */
          <>
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="font-cinzel text-2xl font-bold gradient-gold-text mb-2">
                Reset Password
              </h1>
              <p className="text-white/50 text-sm">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  className={`input-cosmic ${error ? 'border-red-500/50' : ''}`}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-3.5 text-base flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  '📧 Send Reset Link'
                )}
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-white/50 hover:text-yellow-400 text-sm transition group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Login
              </Link>
            </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
