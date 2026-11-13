import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Password strength checker
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak',   color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair',   color: 'bg-orange-400' };
  if (score <= 3) return { score, label: 'Good',   color: 'bg-yellow-400' };
  return           { score, label: 'Strong', color: 'bg-green-500' };
};

const StrengthBar = ({ password }) => {
  const { score, label, color } = getStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
              i <= score ? color : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${score <= 1 ? 'text-red-400' : score <= 2 ? 'text-orange-400' : score <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
        Password strength: {label}
      </p>
    </div>
  );
};

const EyeIcon = ({ open }) => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.94 0C6.44 7.11 9 5 12 5s5.56 2.11 6.94 7c-1.38 4.89-3.94 7-6.94 7s-5.56-2.11-6.94-7z" />
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-3 0-5.56-2.11-6.94-7a10.07 10.07 0 012.17-3.86M9.88 9.88A3 3 0 0114.12 14.12M3 3l18 18" />
      </>
    )}
  </svg>
);

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate  = useNavigate();
  const { login } = useAuth();

  // Token verification
  const [verifying,  setVerifying]  = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenEmail, setTokenEmail] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Form
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw,          setShowPw]          = useState(false);
  const [showConfirmPw,   setShowConfirmPw]   = useState(false);
  const [errors,          setErrors]          = useState({});
  const [loading,         setLoading]         = useState(false);
  const [serverError,     setServerError]     = useState('');
  const [success,         setSuccess]         = useState(false);

  // ── Verify token on mount ─────────────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setTokenError('No reset token found in the URL.');
      setVerifying(false);
      return;
    }
    authAPI
      .verifyResetToken(token)
      .then((res) => {
        setTokenValid(true);
        setTokenEmail(res.data?.data?.email || '');
      })
      .catch((err) => {
        let message = err.response?.data?.message;
        if (!message) {
          if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
            message = 'Cannot connect to backend server. Please verify your backend API URL and network connection.';
          } else {
            message = 'This reset link is invalid or has already expired.';
          }
        }
        setTokenError(message);
      })
      .finally(() => setVerifying(false));
  }, [token]);

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!password || password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    if (!confirmPassword)
      errs.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';

    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');
    try {
      const res = await authAPI.resetPassword(token, password, confirmPassword);
      const { token: jwt, user } = res.data.data;
      setSuccess(true);
      // Auto-login then redirect after 2s
      setTimeout(() => {
        login(jwt, user);
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      let message = err.response?.data?.message;
      if (!message) {
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          message = 'Cannot connect to backend server. Please verify your backend API URL and network connection.';
        } else {
          message = err.message || 'Failed to reset password. Please try again.';
        }
      }
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Render: verifying ─────────────────────────────────────────────────────
  if (verifying) {
    return <LoadingSpinner fullScreen message="Verifying your reset link..." />;
  }

  // ── Render: invalid token ─────────────────────────────────────────────────
  if (!tokenValid) {
    return (
      <div className="cosmic-bg flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="glass-card max-w-md w-full p-10 text-center">
          {/* Broken link icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <span className="text-5xl">🔗</span>
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">
              ✕
            </div>
          </div>

          <h2 className="font-cinzel text-2xl font-bold text-white mb-3">Link Expired</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">{tokenError}</p>

          <div className="space-y-3">
            <Link to="/forgot-password" className="btn-gold w-full py-3 flex items-center justify-center">
              📧 Request a New Link
            </Link>
            <Link to="/login" className="btn-outline-gold w-full py-3 flex items-center justify-center text-sm">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: success ───────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="cosmic-bg flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="glass-card max-w-md w-full p-10 text-center">
          {/* Animated success ring */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <span className="text-5xl">✅</span>
            </div>
          </div>

          <h2 className="font-cinzel text-2xl font-bold gradient-gold-text mb-3">
            Password Reset!
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-2">
            Your password has been updated successfully.
          </p>
          <p className="text-white/40 text-xs mb-6">
            Redirecting you to your dashboard...
          </p>

          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <div className="w-5 h-5 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
            <span className="text-sm">Logging you in automatically</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: main form ─────────────────────────────────────────────────────
  return (
    <div className="cosmic-bg flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12 overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-card relative z-10 w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-float" style={{ animationDuration: '4s' }}>🔑</div>
          <h1 className="font-cinzel text-2xl font-bold gradient-gold-text mb-2">
            Set New Password
          </h1>
          {tokenEmail && (
            <p className="text-white/40 text-sm">
              for <span className="text-yellow-400/80">{tokenEmail}</span>
            </p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0">⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                placeholder="Min. 6 characters"
                className={`input-cosmic pr-11 ${errors.password ? 'border-red-500/50' : ''}`}
                autoFocus
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-yellow-400 transition"
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
            <StrengthBar password={password} />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })); }}
                placeholder="Re-enter new password"
                className={`input-cosmic pr-11 ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-yellow-400 transition"
              >
                <EyeIcon open={showConfirmPw} />
              </button>
            </div>
            {/* Match indicator */}
            {confirmPassword && (
              <p className={`text-xs mt-1.5 flex items-center gap-1 ${
                password === confirmPassword ? 'text-green-400' : 'text-red-400'
              }`}>
                {password === confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
              </p>
            )}
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3.5 text-base flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Resetting Password...
              </>
            ) : (
              '🔑 Reset My Password'
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 flex items-center justify-between text-xs text-white/30">
          <Link to="/login" className="hover:text-yellow-400 transition">← Back to Login</Link>
          <Link to="/forgot-password" className="hover:text-yellow-400 transition">Request new link</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
