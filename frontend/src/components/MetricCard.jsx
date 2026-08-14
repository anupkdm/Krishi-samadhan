import React from 'react';

export default function MetricCard({ title, value, unit, icon, trend, subtitle }) {
  return (
    <div className="metric-card">
      <div className="metric-icon-wrap">
        <span>{icon || '📊'}</span>
      </div>
      <div className="metric-details">
        <div className="metric-label">{title}</div>
        <div className="metric-value">
          <span>{value}</span>
          {unit && <span className="metric-unit">{unit}</span>}
          {trend && (
            <span className={`metric-trend ${trend}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          )}
        </div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{subtitle}</div>}
      </div>
    </div>
  );
}
