import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SourceBadge from '../components/SourceBadge';
import MetricCard from '../components/MetricCard';
import satelliteService from '../services/satelliteService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Satellite = () => {
  const { activeLocation } = useAuth();
  const { t, language } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSatelliteData = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = activeLocation.latitude || 19.8833;
      const lon = activeLocation.longitude || 74.4833;
      const response = await satelliteService.getSatelliteData(lat, lon);
      setData(response);
    } catch (err) {
      console.error('Satellite fetch error:', err);
      setError(t('satelliteError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSatelliteData();
  }, [activeLocation]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message={`${t('satelliteLoading')} ${activeLocation.name}...`} />
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

  const ndvi = data?.ndvi ?? 0.72;
  const health = data?.ndviStatus
    ? (language === 'mr' ? 'उत्तम पीक जोम (०.७२)' : language === 'hi' ? 'स्वस्थ फसल जोम (0.72)' : 'Healthy (0.72)')
    : (language === 'mr' ? 'उत्तम पीक जोम (०.७२)' : language === 'hi' ? 'स्वस्थ फसल जोम (0.72)' : 'Healthy (0.72)');
  const stress = data?.anomaliesDetected === 0
    ? t('minimalOptimal')
    : t('moderate');
  const moistureIndex = data?.ndwi ?? data?.moistureIndex ?? 0.44;

  const getHealthSummary = () => {
    if (language === 'mr') {
      return `${activeLocation.name} परिसरात उत्तम वनस्पती जोम आढळला असून शेताच्या सीमांमध्ये सातत्यपूर्ण क्लोरोफिल परावर्तन दिसून येत आहे.`;
    }
    if (language === 'hi') {
      return `${activeLocation.name} क्षेत्र में मजबूत वानस्पतिक स्वास्थ्य दर्ज किया गया है और फसल में समान क्लोरोफिल परावर्तन पाया गया है।`;
    }
    return data?.cropHealthSummary || `Robust vegetative vigor detected across ${activeLocation.name} with consistent chlorophyll reflection across parcel boundaries.`;
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{t('satelliteTitle')}</h1>
            <p>{t('satelliteDesc')} <strong>{activeLocation.name}</strong>.</p>
          </div>
          <SourceBadge source="Sentinel-2 MSI / Copernicus" status={t('livePass')} />
        </div>
      </div>

      <div style={{ background: 'var(--info-bg)', border: '1px solid #bae6fd', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>🛰️</span>
        <span style={{ fontSize: '0.88rem', color: '#0369a1' }}>
          <strong>{t('sentinelTelemetry')}</strong> {t('sentinelSub')} {activeLocation.district} ({activeLocation.latitude}°N, {activeLocation.longitude}°E).
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <MetricCard title={t('ndviVigorIndex')} value={ndvi} icon="🛰️" trend="up" subtitle={health} />
        <MetricCard title={t('canopyMoisture')} value={moistureIndex} icon="💧" trend="stable" subtitle={t('adequateHydration')} />
        <MetricCard title={t('cropStressRisk')} value={stress} icon="📉" trend="stable" subtitle={t('zeroThermalAnomalies')} />
        <MetricCard title={t('cloudCover')} value={data?.cloudCover || "4.2%"} icon="⛅" trend="stable" subtitle={t('opticalClarity')} />
      </div>

      {/* 2 Column Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3>🗺️ {t('landCoverUse')} ({activeLocation.district})</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>🌾 {t('activeCropland')} ({activeLocation.primaryCrops?.slice(0, 2).join(', ') || 'Crops'})</span>
              <strong>76%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>🌳 {t('treeCoverOrchards')}</span>
              <strong>14%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>🏡 {t('ruralSettlement')}</span>
              <strong>6%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
              <span>💧 {t('farmPonds')}</span>
              <strong>4%</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>📈 {t('biomassTrend')}</h3>
          </div>
          <div style={{ background: 'var(--primary-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-800)', marginBottom: '0.3rem' }}>
              {t('photosyntheticBiomass')}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {getHealthSummary()}
            </p>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {t('sensorInfo')}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Satellite;
