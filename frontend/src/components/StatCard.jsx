import React from 'react';

const StatCard = ({ icon, title, value, color = 'gold', subtitle }) => {
  const colorMap = {
    gold: {
      bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      border: '#fde68a',
      titleColor: '#92400e',
      valColor: '#78350f',
      subColor: '#b45309',
    },
    purple: {
      bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      border: '#ddd6fe',
      titleColor: '#5b21b6',
      valColor: '#4c1d95',
      subColor: '#6d28d9',
    },
    blue: {
      bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      border: '#bfdbfe',
      titleColor: '#1e40af',
      valColor: '#1e3a8a',
      subColor: '#2563eb',
    },
    green: {
      bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      border: '#bbf7d0',
      titleColor: '#166534',
      valColor: '#14532d',
      subColor: '#15803d',
    },
  };

  const scheme = colorMap[color] || colorMap.gold;

  return (
    <div
      style={{
        background: scheme.bg,
        border: `1.5px solid ${scheme.border}`,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        transition: 'all 0.3s',
      }}
      className="hover:scale-105"
    >
      <div className="flex items-start justify-between">
        <div>
          <p style={{ color: scheme.titleColor, fontSize: '0.875rem', fontWeight: 600 }}>
            {title}
          </p>
          <p style={{ color: scheme.valColor, fontSize: '2.2rem', fontWeight: 800, marginTop: '4px', lineHeight: 1.1 }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ color: scheme.subColor, fontSize: '0.78rem', marginTop: '6px', fontWeight: 500 }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
