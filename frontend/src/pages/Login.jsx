import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authService from '../services/authService';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('farmer@krishisamadhan.in');
  const [password, setPassword] = useState('farmer123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authService.login(email, password);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        setSuccess('Login successful! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 600);
      } else {
        setError('Unable to authenticate with the server. Please verify credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'farmer') {
      setEmail('farmer@krishisamadhan.in');
      setPassword('farmer123');
    } else {
      setEmail('admin@krishisamadhan.in');
      setPassword('admin123');
    }
    setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.25rem', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <img
              src="/logo.png"
              alt="Krishi Samadhan Logo"
              style={{ width: '68px', height: '68px', objectFit: 'contain', borderRadius: '50%', marginBottom: '0.75rem' }}
            />
            <h1 style={{ fontSize: '1.65rem', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
              {t('brandName')} Portal
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Sign in to access personalized agricultural advisories
            </p>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
            <div style={{ fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>⚡ Quick Demo Accounts:</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => fillDemoCredentials('farmer')}
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              >
                🌾 Demo Farmer (Ramesh)
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => fillDemoCredentials('authority')}
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              >
                🏛️ Extension Officer
              </button>
            </div>
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

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={loading}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? 'Authenticating with Database...' : `${t('login')} →`}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
            <span>Don't have an account? </span>
            <Link to="/register" style={{ fontWeight: '700', color: 'var(--primary-700)' }}>
              {t('register')} Here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
