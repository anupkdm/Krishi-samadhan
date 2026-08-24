import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardSidebar({ isOpen, toggleSidebar }) {
  const { t } = useLanguage();

  const navItems = [
    { to: "/dashboard", icon: "📊", labelKey: "overview", exact: true },
    { to: "/dashboard/gis", icon: "🗺️", labelKey: "gisDashboard" },
    { to: "/dashboard/weather", icon: "🌤️", labelKey: "weatherMonitoring" },
    { to: "/dashboard/satellite", icon: "🛰️", labelKey: "satelliteMonitoring" },
    { to: "/dashboard/soil", icon: "🌱", labelKey: "soilHealth" },
    { to: "/dashboard/pest", icon: "🐛", labelKey: "pestSurveillance" },
    { to: "/dashboard/schemes", icon: "🏛️", labelKey: "govSchemes" },
    { to: "/dashboard/market", icon: "💰", labelKey: "marketIntelligence" },
    { to: "/dashboard/advisory", icon: "📋", labelKey: "farmerAdvisory" },
  ];

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-900)', textDecoration: 'none', flexGrow: 1, minWidth: 0 }}
        >
          <img
            src="/logo.png"
            alt="Agri Samadhan Logo"
            style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '50%', flexShrink: 0 }}
          />
          <span style={{ fontWeight: '800', fontSize: '1.15rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            {t('brandName')}
          </span>
        </Link>

        {/* Menu Toggle Button in Top Corner of Sidebar */}
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Slide Menu In/Out"
          title="Slide Menu In / Out"
        >
          <span style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☰</span>
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={toggleSidebar}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem', padding: '0 0.5rem' }}>
          📍 {t('locality')}: <strong>19.88°N, 74.48°E</strong>
        </div>
        <Link to="/" className="btn btn-secondary btn-sm btn-block" style={{ marginBottom: '0.5rem' }} onClick={toggleSidebar}>
          🏠 {t('backToHome')}
        </Link>
        <button
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
          className="btn btn-outline btn-sm btn-block"
        >
          🔒 {t('logout')}
        </button>
      </div>
    </aside>
  );
}
