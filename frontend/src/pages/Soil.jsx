import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SourceBadge from '../components/SourceBadge';
import MetricCard from '../components/MetricCard';
import soilService from '../services/soilService';
import DEFAULT_LOCATION from '../config/locations';

const Soil = () => {
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSoilData = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = DEFAULT_LOCATION.latitude || DEFAULT_LOCATION.lat || 19.8833;
      const lon = DEFAULT_LOCATION.longitude || DEFAULT_LOCATION.lon || 74.4833;
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
  }, []);

  const renderProgressBar = (label, value, min, max, unit, statusText) => {
    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    return (
      <div className="progress-wrapper">
        <div className="progress-header">
          <span style={{ color: 'var(--text-main)' }}>{label}</span>
          <span>
            <strong>{value} {unit}</strong>
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
        <LoadingState message="Retrieving soil health profile and nutrient indicators..." />
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
  const moisture = soilData?.moisture ?? 35.5;
  const pH = soilData?.pH ?? 7.8;
  const nitrogen = soilData?.nitrogen ?? 120;
  const phosphorus = soilData?.phosphorus ?? 25;
  const potassium = soilData?.potassium ?? 350;
  const organicMatter = soilData?.organicMatter ?? 0.8;
  const soilType = soilData?.soilType ?? 'Vertisol (Black Cotton Soil)';
  const recommendations = soilData?.recommendations || [
    'Apply organic farmyard manure to enhance soil organic carbon.',
    'Ensure ridge and furrow planting for adequate drainage in heavy black soil.',
    'Test zinc and micronutrient levels before sowing.'
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Soil Health & Nutrients</h1>
            <p>Soil chemistry, macronutrients, moisture profile, and soil conditioning insights.</p>
          </div>
          <SourceBadge source={soilData?.source || "Regional Agronomy Model / SoilGrids"} status={soilData?.status || "Estimated"} />
        </div>
      </div>

      {/* Main Soil Score Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', background: 'linear-gradient(135deg, #ffffff 0%, #f6faf7 100%)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Overall Soil Health Index
          </div>
          <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--primary-700)', lineHeight: 1, margin: '0.5rem 0' }}>
            {score}<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <span className="badge badge-success">● Moderate-High Fertility</span>
        </div>

        <div style={{ maxWidth: '400px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
            Soil Classification: {soilType}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Typical vertisol of the Deccan volcanic plateau. Exhibits high clay content with excellent water retention properties and moderate-alkaline pH.
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
            {renderProgressBar('Organic Carbon (SOC)', organicMatter, 0, 5, '%', 'Low - Needs amendment')}
            {renderProgressBar('Clay Fraction', 52, 0, 100, '%', 'Heavy texture')}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>⚗️ Chemical Properties</h3>
          </div>
          <div style={{ paddingTop: '0.5rem' }}>
            {renderProgressBar('Soil pH Level', pH, 4, 10, '', 'Slightly Alkaline')}
            {renderProgressBar('Electrical Conductivity (EC)', 0.85, 0, 4, 'dS/m', 'Non-saline')}
            {renderProgressBar('Cation Exchange (CEC)', 45, 0, 80, 'cmol/kg', 'High capacity')}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>🧪 Primary Nutrients (NPK)</h3>
          </div>
          <div style={{ paddingTop: '0.5rem' }}>
            {renderProgressBar('Nitrogen (Available N)', nitrogen, 0, 300, 'mg/kg', 'Low')}
            {renderProgressBar('Phosphorus (Available P)', phosphorus, 0, 60, 'mg/kg', 'Medium')}
            {renderProgressBar('Potassium (Available K)', potassium, 0, 400, 'mg/kg', 'High')}
          </div>
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="card" style={{ borderLeft: '5px solid var(--primary-600)' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💡</span>
          <span>Agronomic Soil Health Recommendations</span>
        </h2>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {recommendations.map((rec, idx) => (
            <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default Soil;
