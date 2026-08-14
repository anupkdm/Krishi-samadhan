import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SourceBadge from '../components/SourceBadge';
import soilService from '../services/soilService';
import { useAuth } from '../context/AuthContext';

const Soil = () => {
  const { activeLocation } = useAuth();
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSoilData = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = activeLocation.latitude || 19.8833;
      const lon = activeLocation.longitude || 74.4833;
      const response = await soilService.getSoilData(lat, lon);
      setSoilData(response);
    } catch (err) {
      console.error('Soil fetch error:', err);
      setError('Failed to fetch soil intelligence data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoilData();
  }, [activeLocation]);

  const renderProgressBar = (label, value, min, max, unit, statusText) => {
    const numVal = typeof value === 'number' ? value : parseFloat(value) || 0;
    const percentage = Math.max(0, Math.min(100, ((numVal - min) / (max - min)) * 100));
    return (
      <div className="progress-wrapper">
        <div className="progress-header">
          <span style={{ color: 'var(--text-main)' }}>{label}</span>
          <span>
            <strong>{numVal} {unit}</strong>
            {statusText && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '0.35rem' }}>({statusText})</span>}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message={`Retrieving soil health profile and nutrient indicators for ${activeLocation.name}...`} />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState message={error} onRetry={fetchSoilData} />
      </DashboardLayout>
    );
  }

  const score = soilData?.soilHealthScore ?? 78;
  const moisture = soilData?.moisture ?? 38.5;
  const pH = soilData?.pH ?? 7.6;
  const nitrogen = soilData?.nitrogen ?? 240;
  const phosphorus = soilData?.phosphorus ?? 24;
  const potassium = soilData?.potassium ?? 310;
  const organicCarbon = soilData?.organicCarbon ?? soilData?.organicMatter ?? 0.68;
  const soilType = activeLocation.soilType || soilData?.soilType || 'Vertisol (Deep Black Cotton Soil)';

  const getRecommendationList = (recs) => {
    if (Array.isArray(recs)) return recs;
    if (typeof recs === 'object' && recs !== null) {
      return Object.values(recs).filter(v => typeof v === 'string');
    }
    if (typeof recs === 'string') return [recs];
    return [
      `Apply organic farmyard manure (5 tonnes/acre) to enhance soil organic carbon in ${activeLocation.district} soils.`,
      `Ensure ridge and furrow planting for adequate drainage in heavy ${soilType}.`,
      `Apply Urea in split doses (50% basal, 25% at tillering, 25% at panicle emergence) for local crops (${activeLocation.primaryCrops?.slice(0, 3).join(', ') || 'Onion, Wheat'}).`,
      'Incorporate bio-fertilizers like Azotobacter and PSB to improve nutrient bioavailability.'
    ];
  };

  const recommendations = getRecommendationList(soilData?.recommendations);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Soil Health & Nutrients</h1>
            <p>Soil chemistry, macronutrients (NPK), moisture profile, and agronomic conditioning for <strong>{activeLocation.name}</strong>.</p>
          </div>
          <SourceBadge source="SoilGrids / Regional Agronomy Lab" status="Optimal" />
        </div>
      </div>

      {/* Main Soil Score Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', background: 'linear-gradient(135deg, #ffffff 0%, #f6faf7 100%)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Overall Soil Health Index ({activeLocation.district})
          </div>
          <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--primary-700)', lineHeight: 1, margin: '0.5rem 0' }}>
            {score}<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <span className="badge badge-success">● Good Soil Fertility</span>
        </div>

        <div style={{ maxWidth: '420px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
            Classification: {soilType}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Typical soil profile for {activeLocation.name} ({activeLocation.latitude}°N, {activeLocation.longitude}°E). Suitable for {activeLocation.primaryCrops?.join(', ') || 'Onion, Wheat, Pomegranate'}.
          </p>
        </div>
      </div>

      {/* 3 Columns: Physical, Chemical, Nutrients */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3>💧 Physical Properties</h3>
          </div>
          <div style={{ paddingTop: '0.5rem' }}>
            {renderProgressBar('Soil Moisture', moisture, 0, 100, '%', 'Adequate')}
            {renderProgressBar('Organic Carbon (SOC)', organicCarbon, 0, 2, '%', 'Moderate (0.68%)')}
            {renderProgressBar('Clay Content', 52, 0, 100, '%', 'Heavy Clay')}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>⚗️ Chemical Properties</h3>
          </div>
          <div style={{ paddingTop: '0.5rem' }}>
            {renderProgressBar('Soil pH Level', pH, 4, 10, '', 'Slightly Alkaline')}
            {renderProgressBar('Electrical Conductivity (EC)', 0.85, 0, 4, 'dS/m', 'Normal (Non-saline)')}
            {renderProgressBar('Cation Exchange (CEC)', 45, 0, 80, 'cmol/kg', 'High Fertility')}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>🧪 Primary Nutrients (NPK)</h3>
          </div>
          <div style={{ paddingTop: '0.5rem' }}>
            {renderProgressBar('Nitrogen (Available N)', nitrogen, 0, 500, 'kg/ha', 'Medium (240 kg/ha)')}
            {renderProgressBar('Phosphorus (Available P)', phosphorus, 0, 60, 'kg/ha', 'Medium (24 kg/ha)')}
            {renderProgressBar('Potassium (Available K)', potassium, 0, 500, 'kg/ha', 'High (310 kg/ha)')}
          </div>
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="card" style={{ borderLeft: '5px solid var(--primary-600)' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💡</span>
          <span>Agronomic Soil Health Recommendations for {activeLocation.name}</span>
        </h2>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {recommendations.map((rec, idx) => (
            <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default Soil;
