import React from 'react';

export default function EmptyState({ message = 'No records available for the selected filters.', icon = '📭' }) {
  return (
    <div className="empty-container fade-in card">
      <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{icon}</div>
      <p style={{color: 'var(--text-secondary)'}}>{message}</p>
    </div>
  );
}
