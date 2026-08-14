import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

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
        <header className="dashboard-top-bar desktop-only" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0.75rem 2.5rem 0', background: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)' }}>🌐 Language:</span>
            <LanguageSelector />
          </div>
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

          <LanguageSelector variant="compact" />
        </header>

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
