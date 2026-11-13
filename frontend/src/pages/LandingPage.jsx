import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─── Static Data ─────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '🪐',
    title: 'Vedic Planetary Report',
    desc: 'Precise planetary positions in Vedic (Jyotish) astrology — signs, degrees, lords & retrograde status for all 9 Grahas using the Lahiri ayanamsha.',
    tag: 'Vedic',
    tagColor: '#000000',
    tagBg: '#ede9fe',
    accent: '#7c3aed',
    shadow: 'rgba(124,58,237,0.10)',
  },
  {
    icon: '⭐',
    title: 'Western Birth Chart',
    desc: 'Complete tropical zodiac analysis — 20+ planetary bodies including Chiron, Lilith, Black Moon, True Node and all outer planets.',
    tag: 'Western',
    tagColor: '#000000',
    tagBg: '#dbeafe',
    accent: '#1d4ed8',
    shadow: 'rgba(29,78,216,0.10)',
  },
  {
    icon: '📅',
    title: 'Daily Panchang',
    desc: 'Vedic almanac with Tithi, Nakshatra, Yoga, Karana, Sunrise, Sunset and auspicious Muhurtas — for any date and location on Earth.',
    tag: 'Panchang',
    tagColor: '#000000',
    tagBg: '#fef3c7',
    accent: '#d97706',
    shadow: 'rgba(217,119,6,0.10)',
  },
];

const STEPS = [
  {
    num: '01',
    icon: '👤',
    title: 'Create Your Account',
    desc: 'Register for free in seconds. No credit card required. Just your name and email.',
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    num: '02',
    icon: '📍',
    title: 'Enter Birth Details',
    desc: 'Provide your date, time and place of birth along with geographic coordinates.',
    color: '#1d4ed8',
    bg: '#dbeafe',
  },
  {
    num: '03',
    icon: '🔮',
    title: 'Receive Your Report',
    desc: 'Instantly generate a detailed astrology report from live API data and save it.',
    color: '#b45309',
    bg: '#fef3c7',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Vedic Astrology Enthusiast',
    text: 'The planetary report is incredibly detailed. I cross-checked with my astrologer and the positions were spot on!',
    avatar: 'PS',
    color: '#7c3aed',
  },
  {
    name: 'Rahul Mehta',
    role: 'Software Developer',
    text: 'Love the clean interface. Generated my Western birth chart in under 10 seconds. The data is accurate and well presented.',
    avatar: 'RM',
    color: '#1d4ed8',
  },
  {
    name: 'Anjali Verma',
    role: 'Yoga Instructor',
    text: 'The Panchang feature is my daily go-to. Perfect for planning auspicious activities. Highly recommend!',
    avatar: 'AV',
    color: '#d97706',
  },
];

const STATS = [
  { value: '10K+', label: 'Reports Generated' },
  { value: '3', label: 'Report Types' },
  { value: '500', label: 'Free API Calls/Day' },
  { value: '100%', label: 'Real Astronomical Data' },
];

const ZODIAC = [
  '♈ Aries', '♉ Taurus', '♊ Gemini', '♋ Cancer', '♌ Leo', '♍ Virgo',
  '♎ Libra', '♏ Scorpio', '♐ Sagittarius', '♑ Capricorn', '♒ Aquarius', '♓ Pisces',
];

/* ─── Component ───────────────────────────────────────────────────────────── */
const LandingPage = () => {
  const { user } = useAuth();
  const [activeSign, setActiveSign] = useState(0);

  /* Set body to light background while mounted */
  useEffect(() => {
    document.body.classList.add('page-light');
    return () => {
      document.body.classList.remove('page-light');
    };
  }, []);

  /* Auto-rotate zodiac signs */
  useEffect(() => {
    const t = setInterval(() => setActiveSign((p) => (p + 1) % 12), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: '#ffffff', color: '#111827', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #ffffff 0%, #f5f3ff 45%, #eff6ff 75%, #ffffff 100%)',
        padding: '90px 24px 100px',
        overflow: 'hidden',
      }}>
        {/* Soft decorative background glows */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-60px', width: '420px', height: '420px',
          background: 'radial-gradient(circle, rgba(29,78,216,0.07) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', borderRadius: '100px', marginBottom: '28px',
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.20)',
            color: '#7c3aed', fontSize: '0.85rem', fontWeight: 600,
          }}>
            <span>✨</span>
            Powered by FreeAstrologyAPI · 500 free reports/day
            <span>✨</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: '24px',
            color: '#111827',
          }}>
            Discover Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #1d4ed8 50%, #d97706 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Cosmic Blueprint
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem', color: '#4b5563', maxWidth: '620px',
            margin: '0 auto 40px', lineHeight: 1.8,
          }}>
            Generate personalised Vedic &amp; Western astrology reports from real
            astronomical data. Save, revisit and explore your celestial destiny.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            {user ? (
              <Link to="/dashboard" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '15px 36px', borderRadius: '12px', textDecoration: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: '#fff', fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(124,58,237,0.30)',
                transition: 'all 0.3s',
              }}>
                🔮 Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '15px 36px', borderRadius: '12px', textDecoration: 'none',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                  color: '#fff', fontWeight: 700, fontSize: '1rem',
                  boxShadow: '0 8px 24px rgba(124,58,237,0.30)',
                  transition: 'all 0.3s',
                }}>
                  🌟 Get Started Free
                </Link>
                <Link to="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '15px 36px', borderRadius: '12px', textDecoration: 'none',
                  background: '#ffffff', color: '#111827', fontWeight: 600, fontSize: '1rem',
                  border: '1.5px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s',
                }}>
                  Sign In →
                </Link>
              </>
            )}
          </div>

          {/* Live zodiac ticker */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            padding: '10px 24px', borderRadius: '100px',
            background: '#ffffff', border: '1px solid #e5e7eb',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            fontSize: '0.875rem',
          }}>
            <span style={{ color: '#6b7280' }}>Live sign:</span>
            <span style={{
              fontWeight: 700, color: '#7c3aed', fontSize: '1rem',
              minWidth: '130px', textAlign: 'left',
              transition: 'all 0.4s',
            }}>
              {ZODIAC[activeSign]}
            </span>
            <span style={{ color: '#e5e7eb' }}>|</span>
            <span style={{ color: '#6b7280' }}>All 12 signs supported</span>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS STRIP ═══════════ */}
      <section style={{
        background: '#ffffff', padding: '40px 24px',
        borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '24px', textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily: "'Cinzel',serif", fontSize: '2.2rem', fontWeight: 700,
                color: '#111827',
              }}>{s.value}</div>
              <div style={{ color: '#4b5563', fontSize: '0.85rem', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section style={{ padding: '100px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Section label */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: '100px',
              background: '#f5f3ff', color: '#7c3aed', fontSize: '0.78rem',
              fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              Our Reports
            </span>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: '2.4rem', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>
              Three Powerful Astrology Reports
            </h2>
            <p style={{ color: '#4b5563', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Built on real astronomical calculations — not generic horoscopes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '28px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: '20px',
                border: '1.5px solid #e5e7eb',
                padding: '36px 32px',
                boxShadow: `0 4px 20px ${f.shadow}`,
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.08)`;
                  e.currentTarget.style.borderColor = f.accent;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${f.shadow}`;
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {/* Icon circle */}
                <div style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: f.tagBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', marginBottom: '20px',
                }}>
                  {f.icon}
                </div>

                {/* Tag */}
                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '100px',
                  background: f.tagBg, color: f.tagColor,
                  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', marginBottom: '14px',
                }}>
                  {f.tag}
                </span>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>
                  {f.title}
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.925rem', lineHeight: 1.7 }}>
                  {f.desc}
                </p>

                {/* Bottom link */}
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                  <Link to={user ? '/generate' : '/register'} style={{
                    color: f.accent, fontWeight: 600, fontSize: '0.9rem',
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}>
                    Generate this report →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section style={{ padding: '100px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: '100px',
              background: '#dbeafe', color: '#1d4ed8', fontSize: '0.78rem',
              fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              How It Works
            </span>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: '2.4rem', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>
              Three Simple Steps
            </h2>
            <p style={{ color: '#4b5563', fontSize: '1rem', maxWidth: '440px', margin: '0 auto' }}>
              From registration to your first cosmic report in under 2 minutes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '32px' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: '20px', padding: '36px 28px',
                textAlign: 'center', border: '1.5px solid #e5e7eb',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                transition: 'all 0.3s', position: 'relative',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)'; }}
              >
                {/* Number badge */}
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)' }}>
                  <div style={{
                    padding: '4px 14px', borderRadius: '100px',
                    background: '#111827',
                    color: '#f5c518', fontSize: '0.72rem', fontWeight: 800,
                    letterSpacing: '0.1em',
                  }}>
                    STEP {s.num}
                  </div>
                </div>

                {/* Icon */}
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  background: s.bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '2.2rem',
                  margin: '16px auto 20px',
                }}>
                  {s.icon}
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>
                  {s.title}
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section style={{ padding: '100px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: '100px',
              background: '#fef3c7', color: '#b45309', fontSize: '0.78rem',
              fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              Testimonials
            </span>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: '2.4rem', fontWeight: 700, color: '#111827' }}>
              What Our Users Say
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: '24px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: '20px', padding: '32px 28px',
                border: '1.5px solid #e5e7eb',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Stars */}
                <div style={{ color: '#f59e0b', fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '2px' }}>
                  ★★★★★
                </div>

                <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '24px', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: t.color + '15',
                    border: `1.5px solid ${t.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 700, color: t.color,
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.925rem' }}>{t.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section style={{ padding: '80px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #fbfbfe 0%, #f5f3ff 50%, #eff6ff 100%)',
            borderRadius: '28px', padding: '64px 48px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            border: '1.5px solid #e5e7eb',
            boxShadow: '0 16px 48px rgba(0,0,0,0.06)',
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '18px' }}>🌙</div>
              <h2 style={{
                fontFamily: "'Cinzel',serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)',
                fontWeight: 700, color: '#111827', marginBottom: '16px', lineHeight: 1.2,
              }}>
                Ready to Explore{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #7c3aed, #1d4ed8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  Your Destiny?
                </span>
              </h2>
              <p style={{ color: '#4b5563', fontSize: '1.05rem', maxWidth: '460px', margin: '0 auto 36px', lineHeight: 1.7 }}>
                Join thousands exploring their cosmic blueprint. Free forever — no credit card needed.
              </p>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {user ? (
                  <Link to="/generate" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '15px 36px', borderRadius: '12px', textDecoration: 'none',
                    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    color: '#ffffff', fontWeight: 700, fontSize: '1rem',
                    boxShadow: '0 8px 24px rgba(124,58,237,0.30)',
                  }}>
                    🔮 Generate a Report
                  </Link>
                ) : (
                  <>
                    <Link to="/register" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '15px 36px', borderRadius: '12px', textDecoration: 'none',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                      color: '#ffffff', fontWeight: 700, fontSize: '1rem',
                      boxShadow: '0 8px 24px rgba(124,58,237,0.30)',
                    }}>
                      ✨ Sign Up for Free
                    </Link>
                    <Link to="/login" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '15px 36px', borderRadius: '12px', textDecoration: 'none',
                      background: '#ffffff', color: '#111827', fontWeight: 600, fontSize: '1rem',
                      border: '1.5px solid #d1d5db',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}>
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Top row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px', marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #f3f4f6' }}>
            {/* Brand */}
            <div style={{ maxWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.5rem' }}>🌟</span>
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: '1.3rem', fontWeight: 700, color: '#111827' }}>
                  AstroVision
                </span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.7 }}>
                Real-time Vedic &amp; Western astrology reports powered by FreeAstrologyAPI. Free to use, accurate, and beautifully designed.
              </p>
            </div>

            {/* Links */}
            <div>
              <p style={{ color: '#111827', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>Reports</p>
              {['Vedic Planetary', 'Western Birth Chart', 'Daily Panchang'].map(l => (
                <div key={l} style={{ marginBottom: '8px' }}>
                  <Link to={user ? '/generate' : '/register'} style={{ color: '#4b5563', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}>
                    {l}
                  </Link>
                </div>
              ))}
            </div>

            <div>
              <p style={{ color: '#111827', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>Account</p>
              {[['Register', '/register'], ['Login', '/login'], ['Dashboard', '/dashboard']].map(([l, h]) => (
                <div key={l} style={{ marginBottom: '8px' }}>
                  <Link to={h} style={{ color: '#4b5563', fontSize: '0.875rem', textDecoration: 'none' }}>{l}</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.825rem' }}>
              © 2024 AstroVision. All rights reserved.
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.825rem' }}>
              Powered by{' '}
              <a href="https://freeastrologyapi.com" target="_blank" rel="noreferrer"
                style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>
                FreeAstrologyAPI.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
