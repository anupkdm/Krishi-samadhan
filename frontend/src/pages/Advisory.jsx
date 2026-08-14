import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import AlertCard from '../components/AlertCard';
import advisoryService from '../services/advisoryService';
import DEFAULT_LOCATION from '../config/locations';

const Advisory = () => {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdvisories = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = DEFAULT_LOCATION.latitude || DEFAULT_LOCATION.lat || 19.8833;
      const lon = DEFAULT_LOCATION.longitude || DEFAULT_LOCATION.lon || 74.4833;
      const response = await advisoryService.getAdvisories(lat, lon);
      const list = response?.records || response?.advisories || (Array.isArray(response) ? response : []);
      setAdvisories(list);
    } catch (err) {
      console.error('Advisory fetch error:', err);
      setError('Failed to fetch agricultural advisories.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const lat = DEFAULT_LOCATION.latitude || DEFAULT_LOCATION.lat || 19.8833;
      const lon = DEFAULT_LOCATION.longitude || DEFAULT_LOCATION.lon || 74.4833;
      const response = await advisoryService.generateAdvisories(lat, lon);
      const list = response?.records || response?.advisories || (Array.isArray(response) ? response : []);
      setAdvisories(list);
    } catch (err) {
      console.error('Advisory generation error:', err);
      setError('Failed to generate fresh advisories.');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, []);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Farmer Advisory & Decision Support</h1>
            <p>Integrated multi-source intelligence converting telemetry into actionable agronomic decisions.</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={generating || loading}
          >
            {generating ? '⚙️ Synthesizing Rules...' : '🔄 Re-Run Advisory Engine'}
          </button>
        </div>
      </div>

      {/* Advisory Architecture Engine Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #f6faf7 100%)' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '1rem', textAlign: 'center' }}>
          🌾 Unified Decision-Support Pipeline
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
              🌤️ Weather (Open-Meteo)
            </span>
            <span style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
              🌱 Soil (NPK & pH)
            </span>
            <span style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
              🛰️ Satellite NDVI
            </span>
            <span style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
              💰 APMC Mandi
            </span>
          </div>

          <div style={{ fontSize: '1.5rem', color: 'var(--primary-500)', fontWeight: 'bold' }}>➔</div>

          <div style={{ background: 'var(--primary-600)', color: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: '800', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(45,106,79,0.3)' }}>
            ⚙️ Advisory Rule Engine
          </div>

          <div style={{ fontSize: '1.5rem', color: 'var(--primary-500)', fontWeight: 'bold' }}>➔</div>

          <div style={{ background: 'var(--primary-100)', color: 'var(--primary-900)', border: '1px solid var(--primary-300)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '0.85rem' }}>
            ✅ Prioritized Farmer Advisories
          </div>
        </div>
      </div>

      {/* Advisory Feed */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📋</span>
          <span>Active Farm Advisories ({advisories.length})</span>
        </h2>
      </div>

      {loading || generating ? (
        <LoadingState message="Cross-referencing weather risk, soil nutrient levels, and seasonal crop cycles..." />
      ) : error ? (
        <ErrorState message={error} onRetry={handleGenerate} />
      ) : advisories.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
          <h3>All Conditions Optimal</h3>
          <p style={{ color: 'var(--text-muted)' }}>No high-priority agricultural interventions currently required.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {advisories.map((advisory, idx) => (
            <AlertCard
              key={idx}
              type={advisory.type}
              priority={advisory.priority}
              title={advisory.title}
              description={advisory.description}
              action={advisory.action}
              source={advisory.source}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Advisory;
