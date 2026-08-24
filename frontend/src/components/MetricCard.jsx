import React from 'react';

export default function MetricCard({ title, value, unit, icon, trend, subtitle }) {
  return (
    <div className="metric-card">
      <div className="metric-icon-wrap">
        <span>{icon || '📊'}</span>
      </div>
      <div className="metric-details">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="metric-label">{title}</div>
          {trend && (
            <span className={`metric-trend ${trend}`}>
              {trend === 'up' ? 'Optimal ↑' : trend === 'down' ? 'Alert ↓' : 'Stable →'}
            </span>
          )}
        </div>
        <div className="metric-value">
          <span>{value}</span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>
        {subtitle && <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>{subtitle}</div>}
      </div>
    </div>
  );
}
