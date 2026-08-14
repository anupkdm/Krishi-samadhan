import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const { t } = useLanguage();

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img
            src="/logo.png"
            alt="Agri Samadhan Logo"
            className="navbar-logo-img"
          />
          <span className="navbar-brand-text">{t('brandName')}</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links desktop-only">
          <NavLink to="/" className="navbar-link">{t('home')}</NavLink>
          <a href="/#features" className="navbar-link">{t('features')}</a>
          <a href="/#how-it-works" className="navbar-link">{t('howItWorks')}</a>
        </div>

        {/* Desktop Action Buttons & Language Selector */}
        <div className="navbar-actions desktop-only">
          <LanguageSelector />

          {token ? (
            <>
              <Link to="/dashboard" className="btn btn-primary btn-sm">{t('dashboard')}</Link>
              <button
                onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
                className="btn btn-outline btn-sm"
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">{t('login')}</Link>
              <Link to="/dashboard" className="btn btn-primary btn-sm">{t('explorePlatform')}</Link>
            </>
          )}
        </div>

        {/* Mobile Actions: Language Selector + Hamburger Button */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LanguageSelector variant="compact" />
          <button
            className="hamburger-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-links">
            <Link to="/" className="mobile-drawer-link" onClick={closeMenu}>
              🏠 {t('home')}
            </Link>
            <a href="/#features" className="mobile-drawer-link" onClick={closeMenu}>
              ✨ {t('features')}
            </a>
            <a href="/#how-it-works" className="mobile-drawer-link" onClick={closeMenu}>
              🔄 {t('howItWorks')}
            </a>
            <Link to="/dashboard" className="mobile-drawer-link" onClick={closeMenu}>
              📊 {t('dashboard')}
            </Link>
          </div>

          <div className="mobile-drawer-actions">
            {token ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-block" onClick={closeMenu}>
                  {t('dashboard')}
                </Link>
                <button
                  onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
                  className="btn btn-outline btn-block"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-block" onClick={closeMenu}>
                  {t('login')}
                </Link>
                <Link to="/register" className="btn btn-secondary btn-block" onClick={closeMenu}>
                  {t('register')}
                </Link>
                <Link to="/dashboard" className="btn btn-primary btn-block" onClick={closeMenu}>
                  {t('explorePlatform')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
