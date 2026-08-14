import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SourceBadge from '../components/SourceBadge';
import schemesService from '../services/schemesService';
import { useLanguage } from '../context/LanguageContext';

const GovernmentSchemes = () => {
  const { t, language } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'income support', 'crop insurance', 'solar/irrigation', 'soil health', 'credit', 'market', 'infrastructure', 'sustainability'];

  const getCategoryLabel = (c) => {
    if (c === 'All') return t('allCategories');
    if (language === 'mr') {
      if (c === 'income support') return 'आर्थिक मदत / अनुदान';
      if (c === 'crop insurance') return 'पीक विमा';
      if (c === 'solar/irrigation') return 'सौर पंप / सिंचन';
      if (c === 'soil health') return 'मृदा आरोग्य';
      if (c === 'credit') return 'पीक कर्ज / KCC';
      if (c === 'market') return 'बाजारपेठ';
      if (c === 'infrastructure') return 'पायाभूत सुविधा / शेततळे';
      if (c === 'sustainability') return 'सेंद्रिय शेती';
    }
    if (language === 'hi') {
      if (c === 'income support') return 'आय सहायता / अनुदान';
      if (c === 'crop insurance') return 'फसल बीमा';
      if (c === 'solar/irrigation') return 'सोलर पंप / सिंचाई';
      if (c === 'soil health') return 'मृदा स्वास्थ्य';
      if (c === 'credit') return 'किसान क्रेडिट कार्ड (KCC)';
      if (c === 'market') return 'मंडी / विपणन';
      if (c === 'infrastructure') return 'खेत तालाब / अधोसंरचना';
      if (c === 'sustainability') return 'जैविक कृषि';
    }
    return c.toUpperCase();
  };

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await schemesService.getSchemes(
        search || undefined,
        category !== 'All' ? category : undefined
      );
      const schemeList = response?.records || response?.schemes || (Array.isArray(response) ? response : []);
      setSchemes(schemeList);
    } catch (err) {
      console.error('Schemes fetch error:', err);
      setError('Failed to load government schemes repository.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{t('schemesTitle')}</h1>
            <p>{t('schemesDesc')}</p>
          </div>
          <SourceBadge source="Ministry of Agriculture & MahaDBT" status="Verified Portal Data" />
        </div>
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
        <span style={{ fontSize: '0.88rem', color: '#b45309' }}>
          <strong>{language === 'mr' ? 'शासकीय सूचना:' : language === 'hi' ? 'शासकीय सूचना:' : 'Official Advisory:'}</strong> {language === 'mr' ? 'योजनेचा लाभ घेण्यासाठी महाडीबीटी किंवा संबंधित मंत्रालयाच्या अधिकृत पोर्टलवर जाऊन आवश्यक कागदपत्रे व मुदतीची खात्री करा.' : language === 'hi' ? 'योजना के लाभ हेतु आधिकारिक पोर्टल पर पात्रता एवं दस्तावेजों की जांच अवश्य करें।' : 'Always verify current eligibility, documentation criteria, and application deadlines on the respective official ministry portals before applying.'}
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <input
              type="text"
              className="form-control"
              placeholder={t('searchSchemes')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ flex: '0 0 220px' }}>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ textTransform: 'capitalize' }}
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {getCategoryLabel(c)}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            🔍 {t('search')}
          </button>
        </form>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <LoadingState message={`${t('loadingMsg')}...`} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSchemes} />
      ) : schemes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏛️</div>
          <h3>{language === 'mr' ? 'कोणतीही योजना आढळली नाही' : language === 'hi' ? 'कोई योजना नहीं मिली' : 'No matching schemes found'}</h3>
          <p style={{ color: 'var(--text-muted)' }}>{language === 'mr' ? 'कृपया शोध शब्द बदलून पहा.' : 'Try adjusting your search criteria or category filter.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {schemes.map((scheme, idx) => (
            <div key={scheme.id || idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary-600)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                    {scheme.category || 'Agricultural Scheme'}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-800)', background: 'var(--primary-50)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {scheme.source || 'Govt Portal'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                  {scheme.name}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {scheme.description}
                </p>

                <div style={{ background: '#f8faf9', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-900)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    💰 {t('benefits')}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>
                    {scheme.benefits}
                  </div>
                </div>

                {scheme.eligibility && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    <strong>{t('eligibility')}:</strong> {scheme.eligibility}
                  </div>
                )}
              </div>

              <div>
                <a
                  href={scheme.url || scheme.link || "https://mahadbt.maharashtra.gov.in"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-block"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: '700' }}
                >
                  <span>{t('visitPortal')}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default GovernmentSchemes;
