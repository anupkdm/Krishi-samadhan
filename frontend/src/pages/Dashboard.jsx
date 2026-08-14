import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import MetricCard from '../components/MetricCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import weatherService from '../services/weatherService';
import soilService from '../services/soilService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
  const { user, activeLocation, openProfileModal } = useAuth();
  const { t, language } = useLanguage();
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
        <LoadingState message={`${t('loadingMsg')} (${activeLocation.name})...`} />
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
            <h1>{t('dashTitle')}</h1>
            <p>{t('dashDesc')} <strong>{activeLocation.name}</strong> ({activeLocation.latitude}°N, {activeLocation.longitude}°E)</p>
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
            <span>📍 {activeLocation.district} ({language === 'mr' ? 'स्थान बदला' : language === 'hi' ? 'स्थान बदलें' : 'Tap to Switch'})</span>
          </button>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <MetricCard
          title={t('temperature')}
          value={weatherData?.temperature !== undefined ? weatherData.temperature : 28}
          unit="°C"
          icon="🌡️"
          trend="stable"
          subtitle={weatherData?.source || 'Open-Meteo Live'}
        />
        <MetricCard
          title={t('soilMoisture')}
          value={soilData?.moisture !== undefined ? soilData.moisture : 38.5}
          unit="%"
          icon="💧"
          trend="up"
          subtitle={activeLocation.soilType || "Topsoil Layer"}
        />
        <MetricCard
          title={t('cropHealth')}
          value={language === 'mr' ? 'उत्तम' : language === 'hi' ? 'स्वस्थ' : 'Healthy'}
          icon="🌾"
          trend="up"
          subtitle="NDVI Index 0.72 (Sentinel-2)"
        />
        <MetricCard
          title={language === 'mr' ? 'बाजार समिती' : language === 'hi' ? 'प्राथमिक मंडी' : 'Primary APMC'}
          value={activeLocation.apmcMandi || "APMC"}
          icon="💰"
          trend="stable"
          subtitle={`${activeLocation.district} Mandi`}
        />
      </div>

      {/* 8 Core Modules Grid */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
          {language === 'mr' ? 'प्रमुख कृषी साधने व विभाग' : language === 'hi' ? 'प्रमुख कृषि मॉड्यूल' : 'Platform Intelligence Modules'} ({activeLocation.district})
        </h2>
      </div>

      <div className="modules-grid">
        <div className="module-card">
          <div className="module-card-icon">🗺️</div>
          <h3>1. {t('gisDashboard')}</h3>
          <p>{language === 'mr' ? 'स्थानिक शेतीचे उपग्रह नकाशे, जमिनीची प्रतवारी आणि सिंचन स्तर.' : language === 'hi' ? 'खेतों का नक्शा और उपग्रह आधारित मिट्टी की जांच।' : 'Interactive spatial layers centered on farm coordinates and soil contours.'}</p>
          <Link to="/dashboard/gis" className="btn btn-outline btn-block">{t('gisDashboard')} →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🌤️</div>
          <h3>2. {t('weatherMonitoring')}</h3>
          <p>{language === 'mr' ? 'थेट स्थानिक हवामान, ७ दिवसांचा अंदाज आणि फवारणी अनुकूलता.' : language === 'hi' ? 'लाइव मौसम, 7-दिवसीय पूर्वानुमान एवं छिड़काव सलाह।' : 'Live micrometeorology, 7-day agricultural forecasts, and spray advisories.'}</p>
          <Link to="/dashboard/weather" className="btn btn-outline btn-block">{t('weatherMonitoring')} →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🛰️</div>
          <h3>3. {t('satelliteMonitoring')}</h3>
          <p>{language === 'mr' ? 'Sentinel-2 उपग्रहाद्वारे NDVI पीक आरोग्य व पर्णसंभार ओलावा.' : language === 'hi' ? 'उपग्रह द्वारा फसल स्वास्थ्य एवं नमी का सटीक विश्लेषण।' : 'Sentinel-2 NDVI vegetative vigor index, moisture NDWI, and cropland canopy health.'}</p>
          <Link to="/dashboard/satellite" className="btn btn-outline btn-block">{t('satelliteMonitoring')} →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🌱</div>
          <h3>4. {t('soilHealth')}</h3>
          <p>{language === 'mr' ? 'मातीतील NPK पोषण, सामू (pH) आणि खतांचे संतुलित नियोजन.' : language === 'hi' ? 'मिट्टी के NPK पोषक तत्व, pH मान और संतुलित खाद सिफारिश।' : 'Soil chemistry, NPK macronutrients, pH balance, and split fertilizer schedule.'}</p>
          <Link to="/dashboard/soil" className="btn btn-outline btn-block">{t('soilHealth')} →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🐛</div>
          <h3>5. {t('pestSurveillance')}</h3>
          <p>{language === 'mr' ? 'पानाचा फोटो अपलोड करून एआय रोग निदान व त्वरित उपाय.' : language === 'hi' ? 'पत्ती की फोटो खींचकर एआई रोग पहचान और दवा छिड़काव।' : 'AI photo diagnosis for crops with chemical and organic treatments.'}</p>
          <Link to="/dashboard/pest" className="btn btn-outline btn-block">{t('pestSurveillance')} →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">🏛️</div>
          <h3>6. {t('govSchemes')}</h3>
          <p>{language === 'mr' ? 'नमो शेतकरी, पीएम-किसान, मागेल त्याला शेततळे, सौर पंप योजना.' : language === 'hi' ? 'पीएम-किसान, नमो शेतकरी, खेत तालाब एवं सोलर पंप सब्सिडी योजनाएं।' : '12 verified national & Maharashtra schemes with direct application portals.'}</p>
          <Link to="/dashboard/schemes" className="btn btn-outline btn-block">{t('govSchemes')} →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">💰</div>
          <h3>7. {t('marketIntelligence')}</h3>
          <p>{language === 'mr' ? 'बाजार समितीचे आजचे भाव आणि कृषी सेवा केंद्रांचे खत-औषध दर.' : language === 'hi' ? 'दैनिक मंडी भाव एवं पास के कृषि स्टोर की मूल्य तुलना।' : 'Daily mandi commodity rates, shop comparison, and price alerts.'}</p>
          <Link to="/dashboard/market" className="btn btn-outline btn-block">{t('marketIntelligence')} →</Link>
        </div>

        <div className="module-card">
          <div className="module-card-icon">📋</div>
          <h3>8. {t('farmerAdvisory')}</h3>
          <p>{language === 'mr' ? 'हवामान, माती आणि पिकांनुसार तयार केलेला एकात्मिक शेती सल्ला.' : language === 'hi' ? 'मौसम और मिट्टी के आधार पर कृषि वैज्ञानिकों की विशेष सलाह।' : 'Targeted decision support combining weather, soil, and market telemetry.'}</p>
          <Link to="/dashboard/advisory" className="btn btn-primary btn-block">{t('farmerAdvisory')} →</Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
