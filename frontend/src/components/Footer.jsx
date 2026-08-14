import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/logo.png"
              alt="Krishi Samadhan Logo"
              style={{ width: '34px', height: '34px', objectFit: 'contain', borderRadius: '50%', background: '#fff', padding: '2px' }}
            />
            <span>{t('brandName')}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: '1.6' }}>
            {t('tagline')}
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/dashboard">{t('overview')}</Link>
            <Link to="/dashboard/weather">{t('weatherMonitoring')}</Link>
            <Link to="/dashboard/market">{t('marketIntelligence')}</Link>
            <Link to="/dashboard/advisory">{t('farmerAdvisory')}</Link>
            <Link to="/dashboard/schemes">{t('govSchemes')}</Link>
          </div>
        </div>
        <div>
          <h4>Disclaimer</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Agricultural data is synthesized from verified meteorological, satellite, and government sources.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            © {new Date().getFullYear()} {t('brandName')}
          </p>
        </div>
      </div>
    </footer>
  );
}
