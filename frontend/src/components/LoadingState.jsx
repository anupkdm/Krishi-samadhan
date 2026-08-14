import React from 'react';

export default function LoadingState({ message = 'Loading agricultural data...' }) {
  return (
    <div className="loading-container fade-in">
      <div className="spinner"></div>
      <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>{message}</p>
    </div>
  );
}
