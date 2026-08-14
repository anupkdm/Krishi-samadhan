import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authService from '../services/authService';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [location, setLocation] = useState('Sangamner');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const localities = ['Sangamner', 'Nashik', 'Kopargaon', 'Sinnar', 'Shirdi', 'Rahata', 'Yeola', 'Pune', 'Ahmednagar'];

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
      const response = await authService.register(name, email, password, role, `${location}, Maharashtra`);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        setSuccess('Account created successfully! Entering dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 600);
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2.25rem', boxShadow: 'var(--shadow-lg)' }}>
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
                <label className="form-label">Primary Locality</label>
                <select
                  className="form-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                >
                  {localities.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

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
