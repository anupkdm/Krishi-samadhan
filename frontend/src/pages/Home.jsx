import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MetricCard from '../components/MetricCard';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { t, language } = useLanguage();
  const { activeLocation } = useAuth();

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
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {activeLocation.name} ({activeLocation.latitude}° N, {activeLocation.longitude}° E)
              </div>
              
              <MetricCard title={t('temperature')} value="28.5" unit="°C" icon="🌡️" trend="stable" subtitle="Live Open-Meteo" />
              <MetricCard title={t('soilMoisture')} value="38.5" unit="%" icon="💧" trend="up" subtitle={activeLocation.soilType || "Field Capacity"} />
              <MetricCard title={t('cropHealth')} value={language === 'mr' ? 'उत्तम' : language === 'hi' ? 'स्वस्थ' : 'Healthy'} icon="🌾" trend="up" subtitle="NDVI Index 0.72" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>{language === 'mr' ? '८ प्रमुख कृषी निर्णय विभाग' : language === 'hi' ? '८ प्रमुख कृषि मॉड्यूल' : 'Eight Core Agricultural Modules'}</h2>
              <p>{language === 'mr' ? 'आपल्या शेतीचे निरीक्षण, विश्लेषण आणि योग्य निर्णय घेण्यासाठी सर्व माहिती एकाच डॅशबोर्डमध्ये.' : language === 'hi' ? 'अपनी खेती की निगरानी, विश्लेषण और सटीक निर्णय लेने के लिए संपूर्ण समाधान।' : 'Everything you need to monitor, analyze, and optimize your farming lifecycle in a single unified dashboard.'}</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-box">🗺️</div>
                <h3>1. {t('gisDashboard')}</h3>
                <p>{language === 'mr' ? 'स्थानिक शेतीचे उपग्रह नकाशे, जमिनीची माहिती आणि शेत सीमा.' : language === 'hi' ? 'खेतों का नक्शा और उपग्रह आधारित मिट्टी की जांच।' : 'Interactive agricultural map and spatial monitoring with field layer controls.'}</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">🌤️</div>
                <h3>2. {t('weatherMonitoring')}</h3>
                <p>{language === 'mr' ? 'थेट तापमान, पाऊस अंदाज आणि स्वयंचलित कृषी फवारणी संकेत.' : language === 'hi' ? 'लाइव मौसम, 7-दिवसीय पूर्वानुमान एवं स्वचालित छिड़काव सलाह।' : 'Current weather, 7-day forecasts and automated agricultural weather alerts.'}</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">🛰️</div>
                <h3>3. {t('satelliteMonitoring')}</h3>
                <p>{language === 'mr' ? 'Sentinel-2 उपग्रहाद्वारे NDVI पीक आरोग्य आणि ओलावा निर्देशांक.' : language === 'hi' ? 'उपग्रह द्वारा फसल स्वास्थ्य एवं नमी का सटीक विश्लेषण।' : 'Satellite-based crop health, NDVI vegetation index, and land coverage monitoring.'}</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">🌱</div>
                <h3>4. {t('soilHealth')}</h3>
                <p>{language === 'mr' ? 'मातीतील NPK घटक, सामू (pH), ओलावा आणि खतांचे अचूक नियोजन.' : language === 'hi' ? 'मिट्टी के NPK पोषक तत्व, pH मान और संतुलित खाद सिफारिश।' : 'Soil moisture, pH levels, NPK macronutrients, and soil conditioning advice.'}</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">🐛</div>
                <h3>5. {t('pestSurveillance')}</h3>
                <p>{language === 'mr' ? 'पानाचा फोटो अपलोड करून तात्काळ रोग निदान व फवारणी औषध सल्ला.' : language === 'hi' ? 'पत्ती की फोटो खींचकर एआई रोग पहचान और दवा छिड़काव।' : 'Crop-image-based pest & disease analysis with severity ratings & treatment plans.'}</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">🏛️</div>
                <h3>6. {t('govSchemes')}</h3>
                <p>{language === 'mr' ? 'नमो शेतकरी, पीएम-किसान, मागेल त्याला शेततळे, सौर पंप योजनांची माहिती.' : language === 'hi' ? 'पीएम-किसान, नमो शेतकरी, खेत तालाब एवं सोलर पंप सब्सिडी योजनाएं।' : 'Searchable national agricultural schemes (PM-KISAN, PMFBY) with official links.'}</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">💰</div>
                <h3>7. {t('marketIntelligence')}</h3>
                <p>{language === 'mr' ? 'बाजार समितीचे आजचे भाव आणि नजीकच्या कृषी केंद्रांचे खत-औषध दर.' : language === 'hi' ? 'दैनिक मंडी भाव एवं पास के कृषि स्टोर की मूल्य तुलना।' : 'APMC mandi prices, market comparisons, price spread, and trend insights.'}</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">📋</div>
                <h3>8. {t('farmerAdvisory')}</h3>
                <p>{language === 'mr' ? 'हवामान, माती आणि बाजारभावानुसार तयार केलेला कृषी तज्ज्ञ सल्ला.' : language === 'hi' ? 'मौसम और मिट्टी के आधार पर कृषि वैज्ञानिकों की विशेष सलाह।' : 'Integrated decision support combining weather, soil, pest, and market telemetry.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
          <div className="container">
            <div className="section-header">
              <h2>{language === 'mr' ? 'कृषी समाधान कसे कार्य करते?' : language === 'hi' ? 'कृषि समाधान कैसे काम करता है?' : 'How Krishi Samadhan Works'}</h2>
              <p>{language === 'mr' ? 'शेतातील विविध माहितीचे अचूक विश्लेषण करून शेतकऱ्यांना थेट कृती सल्ला देणे.' : language === 'hi' ? 'खेत के आंकड़ों का सटीक विश्लेषण कर किसानों को व्यावहारिक सलाह देना।' : 'From scattered field data to intelligent, prioritized farmer recommendations.'}</p>
            </div>

            <div className="steps-container">
              <div className="step-card">
                <div className="step-number">1</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📥</div>
                <h3>{language === 'mr' ? 'माहिती संकलन' : language === 'hi' ? 'डेटा संकलन' : 'Collect'}</h3>
                <p>{language === 'mr' ? 'हवामान, माती, उपग्रह, कीड, बाजारभाव व सरकारी योजनांची माहिती सतत गोळा केली जाते.' : language === 'hi' ? 'मौसम, मिट्टी, उपग्रह, कीट और मंडी भाव का डेटा संकलित होता है।' : 'Aggregates weather, soil, satellite, pest, market, and government data sources continuously.'}</p>
              </div>

              <div className="step-arrow">→</div>

              <div className="step-card">
                <div className="step-number">2</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔬</div>
                <h3>{language === 'mr' ? 'एआय विश्लेषण' : language === 'hi' ? 'एआई विश्लेषण' : 'Analyze'}</h3>
                <p>{language === 'mr' ? 'कृषी तज्ज्ञांचे नियम, स्थानिक विश्लेषण व एआय मॉडेल्सद्वारे पिकांच्या गरजा ओळखल्या जातात.' : language === 'hi' ? 'कृषि वैज्ञानिकों के नियमों व एआई मॉडल द्वारा फसल जरूरतों का विश्लेषण।' : 'Applies agronomic rules, spatial analytics, and AI risk models to detect early issues.'}</p>
              </div>

              <div className="step-arrow">→</div>

              <div className="step-card">
                <div className="step-number">3</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                <h3>{language === 'mr' ? 'कृती सल्ला' : language === 'hi' ? 'सटीक सलाह' : 'Act'}</h3>
                <p>{language === 'mr' ? 'शेतकऱ्यांना वेळेत सिंचन, खत व फवारणीचा अचूक कृती सल्ला उपलब्ध होतो.' : language === 'hi' ? 'किसानों को समय पर सिंचाई, खाद और छिड़काव की व्यावहारिक सलाह मिलती है।' : 'Delivers clear, prioritized advisories and actionable alerts directly to farmers.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container" style={{ padding: '2rem 1.5rem' }}>
          <div className="cta-section">
            <h2>{language === 'mr' ? 'आपल्या शेतीचे निर्णय अधिक अचूक करा!' : language === 'hi' ? 'अपनी खेती के फैसले अधिक सटीक बनाएं!' : 'Ready to transform your agricultural decisions?'}</h2>
            <p>{language === 'mr' ? 'थेट हवामान, बाजारभाव आणि पीक सल्ला आजच मोफत मिळवा.' : language === 'hi' ? 'लाइव मौसम, मंडी भाव और फसल सलाह आज ही निशुल्क प्राप्त करें।' : 'Access live telemetry, market rates, and personalized agronomic advisories today.'}</p>
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
