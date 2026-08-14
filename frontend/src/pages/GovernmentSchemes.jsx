import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SourceBadge from '../components/SourceBadge';
import schemesService from '../services/schemesService';

const GovernmentSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'income support', 'crop insurance', 'solar/irrigation', 'soil health', 'credit', 'market', 'infrastructure', 'sustainability'];

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await schemesService.getSchemes(
        search || undefined,
        category !== 'All' ? category : undefined
      );
      setSchemes(response?.schemes || []);
    } catch (err) {
      console.error('Schemes fetch error:', err);
      setError('Failed to load government schemes repository.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Government Agricultural Schemes</h1>
            <p>Verified central and state agricultural support programs, financial subsidies, and credit facilities.</p>
          </div>
          <SourceBadge source="Ministry of Agriculture & FW" status="Verified Portal Data" />
        </div>
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <span style={{ fontSize: '0.88rem', color: '#b45309' }}>
          <strong>Official Advisory:</strong> Always verify current eligibility, documentation criteria, and application deadlines on the respective official ministry portals before applying.
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by scheme name or benefit (e.g. Kisan, Solar, Insurance)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ flex: '0 0 220px' }}>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ textTransform: 'capitalize' }}
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            🔍 Search Schemes
          </button>
        </form>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <LoadingState message="Loading government scheme catalog..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSchemes} />
      ) : schemes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏛️</div>
          <h3>No matching agricultural schemes found</h3>
          <p>Try searching with another keyword or resetting the category filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {schemes.map(scheme => (
            <div key={scheme.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', margin: 0 }}>
                  {scheme.name}
                </h3>
                <span className="badge badge-info" style={{ flexShrink: 0, textTransform: 'capitalize' }}>
                  {scheme.category}
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', flexGrow: 1 }}>
                {scheme.description}
              </p>

              <div style={{ background: 'var(--primary-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-100)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--primary-900)' }}>💰 Benefits:</strong> {scheme.benefits}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                <strong>👤 Eligibility:</strong> {scheme.eligibility}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{scheme.ministry || 'Government of India'}</span>
                <a
                  href={scheme.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  Visit Portal ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default GovernmentSchemes;
