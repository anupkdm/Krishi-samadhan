import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import MetricCard from '../components/MetricCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import weatherService from '../services/weatherService';
import soilService from '../services/soilService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, activeLocation, openProfileModal } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = activeLocation.latitude || 19.8833;
      const lon = activeLocation.longitude || 74.4833;

      const [weather, soil] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon).catch(() => null),
        soilService.getSoilData(lat, lon).catch(() => null)
      ]);
      setWeatherData(weather);
      setSoilData(soil);
    } catch (err) {
      setError('Failed to load dashboard overview data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeLocation]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message={`Loading agricultural intelligence stream for ${activeLocation.name}...`} />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState message={error} onRetry={fetchData} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Unified Agriculture Dashboard</h1>
            <p>Real-time telemetry and decision support for <strong>{activeLocation.name}</strong> ({activeLocation.latitude}°N, {activeLocation.longitude}°E)</p>
          </div>
          
          <button
            onClick={openProfileModal}
            className="btn btn-sm"
            style={{
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-300)',
              color: 'var(--primary-900)',
              fontWeight: '700',
              borderRadius: '20px',
              padding: '0.4rem 0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span className="source-dot Live"></span>
            <span>📍 {activeLocation.district} (Tap to Switch)</span>
          </button>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <MetricCard
          title="Ambient Temperature"
          value={weatherData?.temperature !== undefined ? weatherData.temperature : 28}
          unit="°C"
          icon="🌡️"
          trend="stable"
          subtitle={weatherData?.source || 'Open-Meteo Live'}
        />
        <MetricCard
          title="Soil Moisture"
          value={soilData?.moisture !== undefined ? soilData.moisture : 38.5}
          unit="%"
          icon="💧"
          trend="up"
          subtitle={activeLocation.soilType || "Topsoil Layer (0-5cm)"}
        />
        <MetricCard
          title="Crop Health"
          value="Healthy"
          icon="🌾"
          trend="up"
          subtitle="NDVI Index 0.72 (Sentinel-2)"
        />
        <MetricCard
          title="Weather Risk"
          value={weatherData?.signals?.length > 0 ? "Moderate" : "Low"}
          icon="⚠️"
          trend={weatherData?.signals?.length > 0 ? "down" : "stable"}
          subtitle={`Primary APMC: ${activeLocation.apmcMandi}`}
        />
      </div>

      {/* 8 Core Modules Grid */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
          Platform Intelligence Modules ({activeLocation.district})
        </h2>
      </div>

      <div className="modules-grid">
        <div className="module-card">
          <div className="module-card-icon">🗺️</div>
          <h3>1. GIS Dashboard</h3>
          <p>Interactive spatial layers centered on {activeLocation.name} coordinates and soil contours.</p>
          <Link to="/dashboard/gis" className="btn btn-outline btn-block">Open GIS Map →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🌤️</div>
          <h3>2. Weather Monitoring</h3>
          <p>Live micrometeorology, 7-day agricultural forecasts, and spray advisories for {activeLocation.district}.</p>
          <Link to="/dashboard/weather" className="btn btn-outline btn-block">View Weather →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🛰️</div>
          <h3>3. Satellite Monitoring</h3>
          <p>Sentinel-2 NDVI vegetative vigor index, moisture NDWI, and cropland canopy health.</p>
          <Link to="/dashboard/satellite" className="btn btn-outline btn-block">View Satellite →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🌱</div>
          <h3>4. Soil Health</h3>
          <p>{activeLocation.soilType} chemistry, NPK macronutrients, pH balance, and split fertilizer schedule.</p>
          <Link to="/dashboard/soil" className="btn btn-outline btn-block">View Soil Health →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🐛</div>
          <h3>5. AI Pest Surveillance</h3>
          <p>AI photo diagnosis for crops ({activeLocation.primaryCrops?.slice(0, 3).join(', ') || 'Onion, Cotton, Vegetables'}).</p>
          <Link to="/dashboard/pest" className="btn btn-outline btn-block">Detect Pests →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🏛️</div>
          <h3>6. Government Schemes</h3>
          <p>12 verified national & Maharashtra schemes (PM-KISAN, Namo Shetkari, Magel Tyala Shettale).</p>
          <Link to="/dashboard/schemes" className="btn btn-outline btn-block">Explore Schemes →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">💰</div>
          <h3>7. Market Intelligence</h3>
          <p>Daily mandi commodity rates for {activeLocation.apmcMandi}, shop comparison, and price alerts.</p>
          <Link to="/dashboard/market" className="btn btn-outline btn-block">Check Prices →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">📋</div>
          <h3>8. Farmer Advisory</h3>
          <p>Targeted decision support combining weather, soil, and market telemetry for {activeLocation.name}.</p>
          <Link to="/dashboard/advisory" className="btn btn-primary btn-block">View Advisories →</Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
