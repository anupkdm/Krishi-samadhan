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
  const { t } = useLanguage();
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
    { id: 'onion', label: 'Onion (कांदा / प्याज)' },
    { id: 'wheat', label: 'Wheat (गहू / गेहूं)' },
    { id: 'pomegranate', label: 'Pomegranate (डाळिंब / अनार)' },
    { id: 'grapes', label: 'Grapes (द्राक्षे / अंगूर)' },
    { id: 'soybean', label: 'Soybean (सोयाबीन)' },
    { id: 'cotton', label: 'Cotton (कापूस / कपास)' },
    { id: 'tomato', label: 'Tomato (टोमॅटो / टमाटर)' },
    { id: 'sugarcane', label: 'Sugarcane (ऊस / गन्ना)' },
    { id: 'jowar', label: 'Jowar (ज्वारी / ज्वार)' },
    { id: 'bajra', label: 'Bajra (बाजरी / बाजरा)' },
    { id: 'tur', label: 'Tur / Arhar (तूर / अरहर)' }
  ];

  const localMandis = ['All', 'Nashik', 'Sangamner', 'Kopargaon', 'Sinnar', 'Shirdi', 'Rahata', 'Yeola', 'Rahuri', 'Niphad'];
  const districts = ['All', 'Ahmednagar', 'Nashik', 'Pune', 'Solapur'];

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
      label: 'APMC Mandi / Market',
      render: (val, row) => (
        <div>
          <strong style={{ color: 'var(--primary-900)', fontSize: '0.98rem' }}>📍 {val} APMC</strong>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Dist: <strong>{row.district}</strong>, {row.state}
          </div>
        </div>
      )
    },
    {
      key: 'commodity',
      label: 'Commodity',
      render: (val) => (
        <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
          {val}
        </span>
      )
    },
    {
      key: 'min_price',
      label: 'Min Price',
      render: (val) => <span style={{ color: 'var(--text-secondary)' }}>₹{val} / qtl</span>
    },
    {
      key: 'max_price',
      label: 'Max Price',
      render: (val) => <span style={{ color: 'var(--text-secondary)' }}>₹{val} / qtl</span>
    },
    {
      key: 'modal_price',
      label: 'Modal Price (₹/qtl)',
      render: (val) => (
        <strong style={{ color: 'var(--primary-700)', fontSize: '1.15rem' }}>
          ₹{val}
        </strong>
      )
    },
    {
      key: 'arrival_quantity',
      label: 'Daily Arrival Volume',
      render: (val) => <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📦 {val || '250 Quintals'}</span>
    },
    {
      key: 'price_date',
      label: 'Date',
      render: (val, row) => val || row.arrival_date || new Date().toISOString().split('T')[0]
    }
  ];

  // Comparisons for Mandi
  const highestMandi = mandiData.length > 0 ? mandiData.reduce((max, p) => (p.modal_price > max.modal_price ? p : max), mandiData[0]) : null;
  const lowestMandi = mandiData.length > 0 ? mandiData.reduce((min, p) => (p.modal_price < min.modal_price ? p : min), mandiData[0]) : null;
  const priceDiff = highestMandi && lowestMandi ? highestMandi.modal_price - lowestMandi.modal_price : 0;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{t('marketIntelligence')} & Local Shop Prices</h1>
            <p>Live APMC mandi rates, seeds, pesticides & fertilizer price comparisons across Nashik, Sangamner, Kopargaon, Sinnar, Shirdi, Rahata & Yeola.</p>
          </div>
          <SourceBadge source="AGMARKNET & Verified Local Krishi Seva Kendras" status="Live Locality Rates" />
        </div>
      </div>

      {/* Main 4-Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${activeTab === 'mandi' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('mandi')}
        >
          📊 APMC Mandi Crop Rates
        </button>
        <button
          className={`btn ${activeTab === 'seeds' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('seeds')}
        >
          🌱 Seeds & Hybrids (Shop Prices)
        </button>
        <button
          className={`btn ${activeTab === 'pesticides' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('pesticides')}
        >
          🧪 Pesticides & Spray (Shop Prices)
        </button>
        <button
          className={`btn ${activeTab === 'fertilizers' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('fertilizers')}
        >
          ⚡ Fertilizer Bag Rates & MRP
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
              📍 Select Nearby Locality APMC Mandi:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {localMandis.map((mandi) => (
                <button
                  key={mandi}
                  onClick={() => setSelectedMandi(mandi)}
                  className={`btn btn-sm ${selectedMandi === mandi ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: 'var(--radius-pill)', padding: '0.35rem 0.85rem' }}
                >
                  {mandi === 'All' ? '🌐 All Nearby Mandis' : `🏛️ ${mandi}`}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">🌾 Target Crop / Commodity</label>
                <select
                  className="form-select"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                >
                  {commodities.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">📍 District Filter</label>
                <select
                  className="form-select"
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setSelectedMandi('All');
                  }}
                >
                  {districts.map(d => <option key={d} value={d}>{d === 'All' ? 'All Districts (Ahmednagar + Nashik)' : `${d} District`}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">🏛️ Specific APMC Market</label>
                <select
                  className="form-select"
                  value={selectedMandi}
                  onChange={(e) => setSelectedMandi(e.target.value)}
                >
                  {localMandis.map(m => <option key={m} value={m}>{m === 'All' ? 'All Local APMCs' : `${m} APMC`}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Comparison Highlights */}
          {highestMandi && lowestMandi && mandiData.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="card" style={{ borderLeft: '5px solid #10b981', background: '#fafdfb' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Highest Local Modal Rate</div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#10b981', margin: '0.2rem 0' }}>
                  ₹{highestMandi.modal_price} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ qtl</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>📍 {highestMandi.market} APMC</strong> ({highestMandi.district} Dist)
                </div>
              </div>

              <div className="card" style={{ borderLeft: '5px solid #ef4444', background: '#fdfbfa' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Lowest Local Modal Rate</div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ef4444', margin: '0.2rem 0' }}>
                  ₹{lowestMandi.modal_price} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ qtl</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>📍 {lowestMandi.market} APMC</strong> ({lowestMandi.district} Dist)
                </div>
              </div>

              <div className="card" style={{ borderLeft: '5px solid #3b82f6', background: '#f8faff' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Inter-Mandi Arbitrage Spread</div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#3b82f6', margin: '0.2rem 0' }}>
                  +₹{priceDiff} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ qtl</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Compare transport from {lowestMandi.market} to {highestMandi.market}.
                </div>
              </div>
            </div>
          )}

          {/* Mandi Table */}
          <div className="card">
            <div className="card-header">
              <h2>📊 APMC Mandi Price Records: {commodity.toUpperCase()}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{mandiData.length} APMC Mandis Active</span>
            </div>

            {mandiLoading ? (
              <LoadingState message="Fetching live APMC mandi rates for Nashik, Sangamner, Kopargaon, Sinnar, Shirdi, Rahata & Yeola..." />
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
                <label className="form-label">📍 Filter by Locality / Town</label>
                <select
                  className="form-select"
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                >
                  {localMandis.map(m => (
                    <option key={m} value={m}>
                      {m === 'All' ? '🌐 All Shops (Nashik, Sangamner, Kopargaon, Sinnar, Shirdi, Rahata, Yeola)' : `🏪 ${m} Outlets`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">🔍 Search Brand / Item</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Cotton, Onion, Coragen, Urea, Syngenta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Cards Display */}
          {inputLoading ? (
            <LoadingState message={`Fetching local shop prices for ${activeTab}...`} />
          ) : inputError ? (
            <ErrorState message={inputError} onRetry={fetchInputStores} />
          ) : inputData.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏪</div>
              <h3>No input items matching search criteria</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try choosing "All Outlets" or clearing your search query.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {inputData.map((item) => (
                <div key={item.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
                    <div>
                      <span className="badge badge-info" style={{ marginBottom: '0.35rem' }}>
                        {item.crop ? `Crop: ${item.crop}` : item.category.toUpperCase()}
                      </span>
                      <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', margin: '0.2rem 0' }}>
                        {item.variety || item.name}
                      </h2>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        <strong>Brand / Mfg:</strong> {item.brand} | <strong>Pack Size:</strong> {item.packSize}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-700)' }}>
                        ₹{item.avgPrice || item.mrp}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.mrp ? 'Govt Fixed MRP' : 'Avg Local Retail Price'}
                      </div>
                    </div>
                  </div>

                  {/* Shop Price Comparison Grid */}
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>🏬</span>
                    <span>Local Shop Prices & Stock Availability:</span>
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
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Per Unit</div>
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
