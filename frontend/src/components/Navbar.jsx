import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { user, activeLocation, openProfileModal } = useAuth();
  const token = localStorage.getItem('token');

  const closeMenu = () => setIsOpen(false);

  const getInitials = (name) => {
    if (!name) return 'K';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img
            src="/logo.png"
            alt="Krishi Samadhan Logo"
            className="navbar-logo-img"
          />
          <span className="navbar-brand-text">{t('brandName')}</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links desktop-only">
          <NavLink to="/" className="navbar-link">{t('home')}</NavLink>
          <NavLink to="/dashboard" className="navbar-link">{t('dashboard')}</NavLink>
          <a href="/#features" className="navbar-link">{t('features')}</a>
          <a href="/#how-it-works" className="navbar-link">{t('howItWorks')}</a>
        </div>

        {/* Desktop Action Buttons & Language Selector */}
        <div className="navbar-actions desktop-only">
          {token && (
            <button
              onClick={openProfileModal}
              className="btn btn-sm"
              style={{
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                color: 'var(--primary-900)',
                fontWeight: '700',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: '20px',
                padding: '0.35rem 0.85rem'
              }}
              title="Current Farm Location"
            >
              <span>📍</span>
              <span>{activeLocation.name}</span>
            </button>
          )}

          <LanguageSelector />

          {token ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/dashboard" className="btn btn-primary btn-sm">{t('dashboard')}</Link>
              
              {/* Profile Avatar */}
              <button
                onClick={openProfileModal}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-700)',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  border: '2px solid #ffffff',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Account Profile"
              >
                {getInitials(user?.name || 'Farmer')}
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">{t('login')}</Link>
              <Link to="/register" className="btn btn-secondary btn-sm">{t('register')}</Link>
              <Link to="/dashboard" className="btn btn-primary btn-sm">{t('explorePlatform')}</Link>
            </>
          )}
        </div>

        {/* Mobile Actions: Language Selector + Profile + Hamburger Button */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LanguageSelector variant="compact" />

          {token && (
            <button
              onClick={openProfileModal}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-600)',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.82rem',
                border: '2px solid #ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Profile"
            >
              {getInitials(user?.name || 'Farmer')}
            </button>
          )}

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
            <Link to="/dashboard" className="mobile-drawer-link" onClick={closeMenu}>
              📊 {t('dashboard')}
            </Link>
            <a href="/#features" className="mobile-drawer-link" onClick={closeMenu}>
              ✨ {t('features')}
            </a>
            <a href="/#how-it-works" className="mobile-drawer-link" onClick={closeMenu}>
              🔄 {t('howItWorks')}
            </a>
          </div>

          <div className="mobile-drawer-actions">
            {token ? (
              <>
                <button
                  onClick={() => { closeMenu(); openProfileModal(); }}
                  className="btn btn-secondary btn-block"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  👤 View Profile ({user?.name || 'Farmer'})
                </button>
                <Link to="/dashboard" className="btn btn-primary btn-block" onClick={closeMenu}>
                  {t('dashboard')}
                </Link>
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
