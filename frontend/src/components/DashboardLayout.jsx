import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const { user, activeLocation, openProfileModal } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const getInitials = (name) => {
    if (!name) return 'K';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Persistent / Off-canvas Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} toggleSidebar={closeSidebar} />

      {/* Main Content Area */}
      <div className="dashboard-main-wrapper">
        {/* Desktop / Tablet Top Action Header (Hidden on Mobile) */}
        <header
          className="dashboard-top-bar desktop-only"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0.75rem 2.5rem 0',
            background: 'transparent',
            gap: '1.25rem'
          }}
        >
          {/* Active Location Badge */}
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
            title="Click to view farm location or switch region"
          >
            <span>📍</span>
            <span>{activeLocation.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary-600)', opacity: 0.8 }}>▼</span>
          </button>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LanguageSelector />
          </div>

          {/* User Profile Avatar Button */}
          <button
            onClick={openProfileModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: '24px',
              padding: '0.3rem 0.75rem 0.3rem 0.3rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease'
            }}
            title="View Account Profile"
            aria-label="User Profile"
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-600)',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {getInitials(user?.name || 'Farmer')}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.1 }}>
                {user?.name || 'Farmer'}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user?.role || 'Farmer'}
              </span>
            </div>
          </button>
        </header>

        {/* Mobile Top App Bar (Only on Mobile screens) */}
        <header className="dashboard-mobile-header mobile-only">
          <button
            className="mobile-header-menu-btn"
            onClick={toggleSidebar}
            aria-label="Open Navigation Menu"
          >
            ☰
          </button>

          <Link to="/" className="mobile-header-brand">
            <img
              src="/logo.png"
              alt="Krishi Samadhan"
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'contain' }}
            />
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--primary-900)' }}>
              {t('brandName')}
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LanguageSelector variant="compact" />

            {/* Mobile Profile Icon */}
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
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Open User Profile"
              title="Open Profile"
            >
              {getInitials(user?.name || 'Farmer')}
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
