import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import DataTable from '../components/DataTable';
import SourceBadge from '../components/SourceBadge';
import marketService from '../services/marketService';
import inputStoreService from '../services/inputStoreService';
import { useLanguage } from '../context/LanguageContext';
const Market = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('mandi'); // 'mandi' | 'seeds' | 'pesticides' | 'fertilizers'

  // APMC Mandi State
  const [mandiData, setMandiData] = useState([]);
  const [mandiLoading, setMandiLoading] = useState(true);
  const [mandiError, setMandiError] = useState(null);

  const [commodity, setCommodity] = useState('onion');
  const [district, setDistrict] = useState('All');
  const [selectedMandi, setSelectedMandi] = useState('All');

  // Input Store State (Seeds, Pesticides, Fertilizers)
  const [inputData, setInputData] = useState([]);
  const [inputLoading, setInputLoading] = useState(false);
  const [inputError, setInputError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('All');

  const commodities = [
    { id: 'onion', label: language === 'mr' ? 'कांदा (Onion)' : language === 'hi' ? 'प्याज (Onion)' : 'Onion (कांदा)' },
    { id: 'wheat', label: language === 'mr' ? 'गहू (Wheat)' : language === 'hi' ? 'गेहूं (Wheat)' : 'Wheat (गहू)' },
    { id: 'pomegranate', label: language === 'mr' ? 'डाळिंब (Pomegranate)' : language === 'hi' ? 'अनार (Pomegranate)' : 'Pomegranate (डाळिंब)' },
    { id: 'grapes', label: language === 'mr' ? 'द्राक्षे (Grapes)' : language === 'hi' ? 'अंगूर (Grapes)' : 'Grapes (द्राक्षे)' },
    { id: 'soybean', label: language === 'mr' ? 'सोयाबीन (Soybean)' : language === 'hi' ? 'सोयाबीन (Soybean)' : 'Soybean (सोयाबीन)' },
    { id: 'cotton', label: language === 'mr' ? 'कापूस (Cotton)' : language === 'hi' ? 'कपास (Cotton)' : 'Cotton (कापूस)' },
    { id: 'tomato', label: language === 'mr' ? 'टोमॅटो (Tomato)' : language === 'hi' ? 'टमाटर (Tomato)' : 'Tomato (टोमॅटो)' },
    { id: 'sugarcane', label: language === 'mr' ? 'ऊस (Sugarcane)' : language === 'hi' ? 'गन्ना (Sugarcane)' : 'Sugarcane (ऊस)' },
    { id: 'jowar', label: language === 'mr' ? 'ज्वारी (Jowar)' : language === 'hi' ? 'ज्वार (Jowar)' : 'Jowar (ज्वारी)' },
    { id: 'bajra', label: language === 'mr' ? 'बाजरी (Bajra)' : language === 'hi' ? 'बाजरा (Bajra)' : 'Bajra (बाजरी)' },
    { id: 'tur', label: language === 'mr' ? 'तूर (Tur/Arhar)' : language === 'hi' ? 'अरहर (Tur/Arhar)' : 'Tur / Arhar (तूर)' }
  ];

  const localMandis = ['All', 'Nashik', 'Sangamner', 'Kopargaon', 'Sinnar', 'Shirdi', 'Rahata', 'Yeola', 'Pune', 'Solapur', 'Kolhapur', 'Nagpur', 'Jalgaon'];
  const districts = ['All', 'Ahmednagar', 'Nashik', 'Pune', 'Solapur', 'Kolhapur', 'Nagpur', 'Jalgaon'];

  // Fetch Mandi Rates
  const fetchMarketData = async () => {
    setMandiLoading(true);
    setMandiError(null);
    try {
      const response = await marketService.getPrices({
        commodity,
        state: 'Maharashtra',
        district: district !== 'All' ? district : undefined,
        market: selectedMandi !== 'All' ? selectedMandi : undefined
      });
      setMandiData(response?.records || []);
    } catch (err) {
      console.error('Market fetch error:', err);
      setMandiError('Failed to fetch local market rates.');
    } finally {
      setMandiLoading(false);
    }
  };

  // Fetch Input Stores (Seeds, Pesticides, Fertilizers)
  const fetchInputStores = async () => {
    if (activeTab === 'mandi') return;
    setInputLoading(true);
    setInputError(null);
    try {
      const response = await inputStoreService.getInputs(activeTab, selectedLocality, searchQuery);
      setInputData(response?.records || []);
    } catch (err) {
      console.error('Input store fetch error:', err);
      setInputError('Failed to fetch input store price comparisons.');
    } finally {
      setInputLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'mandi') {
      fetchMarketData();
    } else {
      fetchInputStores();
    }
  }, [activeTab, commodity, district, selectedMandi, selectedLocality, searchQuery]);

  // Mandi Table Columns
  const mandiColumns = [
    {
      key: 'market',
      label: language === 'mr' ? 'कृषी उत्पन्न बाजार समिती (मंडी)' : language === 'hi' ? 'कृषि उपज मंडी (APMC)' : 'APMC Mandi / Market',
      render: (val, row) => (
        <div>
          <strong style={{ color: 'var(--primary-900)', fontSize: '0.98rem' }}>📍 {val} APMC</strong>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {language === 'mr' ? 'जिल्हा:' : language === 'hi' ? 'जिला:' : 'Dist:'} <strong>{row.district}</strong>, {row.state}
          </div>
        </div>
      )
    },
    {
      key: 'commodity',
      label: language === 'mr' ? 'शेतमाल' : language === 'hi' ? 'फसल' : 'Commodity',
      render: (val) => (
        <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
          {val}
        </span>
      )
    },
    {
      key: 'min_price',
      label: t('minPrice'),
      render: (val) => <span style={{ color: 'var(--text-secondary)' }}>₹{val} / qtl</span>
    },
    {
      key: 'max_price',
      label: t('maxPrice'),
      render: (val) => <span style={{ color: 'var(--text-secondary)' }}>₹{val} / qtl</span>
    },
    {
      key: 'modal_price',
      label: `${t('modalPrice')} (₹/qtl)`,
      render: (val) => (
        <strong style={{ color: 'var(--primary-700)', fontSize: '1.15rem' }}>
          ₹{val}
        </strong>
      )
    },
    {
      key: 'arrival_quantity',
      label: language === 'mr' ? 'दैनिक आवक' : language === 'hi' ? 'दैनिक आवक' : 'Daily Arrival Volume',
      render: (val) => <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📦 {val || '250 Quintals'}</span>
    },
    {
      key: 'price_date',
      label: language === 'mr' ? 'दिनांक' : language === 'hi' ? 'दिनांक' : 'Date',
      render: (val, row) => val || row.arrival_date || new Date().toISOString().split('T')[0]
    }
  ];

  const highestMandi = mandiData.length > 0 ? mandiData.reduce((max, p) => (p.modal_price > max.modal_price ? p : max), mandiData[0]) : null;
  const lowestMandi = mandiData.length > 0 ? mandiData.reduce((min, p) => (p.modal_price < min.modal_price ? p : min), mandiData[0]) : null;
  const priceDiff = highestMandi && lowestMandi ? highestMandi.modal_price - lowestMandi.modal_price : 0;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{t('marketTitle')}</h1>
            <p>{t('marketDesc')}</p>
          </div>
          <SourceBadge source="AGMARKNET & Verified Krishi Seva Kendras" status="Live Locality Rates" />
        </div>
      </div>

      {/* Main 4-Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${activeTab === 'mandi' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('mandi')}
        >
          📊 {t('apmcRates')}
        </button>
        <button
          className={`btn ${activeTab === 'seeds' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('seeds')}
        >
          🌱 {t('seeds')} ({t('priceComparison')})
        </button>
        <button
          className={`btn ${activeTab === 'pesticides' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('pesticides')}
        >
          🧪 {t('pesticides')} ({t('priceComparison')})
        </button>
        <button
          className={`btn ${activeTab === 'fertilizers' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('fertilizers')}
        >
          ⚡ {t('fertilizers')} ({t('priceComparison')})
        </button>
      </div>

      {/* =========================================================================
         TAB 1: APMC MANDI RATES
         ========================================================================= */}
      {activeTab === 'mandi' && (
        <>
          {/* Locality Quick Chips */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.6rem' }}>
              📍 {language === 'mr' ? 'स्थानिक बाजार समिती निवडा:' : language === 'hi' ? 'स्थानीय मंडी चुनें:' : 'Select Nearby Locality APMC Mandi:'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {localMandis.map((mandi) => (
                <button
                  key={mandi}
                  onClick={() => setSelectedMandi(mandi)}
                  className={`btn btn-sm ${selectedMandi === mandi ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: 'var(--radius-pill)', padding: '0.35rem 0.85rem' }}
                >
                  {mandi === 'All' ? (language === 'mr' ? '🌐 सर्व नजीकच्या मंड्या' : language === 'hi' ? '🌐 सभी मंडियां' : '🌐 All Nearby Mandis') : `🏛️ ${mandi}`}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">🌾 {language === 'mr' ? 'शेतमाल निवडा' : language === 'hi' ? 'फसल चुनें' : 'Target Crop / Commodity'}</label>
                <select
                  className="form-select"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                >
                  {commodities.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">📍 {language === 'mr' ? 'जिल्हा' : language === 'hi' ? 'जिला फ़िल्टर' : 'District Filter'}</label>
                <select
                  className="form-select"
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setSelectedMandi('All');
                  }}
                >
                  {districts.map(d => <option key={d} value={d}>{d === 'All' ? (language === 'mr' ? 'सर्व जिल्हे' : language === 'hi' ? 'सभी जिले' : 'All Districts') : `${d} District`}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">🏛️ {language === 'mr' ? 'विशिष्ट बाजार समिती' : language === 'hi' ? 'विशिष्ट मंडी' : 'Specific APMC Market'}</label>
                <select
                  className="form-select"
                  value={selectedMandi}
                  onChange={(e) => setSelectedMandi(e.target.value)}
                >
                  {localMandis.map(m => <option key={m} value={m}>{m === 'All' ? (language === 'mr' ? 'सर्व स्थानिक बाजार समित्या' : language === 'hi' ? 'सभी स्थानीय मंडियां' : 'All Local APMCs') : `${m} APMC`}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Comparison Highlights */}
          {highestMandi && lowestMandi && mandiData.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="card" style={{ borderLeft: '5px solid #10b981', background: '#fafdfb' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {language === 'mr' ? 'कमाल सरासरी दर' : language === 'hi' ? 'उच्चतम औसत भाव' : 'Highest Local Modal Rate'}
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#10b981', margin: '0.2rem 0' }}>
                  ₹{highestMandi.modal_price} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ qtl</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>📍 {highestMandi.market} APMC</strong> ({highestMandi.district})
                </div>
              </div>

              <div className="card" style={{ borderLeft: '5px solid #ef4444', background: '#fdfbfa' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {language === 'mr' ? 'किमान सरासरी दर' : language === 'hi' ? 'न्यूनतम औसत भाव' : 'Lowest Local Modal Rate'}
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ef4444', margin: '0.2rem 0' }}>
                  ₹{lowestMandi.modal_price} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ qtl</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>📍 {lowestMandi.market} APMC</strong> ({lowestMandi.district})
                </div>
              </div>

              <div className="card" style={{ borderLeft: '5px solid #3b82f6', background: '#f8faff' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {language === 'mr' ? 'दरांमधील फरक (नफा संधी)' : language === 'hi' ? 'भाव में अंतर (लाभ अवसर)' : 'Inter-Mandi Arbitrage Spread'}
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#3b82f6', margin: '0.2rem 0' }}>
                  +₹{priceDiff} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ qtl</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {lowestMandi.market} {language === 'mr' ? 'पेक्षा' : 'to'} {highestMandi.market} {language === 'mr' ? 'मध्ये जास्त दर मिळतो.' : 'offers higher realization.'}
                </div>
              </div>
            </div>
          )}

          {/* Mandi Table */}
          <div className="card">
            <div className="card-header">
              <h2>📊 {t('apmcRates')}: {commodity.toUpperCase()}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{mandiData.length} {language === 'mr' ? 'बाजार समित्या' : 'APMC Mandis'}</span>
            </div>

            {mandiLoading ? (
              <LoadingState message={`${t('loadingMsg')} (${commodity})...`} />
            ) : mandiError ? (
              <ErrorState message={mandiError} onRetry={fetchMarketData} />
            ) : (
              <DataTable
                data={mandiData}
                columns={mandiColumns}
                emptyMessage={`No mandi price records found for ${commodity}.`}
              />
            )}
          </div>
        </>
      )}

      {/* =========================================================================
         TABS 2, 3, 4: INPUT STORES (SEEDS, PESTICIDES, FERTILIZERS)
         ========================================================================= */}
      {activeTab !== 'mandi' && (
        <>
          {/* Locality & Search Filter Bar */}
          <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">📍 {language === 'mr' ? 'शहर / तालुका फिल्टर' : language === 'hi' ? 'शहर / स्थान फ़िल्टर' : 'Filter by Locality / Town'}</label>
                <select
                  className="form-select"
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                >
                  {localMandis.map(m => (
                    <option key={m} value={m}>
                      {m === 'All' ? (language === 'mr' ? '🌐 सर्व दुकाने (महाराष्ट्र)' : language === 'hi' ? '🌐 सभी दुकानें' : '🌐 All Shops') : `🏪 ${m} Outlets`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">🔍 {language === 'mr' ? 'ब्रँड किंवा औषध शोधा' : language === 'hi' ? 'ब्रांड या दवा खोजें' : 'Search Brand / Item'}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={language === 'mr' ? 'उदा. कांदा, कापूस, कोराजन, युरिया...' : 'e.g. Cotton, Onion, Coragen, Urea, Syngenta...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Cards Display */}
          {inputLoading ? (
            <LoadingState message={`${t('loadingMsg')}...`} />
          ) : inputError ? (
            <ErrorState message={inputError} onRetry={fetchInputStores} />
          ) : inputData.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏪</div>
              <h3>{language === 'mr' ? 'कोणतीही नोंद आढळली नाही' : language === 'hi' ? 'कोई उत्पाद नहीं मिला' : 'No input items matching search criteria'}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{language === 'mr' ? 'कृपया शोध शब्द बदलून पहा.' : 'Try choosing "All Outlets" or clearing your search query.'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {inputData.map((item) => (
                <div key={item.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
                    <div>
                      <span className="badge badge-info" style={{ marginBottom: '0.35rem' }}>
                        {item.crop ? `${language === 'mr' ? 'पीक:' : 'Crop:'} ${item.crop}` : item.category.toUpperCase()}
                      </span>
                      <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', margin: '0.2rem 0' }}>
                        {item.variety || item.name}
                      </h2>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        <strong>{language === 'mr' ? 'कंपनी / ब्रँड:' : 'Brand / Mfg:'}</strong> {item.brand} | <strong>{language === 'mr' ? 'पॅकिंग:' : 'Pack Size:'}</strong> {item.packSize}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-700)' }}>
                        ₹{item.avgPrice || item.mrp}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.mrp ? (language === 'mr' ? 'शासकीय कमाल किंमत (MRP)' : 'Govt Fixed MRP') : (language === 'mr' ? 'सरासरी स्थानिक किरकोळ दर' : 'Avg Local Retail Price')}
                      </div>
                    </div>
                  </div>

                  {/* Shop Price Comparison Grid */}
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>🏬</span>
                    <span>{t('priceComparison')} & {language === 'mr' ? 'उपलब्ध साठा:' : 'Stock Availability:'}</span>
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                    {item.shops.map((shop, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#f9fbf9',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--primary-900)', fontSize: '0.92rem', display: 'block' }}>
                            {shop.shopName}
                          </strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            📍 {shop.locality}, {shop.district} | ⭐ {shop.rating}/5
                          </div>
                          <span className="badge badge-success" style={{ fontSize: '0.68rem', marginTop: '0.25rem' }}>
                            {shop.stock}
                          </span>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-800)' }}>
                            ₹{shop.price}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{language === 'mr' ? 'प्रति नग' : 'Per Unit'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Market;
