import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import weatherService from '../services/weatherService';
import soilService from '../services/soilService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const SLOGANS_BY_LANG = {
  mr: [
    {
      icon: "🌾",
      title: "जय जवान, जय किसान — तंत्रज्ञानाने समृद्ध बळीराजा!",
      subtitle: "उपग्रह निरीक्षण, एआय रोग निदान व अचूक हवामान सल्ल्याने शेती करा हमखास फायद्याची."
    },
    {
      icon: "🚜",
      title: "स्मार्ट शेती, भरघोस उत्पन्न — कृषी समाधान सोबत!",
      subtitle: "माती परीक्षण, आधुनिक फवारणी यंत्रे आणि खतांचे अचूक नियोजन एकाच डिजिटल व्यासपीठावर."
    },
    {
      icon: "🌿",
      title: "मातीचे उत्तम आरोग्य, पिकांची भरभराट, समृद्ध शेतकरी!",
      subtitle: "सेंद्रिय व जैविक उपायांनी जमिनीची सुपीकता टिकवा, उत्पादन खर्च कमी करून नफा वाढवा."
    },
    {
      icon: "🛰️",
      title: "उपग्रह व AI चे सामर्थ्य, आता प्रत्येक शेतकऱ्याच्या हातात!",
      subtitle: "Sentinel-2 NDVI द्वारे पिकांच्या पानांवरील सूक्ष्म बदलांवर २४/७ वैज्ञानिक नजर."
    },
    {
      icon: "💰",
      title: "अचूक बाजारभाव, थेट कृषी खरेदी, खात्रीशीर प्रगती!",
      subtitle: "स्थानिक बाजार समित्यांचे आजचे दर व वाजवी दरात औषध-खते खरेदीची एकात्मिक सोय."
    }
  ],
  hi: [
    {
      icon: "🌾",
      title: "जय जवान, जय किसान — आधुनिक तकनीक से सशक्त किसान!",
      subtitle: "सैटेलाइट विश्लेषण, एआई फसल सुरक्षा और मौसम पूर्वानुमान से खेती बनाएं सुरक्षित एवं लाभकारी।"
    },
    {
      icon: "🚜",
      title: "स्मार्ट कृषि, भरपूर पैदावार — कृषि समाधान का उपहार!",
      subtitle: "मृदा स्वास्थ्य, आधुनिक स्प्रेयर और सही खाद प्रबंधन अब एक ही मंच पर उपलब्ध।"
    },
    {
      icon: "🌿",
      title: "मृदा स्वास्थ्य से फसल खुशहाली, हर किसान की तरक्की!",
      subtitle: "जैविक और वैज्ञानिक विधियों से मिट्टी की उर्वरता बढ़ाएं और उत्पादन लागत घटाएं।"
    },
    {
      icon: "🛰️",
      title: "सैटेलाइट और AI की शक्ति, अब हर खेत की सुरक्षा में!",
      subtitle: "Sentinel-2 उपग्रह द्वारा फसल के हर हिस्से और नमी की सटीक निगरानी।"
    },
    {
      icon: "💰",
      title: "सटीक मंडी भाव, सही समय पर सही फैसला!",
      subtitle: "मंडी दरों की दैनिक जानकारी और उचित मूल्य पर उत्तम गुणवत्ता की कृषि सामग्री।"
    }
  ],
  en: [
    {
      icon: "🌾",
      title: "Jai Jawan, Jai Kisan — Empowering Farmers with Precision Tech!",
      subtitle: "Next-gen satellite telemetry, AI pathology, and microclimate intelligence for high yields."
    },
    {
      icon: "🚜",
      title: "Smart Agriculture • Abundant Harvest • Greater Prosperity!",
      subtitle: "Unified soil diagnostics, modern farm machinery, and split fertilization calculators."
    },
    {
      icon: "🌿",
      title: "Nurturing Soil Health, Protecting Crops, Elevating Farmer Incomes!",
      subtitle: "Combining scientific agronomy with sustainable organic pest management."
    },
    {
      icon: "🛰️",
      title: "Satellite Telemetry & GenAI Power in Every Farmer's Hand!",
      subtitle: "Sentinel-2 MSI vegetative canopy index tracking moisture and nitrogen dynamics."
    },
    {
      icon: "💰",
      title: "Live APMC Mandi Rates, Trusted Inputs & Fair Market Returns!",
      subtitle: "Real-time mandi analytics and direct transparent farm input pricing across Maharashtra."
    }
  ]
};

const Dashboard = () => {
  const { activeLocation, openProfileModal } = useAuth();
  const { t, language } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSloganIdx, setCurrentSloganIdx] = useState(0);

  const activeSlogans = SLOGANS_BY_LANG[language] || SLOGANS_BY_LANG.en;

  // Auto-cycle through slogans every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSloganIdx((prev) => (prev + 1) % activeSlogans.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeSlogans.length]);

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
    } catch {
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

  const slogan = activeSlogans[currentSloganIdx] || activeSlogans[0];

  return (
    <DashboardLayout>
      {/* ANIMATED FARMING HERO BANNER WITH SLOGANS */}
      <div
        className="farming-hero-banner"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '260px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #0f766e 100%)',
          boxShadow: '0 15px 35px -5px rgba(6, 78, 59, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.25)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 1.75rem'
        }}
      >
        {/* Background Animated Scene (Strictly Contained) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 1
          }}
        >
          {/* Sun with pulsing corona */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '15%',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(253, 224, 71, 0.45) 0%, rgba(250, 204, 21, 0.15) 50%, transparent 70%)',
              filter: 'blur(6px)',
              animation: 'sunPulse 6s ease-in-out infinite alternate'
            }}
          />

          {/* Floating Cloud 1 */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '-100px',
              width: '90px',
              height: '35px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              filter: 'blur(1px)',
              animation: 'cloudMove 30s linear infinite'
            }}
          />

          {/* Floating Cloud 2 */}
          <div
            style={{
              position: 'absolute',
              top: '45px',
              left: '-140px',
              width: '120px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.14)',
              borderRadius: '25px',
              filter: 'blur(1px)',
              animation: 'cloudMove 42s linear infinite',
              animationDelay: '10s'
            }}
          />

          {/* Agricultural Drone / UFO Flying & Scanning Forward */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '-80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              animation: 'droneFlyAcross 22s ease-in-out infinite',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          >
            {/* Drone Icon */}
            <div
              style={{
                fontSize: '1.8rem',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
              }}
            >
              🛸
            </div>
            {/* Perfectly Centered Light Beam */}
            <div
              style={{
                width: '64px',
                height: '80px',
                marginTop: '-2px',
                background: 'linear-gradient(180deg, rgba(74, 222, 128, 0.6) 0%, rgba(34, 197, 94, 0.15) 60%, rgba(34, 197, 94, 0) 100%)',
                clipPath: 'polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)',
                animation: 'scanPulse 2s ease-in-out infinite alternate',
                transformOrigin: '50% 0%'
              }}
            />
          </div>

          {/* Distant Rolling Hills Layer */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '70px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(6, 78, 59, 0.4) 30%, rgba(4, 120, 87, 0.6) 100%)',
              borderTop: '2px solid rgba(16, 185, 129, 0.25)',
              clipPath: 'ellipse(70% 100% at 50% 100%)'
            }}
          />

          {/* Animated Tractor Driving Forward Across Fields */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '-70px',
              width: '50px',
              height: '35px',
              fontSize: '1.8rem',
              animation: 'tractorDriveAcross 24s linear infinite',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))',
              zIndex: 1
            }}
          >
            <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>🚜</span>
          </div>
        </div>

        {/* Foreground Content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Top Bar inside Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.16)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#bbf7d0'
                }}
              >
                <span>🌱</span>
                <span>{language === 'mr' ? 'कृषी समाधान डिजिटल पोर्टल' : language === 'hi' ? 'कृषि समाधान डिजिटल पोर्टल' : 'Krishi Samadhan Intelligence'}</span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#ffffff'
                }}
              >
                <span>🛰️</span>
                <span>Sentinel-2 & Live Telemetry</span>
              </div>
            </div>

            {/* Location Switcher Button */}
            <button
              onClick={openProfileModal}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                color: '#ffffff',
                fontWeight: '700',
                borderRadius: '9999px',
                padding: '0.4rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)'
              }}
              title="Click to Switch Agricultural Region / District"
            >
              <span style={{ color: '#4ade80' }}>●</span>
              <span>📍 {activeLocation.name} ({language === 'mr' ? 'स्थान बदला' : language === 'hi' ? 'स्थान बदलें' : 'Switch Region'})</span>
            </button>
          </div>

          {/* Centerpiece: Animated Slogan Box */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.22)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '16px',
              padding: '1rem 1.4rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.6rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{slogan.icon}</span>
              <h1
                style={{
                  fontSize: '1.35rem',
                  fontWeight: '800',
                  lineHeight: '1.3',
                  letterSpacing: '-0.01em',
                  color: '#ffffff',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
                }}
              >
                {slogan.title}
              </h1>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#d1fae5', fontWeight: '500', paddingLeft: '0.2rem' }}>
              {slogan.subtitle}
            </p>

            {/* Slogan Pagination Indicator Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              {activeSlogans.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSloganIdx(idx)}
                  style={{
                    width: idx === currentSloganIdx ? '22px' : '7px',
                    height: '7px',
                    borderRadius: '9999px',
                    background: idx === currentSloganIdx ? '#34d399' : 'rgba(255, 255, 255, 0.35)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: idx === currentSloganIdx ? '0 0 8px #34d399' : 'none'
                  }}
                  aria-label={`Jump to slogan ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Live Telemetry Micro-Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '10px',
                padding: '4px 10px',
                fontSize: '0.76rem',
                fontWeight: '700',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Live Surface Temperature"
            >
              <span>🌡️</span>
              <span>{weatherData?.temperature !== undefined ? `${weatherData.temperature}°C` : '28°C'} {language === 'mr' ? 'हवामान' : 'Live Temp'}</span>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '10px',
                padding: '4px 10px',
                fontSize: '0.76rem',
                fontWeight: '700',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Topsoil Layer Moisture"
            >
              <span>💧</span>
              <span>{soilData?.moisture !== undefined ? `${soilData.moisture}%` : '38.5%'} {language === 'mr' ? 'ओलावा' : 'Soil Moisture'}</span>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '10px',
                padding: '4px 10px',
                fontSize: '0.76rem',
                fontWeight: '700',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Sentinel-2 Vegetative Biomass"
            >
              <span>🌾</span>
              <span>NDVI 0.72 {language === 'mr' ? '(उत्तम आरोग्य)' : '(Healthy Biomass)'}</span>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '10px',
                padding: '4px 10px',
                fontSize: '0.76rem',
                fontWeight: '700',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Nearest Registered APMC Mandi"
            >
              <span>💰</span>
              <span>{activeLocation.apmcMandi || "Sangamner APMC"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8 CORE MODULES GRID */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', marginBottom: '1rem', fontWeight: 800 }}>
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
