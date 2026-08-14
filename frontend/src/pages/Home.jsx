import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="home-page">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">
                {t('heroTitle1')}<br />
                <span>{t('heroTitle2')}</span>
              </h1>
              <p className="hero-subtitle">
                {t('heroSubtitle')}
              </p>
              <div className="hero-buttons">
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  {t('explorePlatform')} →
                </Link>
                <a href="#features" className="btn btn-secondary btn-lg">
                  {t('learnMore')}
                </a>
              </div>
            </div>

            <div className="hero-stats-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: 'var(--primary-900)' }}>🌾 {t('monitoringLocality')}</span>
                <span className="badge badge-success">● {t('activeStream')}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coordinates: 19.8833° N, 74.4833° E (Maharashtra)</div>
              
              <MetricCard title={t('temperature')} value="23.3" unit="°C" icon="🌡️" trend="stable" subtitle="Live Open-Meteo Feed" />
              <MetricCard title={t('soilMoisture')} value="35.5" unit="%" icon="💧" trend="up" subtitle="Adequate Field Capacity" />
              <MetricCard title={t('cropHealth')} value="Good" icon="🌾" trend="up" subtitle="NDVI Index 0.65" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>Eight Core Agricultural Modules</h2>
              <p>Everything you need to monitor, analyze, and optimize your farming lifecycle in a single unified dashboard.</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-box">🗺️</div>
                <h3>1. {t('gisDashboard')}</h3>
                <p>Interactive agricultural map and spatial monitoring with field layer controls.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">🌤️</div>
                <h3>2. {t('weatherMonitoring')}</h3>
                <p>Current weather, 7-day forecasts and automated agricultural weather alerts.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">🛰️</div>
                <h3>3. {t('satelliteMonitoring')}</h3>
                <p>Satellite-based crop health, NDVI vegetation index, and land coverage monitoring.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">🌱</div>
                <h3>4. {t('soilHealth')}</h3>
                <p>Soil moisture, pH levels, NPK macronutrients, and soil conditioning advice.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">🐛</div>
                <h3>5. {t('pestSurveillance')}</h3>
                <p>Crop-image-based pest & disease analysis with severity ratings & treatment plans.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">🏛️</div>
                <h3>6. {t('govSchemes')}</h3>
                <p>Searchable national agricultural schemes (PM-KISAN, PMFBY) with official links.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">💰</div>
                <h3>7. {t('marketIntelligence')}</h3>
                <p>APMC mandi prices, market comparisons, price spread, and trend insights.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">📋</div>
                <h3>8. {t('farmerAdvisory')}</h3>
                <p>Integrated decision support combining weather, soil, pest, and market telemetry.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
          <div className="container">
            <div className="section-header">
              <h2>How Agri Samadhan Works</h2>
              <p>From scattered field data to intelligent, prioritized farmer recommendations.</p>
            </div>

            <div className="steps-container">
              <div className="step-card">
                <div className="step-number">1</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📥</div>
                <h3>Collect</h3>
                <p>Aggregates weather, soil, satellite, pest, market, and government data sources continuously.</p>
              </div>

              <div className="step-arrow">→</div>

              <div className="step-card">
                <div className="step-number">2</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔬</div>
                <h3>Analyze</h3>
                <p>Applies agronomic rules, spatial analytics, and AI risk models to detect early issues.</p>
              </div>

              <div className="step-arrow">→</div>

              <div className="step-card">
                <div className="step-number">3</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                <h3>Act</h3>
                <p>Delivers clear, prioritized advisories and actionable alerts directly to farmers and authorities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container" style={{ padding: '2rem 1.5rem' }}>
          <div className="cta-section">
            <h2>Ready to transform your agricultural decisions?</h2>
            <p>Access live telemetry, market rates, and personalized agronomic advisories today.</p>
            <Link to="/dashboard" className="btn btn-secondary btn-lg" style={{ color: 'var(--primary-900)' }}>
              {t('explorePlatform')} →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
