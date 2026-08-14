import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authService from '../services/authService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { AVAILABLE_LOCATIONS } from '../config/locations';

const Register = () => {
  const { t } = useLanguage();
  const { loginUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [locationKey, setLocationKey] = useState('Sangamner');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const selectedLocObj = AVAILABLE_LOCATIONS[locationKey];
      const locationString = `${locationKey}, Maharashtra`;

      const response = await authService.register(name, email, password, role, locationString);
      if (response && response.token) {
        const userData = response.user || {
          name,
          email,
          role,
          location: locationString
        };

        loginUser(response.token, userData);
        setSuccess('Account created successfully! Entering personalized farm dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedLocData = AVAILABLE_LOCATIONS[locationKey];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '2.25rem', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <img
              src="/logo.png"
              alt="Krishi Samadhan Logo"
              style={{ width: '68px', height: '68px', objectFit: 'contain', borderRadius: '50%', marginBottom: '0.75rem' }}
            />
            <h1 style={{ fontSize: '1.65rem', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
              Create Farmer Account
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Join the unified {t('brandName')} agricultural intelligence network
            </p>
          </div>

          {error && (
            <div style={{ background: 'var(--error-bg)', color: 'var(--error)', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid #bbf7d0', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@example.com"
                disabled={loading}
              />
            </div>

            {/* Role & Location Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">User Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                >
                  <option value="farmer">Farmer / Grower</option>
                  <option value="authority">Extension Officer</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">📍 Farm Location / Taluka</label>
                <select
                  className="form-select"
                  value={locationKey}
                  onChange={(e) => setLocationKey(e.target.value)}
                  disabled={loading}
                >
                  {Object.keys(AVAILABLE_LOCATIONS).map(loc => (
                    <option key={loc} value={loc}>
                      {loc} ({AVAILABLE_LOCATIONS[loc].district})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Location Preview Badge */}
            {selectedLocData && (
              <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--primary-900)' }}>
                📍 <strong>Selected Area:</strong> {selectedLocData.name} ({selectedLocData.latitude}°N, {selectedLocData.longitude}°E)
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Soil: {selectedLocData.soilType} | Mandi: {selectedLocData.apmcMandi}
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <label className="form-label">Password (min 6 chars)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  style={{ paddingRight: '42px' }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: 'var(--text-muted)'
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Creating Account in Database...' : 'Register & Enter Dashboard →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
            <span>Already have an account? </span>
            <Link to="/login" style={{ fontWeight: '700', color: 'var(--primary-700)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
