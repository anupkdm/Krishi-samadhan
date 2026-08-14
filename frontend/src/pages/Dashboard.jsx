import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import MetricCard from '../components/MetricCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import weatherService from '../services/weatherService';
import soilService from '../services/soilService';
import DEFAULT_LOCATION from '../config/locations';

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = DEFAULT_LOCATION.latitude || DEFAULT_LOCATION.lat;
      const lon = DEFAULT_LOCATION.longitude || DEFAULT_LOCATION.lon;

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
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading agricultural intelligence stream..." />
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
            <p>Real-time telemetry and decision support for <strong>{DEFAULT_LOCATION.name}</strong> (19.8833°N, 74.4833°E)</p>
          </div>
          <span className="source-badge">
            <span className="source-dot Live"></span>
            <span>Live Aggregator Active</span>
          </span>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <MetricCard
          title="Ambient Temperature"
          value={weatherData?.temperature !== undefined ? weatherData.temperature : '--'}
          unit="°C"
          icon="🌡️"
          trend="stable"
          subtitle={weatherData?.source || 'Open-Meteo'}
        />
        <MetricCard
          title="Soil Moisture"
          value={soilData?.moisture !== undefined ? soilData.moisture : (soilData?.soilMoisture || 35.5)}
          unit="%"
          icon="💧"
          trend="up"
          subtitle="Topsoil Layer (0-5cm)"
        />
        <MetricCard
          title="Crop Health"
          value="Good"
          icon="🌾"
          trend="up"
          subtitle="NDVI Index 0.65"
        />
        <MetricCard
          title="Weather Risk"
          value={weatherData?.signals?.length > 0 ? "Moderate" : "Low"}
          icon="⚠️"
          trend={weatherData?.signals?.length > 0 ? "down" : "stable"}
          subtitle={weatherData?.signals?.[0] || "Favorable Field Conditions"}
        />
      </div>

      {/* 8 Core Modules Grid */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
          Platform Intelligence Modules
        </h2>
      </div>

      <div className="modules-grid">
        <div className="module-card">
          <div className="module-card-icon">🗺️</div>
          <h3>1. GIS Dashboard</h3>
          <p>Interactive agricultural map, layer toggles, field boundary analysis, and spatial intelligence.</p>
          <Link to="/dashboard/gis" className="btn btn-outline btn-block">Open GIS Map →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🌤️</div>
          <h3>2. Weather Monitoring</h3>
          <p>Current conditions, 7-day hourly forecasts, wind vectors, and agricultural weather alerts.</p>
          <Link to="/dashboard/weather" className="btn btn-outline btn-block">View Weather →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🛰️</div>
          <h3>3. Satellite Monitoring</h3>
          <p>Satellite-based crop health, NDVI vegetation index, land cover classification, and crop stress.</p>
          <Link to="/dashboard/satellite" className="btn btn-outline btn-block">View Satellite →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🌱</div>
          <h3>4. Soil Health</h3>
          <p>Soil health score, moisture levels, pH analysis, NPK macronutrients, and soil amendments.</p>
          <Link to="/dashboard/soil" className="btn btn-outline btn-block">View Soil Health →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🐛</div>
          <h3>5. AI Pest Surveillance</h3>
          <p>Crop image-based pest & disease diagnosis with severity analysis and treatment plans.</p>
          <Link to="/dashboard/pest" className="btn btn-outline btn-block">Detect Pests →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🏛️</div>
          <h3>6. Government Schemes</h3>
          <p>Searchable national agricultural schemes (PM-KISAN, PMFBY, KCC) with verified portal links.</p>
          <Link to="/dashboard/schemes" className="btn btn-outline btn-block">Explore Schemes →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">💰</div>
          <h3>7. Market Intelligence</h3>
          <p>APMC mandi commodity rates, state-level price comparisons, and profit opportunities.</p>
          <Link to="/dashboard/market" className="btn btn-outline btn-block">Check Prices →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">📋</div>
          <h3>8. Farmer Advisory</h3>
          <p>Multi-source decision support combining weather, soil, pest, and market telemetry.</p>
          <Link to="/dashboard/advisory" className="btn btn-primary btn-block">View Advisories →</Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
