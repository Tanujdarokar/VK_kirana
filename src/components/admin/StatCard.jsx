import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = '#10b981', trend, isCurrency = true }) => {
  return (
    <div
      className="card"
      style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '6px' }}>
          {isCurrency ? `₹${Number(value || 0).toLocaleString('en-IN')}` : value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {subtitle}
          </div>
        )}
      </div>

      {Icon && (
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: `${color}18`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};
