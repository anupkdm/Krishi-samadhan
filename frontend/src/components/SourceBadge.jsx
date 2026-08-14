import React from 'react';

export default function SourceBadge({ source, status = 'Live', date }) {
  const statusClass = status ? status.split(' ')[0] : 'Live';
  
  return (
    <span className="source-badge">
      <span className={`source-dot ${statusClass}`}></span>
      <span><strong>Source:</strong> {source}</span>
      {status && <span>• <span style={{ color: 'var(--primary-700)' }}>{status}</span></span>}
      {date && <span>• {date}</span>}
    </span>
  );
}
