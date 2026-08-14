import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileModal() {
  const { user, activeLocation, isProfileModalOpen, closeProfileModal, logoutUser, changeActiveLocation, availableLocations } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!isProfileModalOpen) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    closeProfileModal();
    navigate(path);
  };

  const getInitials = (name) => {
    if (!name) return 'K';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={closeProfileModal}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '460px',
          overflow: 'hidden',
          animation: 'slideUp 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%)',
            padding: '1.5rem',
            color: '#ffffff',
            position: 'relative'
          }}
        >
          <button
            onClick={closeProfileModal}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close Profile"
          >
            ✕
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-800)',
                fontSize: '1.5rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                border: '2px solid #ffffff'
              }}
            >
              {getInitials(user?.name || 'Farmer')}
            </div>

            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                {user?.name || 'Registered Farmer'}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                {user?.email || 'farmer@krishisamadhan.in'}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '0.35rem',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: 'rgba(255, 255, 255, 0.25)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px'
                }}
              >
                ● {user?.role || 'Farmer'} Account
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Active Location Switcher */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
              📍 Active Farm Location & Region
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                className="form-select"
                value={Object.keys(availableLocations).find(k => availableLocations[k].name === activeLocation.name) || 'Sangamner'}
                onChange={(e) => changeActiveLocation(e.target.value)}
                style={{ fontWeight: '600', color: 'var(--primary-900)' }}
              >
                {Object.keys(availableLocations).map(key => (
                  <option key={key} value={key}>
                    {availableLocations[key].name} ({availableLocations[key].district})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Telemetry Details */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Coordinates:</span>
                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{activeLocation.latitude}°N, {activeLocation.longitude}°E</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Primary APMC:</span>
                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{activeLocation.apmcMandi || 'Local APMC'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Soil Type:</span>
                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{activeLocation.soilType || 'Vertisol'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Key Crops:</span>
                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{activeLocation.primaryCrops?.slice(0, 2).join(', ') || 'Onion, Wheat'}</div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              ⚡ Quick Services for {activeLocation.district || 'Your Area'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                onClick={() => handleNavigate('/dashboard/weather')}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'center', fontSize: '0.82rem' }}
              >
                🌦️ Live Weather
              </button>
              <button
                onClick={() => handleNavigate('/dashboard/market')}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'center', fontSize: '0.82rem' }}
              >
                💰 Mandi Rates
              </button>
              <button
                onClick={() => handleNavigate('/dashboard/soil')}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'center', fontSize: '0.82rem' }}
              >
                🌱 Soil Health
              </button>
              <button
                onClick={() => handleNavigate('/dashboard/advisory')}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'center', fontSize: '0.82rem' }}
              >
                📋 Farm Advisories
              </button>
            </div>
          </div>

          {/* Footer / Logout */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <button
              onClick={handleLogout}
              className="btn btn-sm"
              style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', fontWeight: '700' }}
            >
              🚪 Sign Out
            </button>

            <button
              onClick={closeProfileModal}
              className="btn btn-primary btn-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
