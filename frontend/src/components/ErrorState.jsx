import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-container slide-up">
      <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⚠️</div>
      <h3 style={{color: 'var(--error)'}}>Something went wrong</h3>
      <p style={{color: 'var(--text-secondary)'}}>{message}</p>
      {onRetry && <button className="btn btn-outline" onClick={onRetry} style={{marginTop: '1rem'}}>Try Again</button>}
    </div>
  );
}
