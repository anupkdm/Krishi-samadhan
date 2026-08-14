import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import AlertCard from '../components/AlertCard';
import advisoryService from '../services/advisoryService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Advisory = () => {
  const { activeLocation } = useAuth();
  const { t, language } = useLanguage();
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdvisories = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = activeLocation.latitude || 19.8833;
      const lon = activeLocation.longitude || 74.4833;
      const response = await advisoryService.getAdvisories(lat, lon);
      let list = response?.records || response?.advisories || (Array.isArray(response) ? response : []);

      // If Marathi or Hindi, translate advisory content dynamically
      if (language === 'mr') {
        list = list.map(item => ({
          ...item,
          title: item.title.includes('Drip') ? 'ठिबक सिंचन व ओलावा सल्ला' :
                 item.title.includes('Onion') ? 'कांदा पीक: फुलकिडे (थ्रिप्स) व जांभळा करपा नियंत्रण' :
                 item.title.includes('Fertilizer') || item.title.includes('Nitrogen') ? 'नत्र खत व्यवस्थापन (युरिया डोस)' :
                 item.title.includes('Pomegranate') ? 'डाळिंब: तेल्या रोग व फुलगळ प्रतिबंध' :
                 item.title.includes('Heavy Rain') || item.title.includes('Drainage') ? 'पाण्याचा निचरा व सरी-वरंबा नियोजन' :
                 item.title.includes('Cotton') ? 'कापूस: गुलाबी बोंडअळी सर्वेक्षण' :
                 item.title.includes('Mandi') || item.title.includes('Market') ? `${activeLocation.apmcMandi} बाजार समिती भाव संधी` :
                 item.title.includes('MahaDBT') || item.title.includes('Subsidy') ? 'महाडीबीटी ठिबक सिंचन अनुदान' : item.title,
          action: item.action ? `सल्ला: ${item.action}` : item.action
        }));
      } else if (language === 'hi') {
        list = list.map(item => ({
          ...item,
          title: item.title.includes('Drip') ? 'ड्रिप सिंचाई एवं मृदा नमी प्रबंधन' :
                 item.title.includes('Onion') ? 'प्याज: थ्रिप्स व पर्पल ब्लॉच रोग नियंत्रण' :
                 item.title.includes('Fertilizer') || item.title.includes('Nitrogen') ? 'नाइट्रोजन खाद (यूरिया) का विभाजन' :
                 item.title.includes('Pomegranate') ? 'अनार: तेल्या रोग एवं फल झुलसा रोकथाम' :
                 item.title.includes('Heavy Rain') || item.title.includes('Drainage') ? 'जल निकासी एवं मेड़-नाली प्रबंधन' :
                 item.title.includes('Cotton') ? 'कपास: गुलाबी सुंडी (Bollworm) रोकथाम' :
                 item.title.includes('Mandi') || item.title.includes('Market') ? `${activeLocation.apmcMandi} मंडी मूल्य अवसर` :
                 item.title.includes('MahaDBT') || item.title.includes('Subsidy') ? 'ड्रिप सिंचाई सरकारी सब्सिडी' : item.title,
          action: item.action ? `सलाह: ${item.action}` : item.action
        }));
      }

      setAdvisories(list);
    } catch (err) {
      console.error('Advisory fetch error:', err);
      setError('Failed to fetch agricultural advisories.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const lat = activeLocation.latitude || 19.8833;
      const lon = activeLocation.longitude || 74.4833;
      const response = await advisoryService.generateAdvisories(lat, lon);
      const list = response?.records || response?.advisories || (Array.isArray(response) ? response : []);
      setAdvisories(list);
    } catch (err) {
      console.error('Advisory generation error:', err);
      setError('Failed to generate fresh advisories.');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, [activeLocation, language]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{t('advisoryTitle')}</h1>
            <p>{t('advisoryDesc')} <strong>{activeLocation.name}</strong> ({activeLocation.district}).</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={generating || loading}
          >
            {generating ? t('synthesizing') : t('rerunEngine')}
          </button>
        </div>
      </div>

      {/* Advisory Architecture Engine Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #f6faf7 100%)' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '1rem', textAlign: 'center' }}>
          🌾 {language === 'mr' ? 'एकीकृत कृषी निर्णय साखळी' : language === 'hi' ? 'एकीकृत कृषि निर्णय पाइपलाइन' : 'Unified Decision-Support Pipeline'} ({activeLocation.district})
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
              🌤️ {activeLocation.district} {t('temperature')}
            </span>
            <span style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
              🌱 {activeLocation.soilType}
            </span>
            <span style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
              🛰️ Sentinel-2 NDVI
            </span>
            <span style={{ padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
              💰 {activeLocation.apmcMandi}
            </span>
          </div>

          <div style={{ fontSize: '1.5rem', color: 'var(--primary-500)', fontWeight: 'bold' }}>➔</div>

          <div style={{ background: 'var(--primary-600)', color: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: '800', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(45,106,79,0.3)' }}>
            ⚙️ {language === 'mr' ? 'कृषी सल्लागार इंजिन' : language === 'hi' ? 'कृषि एडवाइजरी इंजन' : 'Advisory Rule Engine'}
          </div>

          <div style={{ fontSize: '1.5rem', color: 'var(--primary-500)', fontWeight: 'bold' }}>➔</div>

          <div style={{ background: 'var(--primary-100)', color: 'var(--primary-900)', border: '1px solid var(--primary-300)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '0.85rem' }}>
            ✅ {t('activeAdvisories')}
          </div>
        </div>
      </div>

      {/* Advisory Feed */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📋</span>
          <span>{t('activeAdvisories')} ({advisories.length})</span>
        </h2>
      </div>

      {loading || generating ? (
        <LoadingState message={`${t('loadingMsg')} (${activeLocation.name})...`} />
      ) : error ? (
        <ErrorState message={error} onRetry={handleGenerate} />
      ) : advisories.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
          <h3>{language === 'mr' ? 'सर्व परिस्थिती उत्तम आहे' : language === 'hi' ? 'सभी स्थितियां अनुकूल हैं' : 'All Conditions Optimal'}</h3>
          <p style={{ color: 'var(--text-muted)' }}>{language === 'mr' ? 'सध्या कोणत्याही तातडीच्या कृषी हस्तक्षेपाची आवश्यकता नाही.' : 'No high-priority agricultural interventions currently required.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {advisories.map((advisory, idx) => (
            <AlertCard
              key={idx}
              type={advisory.type}
              priority={advisory.priority}
              title={advisory.title}
              description={advisory.description}
              action={advisory.action}
              source={advisory.source}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Advisory;
