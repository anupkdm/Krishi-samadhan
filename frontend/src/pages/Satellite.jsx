import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SourceBadge from '../components/SourceBadge';
import MetricCard from '../components/MetricCard';
import satelliteService from '../services/satelliteService';
import DEFAULT_LOCATION from '../config/locations';

const Satellite = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSatelliteData = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = DEFAULT_LOCATION.latitude || DEFAULT_LOCATION.lat || 19.8833;
      const lon = DEFAULT_LOCATION.longitude || DEFAULT_LOCATION.lon || 74.4833;
      const response = await satelliteService.getSatelliteData(lat, lon);
      setData(response);
    } catch (err) {
      console.error('Satellite fetch error:', err);
      setError('Failed to retrieve satellite observations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSatelliteData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Processing satellite spectral imagery (Sentinel-2 format)..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState message={error} onRetry={fetchSatelliteData} />
      </DashboardLayout>
    );
  }

  const ndvi = data?.ndvi ?? 0.65;
  const health = data?.vegetationHealth ?? 'Good';
  const stress = data?.cropStress ?? 'Low';
  const moistureIndex = data?.moistureIndex ?? 0.42;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Satellite Monitoring & Vegetation Indices</h1>
            <p>Multispectral telemetry, Normalized Difference Vegetation Index (NDVI), and canopy health.</p>
          </div>
          <SourceBadge source={data?.source || "Sentinel-2 Compatible"} status={data?.status || "Demonstration"} />
        </div>
      </div>

      <div style={{ background: 'var(--info-bg)', border: '1px solid #bae6fd', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>🛰️</span>
        <span style={{ fontSize: '0.88rem', color: '#0369a1' }}>
          <strong>Sentinel-2 Telemetry:</strong> Surface reflectance derived over 10m spatial resolution. Demonstrates NDVI vigor curves and moisture stress mapping.
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <MetricCard title="NDVI Index" value={ndvi} icon="🛰️" trend="up" subtitle={data?.ndviInterpretation || "Healthy Dense Canopy"} />
        <MetricCard title="Vegetation Health" value={health} icon="🌿" trend="up" subtitle="Biomass accumulation on track" />
        <MetricCard title="Crop Stress Level" value={stress} icon="📉" trend="stable" subtitle="No water deficit detected" />
        <MetricCard title="Normalized Moisture (NDMI)" value={moistureIndex} icon="💧" trend="stable" subtitle="Canopy water content optimal" />
      </div>

      {/* 2 Column Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3>🗺️ Land Cover & Land Use (LCLU)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>🌾 Active Cropland</span>
              <strong>74%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>🌳 Tree Cover & Orchard</span>
              <strong>12%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>🏡 Rural Settlement / Roads</span>
              <strong>8%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
              <span>💧 Farm Ponds / Waterbodies</span>
              <strong>6%</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>📈 Change Detection (MoM)</h3>
          </div>
          <div style={{ background: 'var(--primary-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-800)', marginBottom: '0.3rem' }}>
              {data?.changeDetection || "+5.2% Canopy Density"}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Positive photosynthetic activity observed across vegetative zones following recent monsoon showers.
            </p>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Last Optical Pass: <strong>Sentinel-2A • 5 Days Ago</strong>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Satellite;
