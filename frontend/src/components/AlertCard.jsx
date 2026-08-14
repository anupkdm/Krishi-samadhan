import React from 'react';

export default function AlertCard({ type, priority = 'medium', title, description, message, action, source, sources }) {
  const normPriority = (priority || 'medium').toLowerCase();
  const displaySources = sources || (source ? (Array.isArray(source) ? source : [source]) : []);

  return (
    <div className={`alert-card alert-${normPriority}`}>
      <div className="alert-card-header">
        <span className={`badge badge-${normPriority === 'high' ? 'danger' : normPriority === 'medium' ? 'warning' : 'success'}`}>
          {type || (normPriority.toUpperCase() + ' PRIORITY')}
        </span>
        {displaySources.length > 0 && (
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {displaySources.map((src, i) => (
              <span key={i} className="source-badge">
                <span className="source-dot Live"></span>
                {src}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="alert-card-title">{title}</div>
      <div className="alert-card-desc">{description || message}</div>
      {action && (
        <div className="alert-card-action">
          <span style={{ fontWeight: '700', flexShrink: 0 }}>💡 Recommended Action:</span>
          <span>{action}</span>
        </div>
      )}
    </div>
  );
}
