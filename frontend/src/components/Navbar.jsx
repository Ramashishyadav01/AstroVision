import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  /* ── Detect scroll (used on light pages for subtle shadow) ─────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close mobile menu on route change ──────────────────────────────────── */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isLightPage = true;
  const isActive    = (path) => location.pathname === path;
  const handleLogout = () => { logout(); navigate('/'); };

  /* ═══════════════════════════════════════════════════════════════════════════
      LIGHT THEME NAVBAR (for Landing / Home and Login pages)
  ═══════════════════════════════════════════════════════════════════════════ */
  if (isLightPage) {
    const lightLinkStyle = (path) => ({
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: 600,
      textDecoration: 'none',
      transition: 'all 0.2s',
      color: isActive(path) ? '#7c3aed' : '#374151',
      background: isActive(path) ? '#f5f3ff' : 'transparent',
    });

    return (
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(255,255,255,0.98)' : '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: scrolled ? '0 2px 14px rgba(0,0,0,0.06)' : 'none',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.25s ease',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>🌟</span>
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1.25rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #7c3aed, #1d4ed8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                AstroVision
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '4px' }}>
              {!user ? (
                <>
                  <Link to="/" style={lightLinkStyle('/')}>Home</Link>
                  <Link to="/login" style={lightLinkStyle('/login')}>Login</Link>
                  <Link to="/register" style={{
                    marginLeft: '8px',
                    padding: '9px 22px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(124,58,237,0.25)',
                    transition: 'all 0.2s',
                  }}>
                    Get Started →
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" style={lightLinkStyle('/dashboard')}>📊 Dashboard</Link>
                  <Link to="/generate" style={lightLinkStyle('/generate')}>🔮 Generate</Link>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginLeft: '12px',
                    paddingLeft: '12px',
                    borderLeft: '1px solid #e5e7eb',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed, #1d4ed8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}>
                        {user.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ color: '#111827', fontSize: '0.875rem', fontWeight: 600, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.fullName?.split(' ')[0]}
                      </span>
                    </div>
                    <button onClick={handleLogout} style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: '1.5px solid #e5e7eb',
                      background: '#ffffff',
                      color: '#374151',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: mobileOpen ? '#f5f3ff' : 'transparent',
                cursor: 'pointer',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {mobileOpen ? (
                <svg style={{ width: 22, height: 22 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg style={{ width: 22, height: 22 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu — Light */}
        {mobileOpen && (
          <div style={{
            borderTop: '1px solid #e5e7eb',
            background: '#ffffff',
            padding: '16px 24px 20px',
          }}>
            {!user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Link to="/" onClick={() => setMobileOpen(false)} style={{ padding: '10px 12px', borderRadius: '8px', color: '#111827', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{ padding: '10px 12px', borderRadius: '8px', color: '#111827', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} style={{
                  marginTop: '6px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: 700,
                  textAlign: 'center',
                }}>
                  Get Started →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', marginBottom: '6px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{user.fullName}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>{user.email}</p>
                  </div>
                </div>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{ padding: '10px 12px', borderRadius: '8px', color: '#111827', textDecoration: 'none', fontWeight: 600 }}>📊 Dashboard</Link>
                <Link to="/generate" onClick={() => setMobileOpen(false)} style={{ padding: '10px 12px', borderRadius: '8px', color: '#111827', textDecoration: 'none', fontWeight: 600 }}>🔮 Generate</Link>
                <button onClick={handleLogout} style={{ marginTop: '8px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
      DARK THEME NAVBAR (for Dashboard, Generate, Reports, Register, etc.)
  ═══════════════════════════════════════════════════════════════════════════ */
  const darkLinkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'text-yellow-400 bg-yellow-400/10'
        : 'text-white/80 hover:text-yellow-400 hover:bg-white/5'
    }`;

  return (
    <nav className="navbar-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl" style={{ animationDuration: '4s' }}>🌟</span>
            <span className="font-cinzel text-xl font-bold gradient-gold-text group-hover:opacity-90 transition">
              AstroVision
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {!user ? (
              <>
                <Link to="/" className={darkLinkClass('/')}>Home</Link>
                <Link to="/login" className={darkLinkClass('/login')}>Login</Link>
                <Link to="/register" className="btn-gold px-5 py-2 text-sm ml-2">Get Started</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={darkLinkClass('/dashboard')}>📊 Dashboard</Link>
                <Link to="/generate" className={darkLinkClass('/generate')}>🔮 Generate</Link>
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white/80 text-sm font-medium max-w-[110px] truncate">
                      {user.fullName?.split(' ')[0]}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="btn-outline-gold px-4 py-1.5 text-sm">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white/80 hover:text-yellow-400 hover:bg-white/5 transition"
          >
            {mobileOpen
              ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile menu — dark */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-cosmic-dark/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {!user ? (
              <>
                <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-white/80 hover:text-yellow-400 hover:bg-white/5">Home</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-white/80 hover:text-yellow-400 hover:bg-white/5">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block btn-gold text-center px-3 py-2 mt-2">Get Started</Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-2 mb-2 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold">
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.fullName}</p>
                    <p className="text-white/40 text-xs">{user.email}</p>
                  </div>
                </div>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-white/80 hover:text-yellow-400 hover:bg-white/5">📊 Dashboard</Link>
                <Link to="/generate" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-white/80 hover:text-yellow-400 hover:bg-white/5">🔮 Generate</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition">
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
