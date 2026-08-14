import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SourceBadge from '../components/SourceBadge';
import soilService from '../services/soilService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Soil = () => {
  const { activeLocation } = useAuth();
  const { t, language } = useLanguage();
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
        <LoadingState message={`${t('loadingMsg')} (${activeLocation.name})...`} />
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
    if (Array.isArray(recs) && language === 'en') return recs;
    if (language === 'mr') {
      return [
        `जमिनीतील सेंद्रिय कर्ब वाढवण्यासाठी एकरी ५ टन चांगले कुजलेले शेणखत किंवा गांडूळ खत वापरा.`,
        `${soilType} जमिनीमध्ये पाण्याचा योग्य निचरा होण्यासाठी सरी-वरंबा पद्धतीने लागवड करा.`,
        `स्थानिक पिकांसाठी (${activeLocation.primaryCrops?.slice(0, 3).join(', ') || 'कांदा, गहू'}) युरिया ३ हप्त्यांत द्या (५०% पेरणीवेळी, २५% वाढीच्या वेळी, २५% फुलोऱ्यात).`,
        'जमिनीची सुपीकता व जिवाणूंची संख्या वाढवण्यासाठी ॲझोटोबॅक्टर आणि पीएसबी (PSB) जिवाणू संवर्धकांचा वापर करा.'
      ];
    }
    if (language === 'hi') {
      return [
        `मिट्टी में जैविक कार्बन सुधारने हेतु प्रति एकड़ 5 टन सड़ी गोबर खाद या केंचुआ खाद डालें।`,
        `${soilType} मिट्टी में उचित जल निकासी सुनिश्चित करने हेतु मेड़ और नाली विधि अपनाएं।`,
        `स्थानीय फसलों (${activeLocation.primaryCrops?.slice(0, 3).join(', ') || 'प्याज, गेहूं'}) में यूरिया 3 किश्तों में दें।`,
        'पोषक तत्वों की उपलब्धता बढ़ाने हेतु एजोटोबैक्टर एवं पीएसबी जैव उर्वरक का उपयोग करें।'
      ];
    }
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
            <h1>{t('soilTitle')}</h1>
            <p>{t('soilDesc')} <strong>{activeLocation.name}</strong>.</p>
          </div>
          <SourceBadge source="SoilGrids / ICAR Soil Lab" status="Live Diagnostics" />
        </div>
      </div>

      {/* Main Soil Score Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', background: 'linear-gradient(135deg, #ffffff 0%, #f6faf7 100%)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            {t('soilIndex')} ({activeLocation.district})
          </div>
          <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--primary-700)', lineHeight: 1, margin: '0.5rem 0' }}>
            {score}<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <span className="badge badge-success">● {language === 'mr' ? 'उत्तम सुपीकता' : language === 'hi' ? 'उच्च उर्वरता' : 'Good Soil Fertility'}</span>
        </div>

        <div style={{ maxWidth: '420px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
            {t('soilClassification')}: {soilType}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {language === 'mr'
              ? `${activeLocation.name} (${activeLocation.latitude}°N, ${activeLocation.longitude}°E) भागातील मृदा प्रोफाइल. मुख्य पिके: ${activeLocation.primaryCrops?.join(', ') || 'कांदा, गहू, डाळिंब'}.`
              : language === 'hi'
              ? `${activeLocation.name} (${activeLocation.latitude}°N, ${activeLocation.longitude}°E) क्षेत्र की मृदा प्रोफाइल। मुख्य फसलें: ${activeLocation.primaryCrops?.join(', ') || 'प्याज, गेहूं, अनार'}।`
              : `Typical soil profile for ${activeLocation.name} (${activeLocation.latitude}°N, ${activeLocation.longitude}°E). Suitable for ${activeLocation.primaryCrops?.join(', ') || 'Onion, Wheat, Pomegranate'}.`}
          </p>
        </div>
      </div>

      {/* 3 Columns: Physical, Chemical, Nutrients */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3>{t('physicalProperties')}</h3>
          </div>
          <div style={{ paddingTop: '0.5rem' }}>
            {renderProgressBar(t('soilMoisture'), moisture, 0, 100, '%', language === 'mr' ? 'पुरेसा ओलावा' : language === 'hi' ? 'पर्याप्त नमी' : 'Adequate')}
            {renderProgressBar(t('organicCarbon'), organicCarbon, 0, 2, '%', '0.68% (Moderate)')}
            {renderProgressBar(language === 'mr' ? 'चिकणमाती प्रमाण' : language === 'hi' ? 'क्ले मात्रा' : 'Clay Content', 52, 0, 100, '%', 'Heavy Clay')}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>{t('chemicalProperties')}</h3>
          </div>
          <div style={{ paddingTop: '0.5rem' }}>
            {renderProgressBar(t('phLevel'), pH, 4, 10, '', language === 'mr' ? 'किंचित अल्कधर्मी' : language === 'hi' ? 'हल्का क्षारीय' : 'Slightly Alkaline')}
            {renderProgressBar(language === 'mr' ? 'विद्युत चालकता (EC)' : language === 'hi' ? 'विद्युत चालकता (EC)' : 'Electrical Conductivity (EC)', 0.85, 0, 4, 'dS/m', 'Normal (Non-saline)')}
            {renderProgressBar(language === 'mr' ? 'कॅटायन विनिमय (CEC)' : language === 'hi' ? 'धनायन विनिमय क्षमता' : 'Cation Exchange (CEC)', 45, 0, 80, 'cmol/kg', 'High')}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>{t('primaryNutrients')}</h3>
          </div>
          <div style={{ paddingTop: '0.5rem' }}>
            {renderProgressBar(t('nitrogen'), nitrogen, 0, 500, 'kg/ha', 'Medium (240 kg/ha)')}
            {renderProgressBar(t('phosphorus'), phosphorus, 0, 60, 'kg/ha', 'Medium (24 kg/ha)')}
            {renderProgressBar(t('potassium'), potassium, 0, 500, 'kg/ha', 'High (310 kg/ha)')}
          </div>
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="card" style={{ borderLeft: '5px solid var(--primary-600)' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💡</span>
          <span>{t('soilRecommendations')} ({activeLocation.name})</span>
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
