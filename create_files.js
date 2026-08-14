const fs = require('fs');
const path = require('path');

const baseDir = "C:\\Users\\anupk\\.gemini\\antigravity\\scratch\\agri-samadhan\\frontend\\src";

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(path.join(baseDir, "config"));
ensureDir(path.join(baseDir, "components"));
ensureDir(path.join(baseDir, "services"));

const files = {
  "config/locations.js": `export const DEFAULT_LOCATION = {
  name: 'My Locality',
  latitude: 19.8833,
  longitude: 74.4833
};

export const API_BASE_URL = 'http://localhost:5000/api';
`,
  "index.css": `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-green: #2d6a4f;
  --primary-light: #40916c;
  --accent-green: #52b788;
  --light-green: #74c69d;
  --pale-green: #b7e4c7;
  --very-pale: #d8f3dc;
  --bg-color: #f8f9fa;
  --white: #ffffff;
  --text-dark: #1a1a2e;
  --text-secondary: #555555;
  --text-muted: #888888;
  --border-color: #e0e0e0;
  --error: #e63946;
  --warning: #f4a261;
  --success: #2d6a4f;
  --info: #457b9d;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-dark);
  font-size: 16px;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  margin-bottom: 0.5em;
  color: var(--text-dark);
}

p { margin-bottom: 1rem; }
a { text-decoration: none; color: var(--primary-green); }

.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.page-container { padding: 2rem 0; }
.section { padding: 4rem 0; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.btn-primary { background: var(--primary-green); color: var(--white); }
.btn-primary:hover { background: var(--primary-light); transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.btn-secondary { background: var(--white); color: var(--text-dark); border-color: var(--border-color); }
.btn-secondary:hover { background: var(--bg-color); }
.btn-outline { background: transparent; color: var(--primary-green); border-color: var(--primary-green); }
.btn-outline:hover { background: var(--very-pale); }
.btn-danger { background: var(--error); color: var(--white); }
.btn-sm { padding: 0.25rem 0.5rem; font-size: 0.875rem; }
.btn-lg { padding: 0.75rem 1.5rem; font-size: 1.125rem; }

.card {
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
.card-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); font-weight: 600; }
.card-body { padding: 1.5rem; }
.card-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--border-color); background: var(--bg-color); }

.form-group { margin-bottom: 1rem; }
.form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-secondary); }
.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 2px var(--pale-green);
}
.form-error { color: var(--error); font-size: 0.875rem; margin-top: 0.25rem; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
.data-table th { background: var(--bg-color); font-weight: 600; color: var(--text-secondary); }
.data-table tr.striped:nth-child(even) { background: var(--very-pale); }
.data-table tr:hover { background: var(--bg-color); }

.grid { display: grid; gap: 1.5rem; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

.flex { display: flex; }
.flex-between { justify-content: space-between; }
.flex-center { justify-content: center; align-items: center; }
.flex-gap { gap: 1rem; }

.metric-card { display: flex; align-items: center; padding: 1.5rem; background: var(--white); border-radius: 8px; border: 1px solid var(--border-color); }
.metric-icon { font-size: 2rem; margin-right: 1rem; }
.metric-label { font-size: 0.875rem; color: var(--text-secondary); }
.metric-value { font-size: 1.5rem; font-weight: 700; color: var(--text-dark); }

.alert-card { padding: 1rem; border-radius: 8px; border-left: 4px solid; background: var(--white); margin-bottom: 1rem; }
.alert-high { border-left-color: var(--error); }
.alert-medium { border-left-color: var(--warning); }
.alert-low { border-left-color: var(--success); }

.badge { padding: 0.25rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
.badge-success { background: var(--very-pale); color: var(--success); }
.badge-warning { background: #ffedd5; color: var(--warning); }
.badge-danger { background: #ffe4e6; color: var(--error); }
.badge-info { background: #e0f2fe; color: var(--info); }
.badge-neutral { background: var(--border-color); color: var(--text-secondary); }
.source-badge { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: var(--text-muted); }

.loading-container, .error-container, .empty-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; text-align: center; }
.spinner { border: 4px solid var(--border-color); border-top: 4px solid var(--primary-green); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.navbar { position: sticky; top: 0; background: var(--white); z-index: 1000; box-shadow: 0 2px 4px rgba(0,0,0,0.05); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
.navbar-brand { font-size: 1.5rem; font-weight: 700; color: var(--primary-green); }
.navbar-links { display: flex; gap: 1.5rem; }
.navbar-link { color: var(--text-dark); font-weight: 500; }
.navbar-link:hover { color: var(--primary-green); }
.navbar-actions { display: flex; gap: 1rem; }

.dashboard-layout { display: flex; min-height: 100vh; }
.dashboard-sidebar { width: 260px; background: var(--white); border-right: 1px solid var(--border-color); position: fixed; height: 100vh; overflow-y: auto; padding: 1rem; }
.sidebar-nav { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 2rem; }
.sidebar-link { padding: 0.75rem 1rem; border-radius: 4px; color: var(--text-dark); display: flex; align-items: center; gap: 0.75rem; transition: background 0.2s; }
.sidebar-link:hover { background: var(--very-pale); }
.sidebar-link.active { background: var(--primary-green); color: var(--white); }
.dashboard-content { margin-left: 260px; flex: 1; padding: 2rem; }

.hero { padding: 6rem 2rem; text-align: center; background: linear-gradient(135deg, var(--very-pale) 0%, var(--white) 100%); }
.hero-title { font-size: 3rem; color: var(--primary-green); margin-bottom: 1rem; }
.hero-subtitle { font-size: 1.25rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem; }
.hero-actions { display: flex; gap: 1rem; justify-content: center; }

.footer { background: var(--white); padding: 4rem 2rem 2rem; border-top: 1px solid var(--border-color); margin-top: auto; }
.footer-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.footer-brand { font-size: 1.5rem; font-weight: 700; color: var(--primary-green); }
.footer-links { display: flex; flex-direction: column; gap: 0.5rem; }

.fade-in { animation: fadeIn 0.5s ease forwards; }
.slide-up { animation: slideUp 0.5s ease forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

@media (max-width: 1200px) { .grid-4 { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 992px) {
  .dashboard-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 1001; }
  .dashboard-sidebar.open { transform: translateX(0); }
  .dashboard-content { margin-left: 0; }
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .grid-2 { grid-template-columns: 1fr; }
  .navbar-links { display: none; }
}
@media (max-width: 576px) {
  html { font-size: 14px; }
  .dashboard-content { padding: 1rem; }
}
`,
  "components/Navbar.jsx": `import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🌾 Agri Samadhan</Link>
      <div className={\`navbar-links \${isOpen ? 'mobile-open' : ''}\`}>
        <NavLink to="/#features" className="navbar-link">Features</NavLink>
        <NavLink to="/#how-it-works" className="navbar-link">How It Works</NavLink>
      </div>
      <div className="navbar-actions">
        {token ? (
          <>
            <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
            <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }} className="btn btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/dashboard" className="btn btn-primary">Explore Platform</Link>
          </>
        )}
      </div>
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>☰</button>
    </nav>
  );
}
`,
  "components/DashboardSidebar.jsx": `import React from 'react';
import { NavLink } from 'react-router-dom';

export default function DashboardSidebar({ isOpen, toggleSidebar }) {
  const navItems = [
    { to: "/dashboard", icon: "📊", label: "Overview", exact: true },
    { to: "/dashboard/gis", icon: "🗺️", label: "GIS Dashboard" },
    { to: "/dashboard/weather", icon: "🌤️", label: "Weather" },
    { to: "/dashboard/satellite", icon: "🛰️", label: "Satellite" },
    { to: "/dashboard/soil", icon: "🌱", label: "Soil Health" },
    { to: "/dashboard/pest", icon: "🐛", label: "Pest Detection" },
    { to: "/dashboard/schemes", icon: "🏛️", label: "Schemes" },
    { to: "/dashboard/market", icon: "💰", label: "Market" },
    { to: "/dashboard/advisory", icon: "📋", label: "Advisory" },
  ];

  return (
    <aside className={\`dashboard-sidebar \${isOpen ? 'open' : ''}\`}>
      <div className="sidebar-header flex flex-between">
        <span className="navbar-brand">🌾 Agri Samadhan</span>
        <button className="mobile-close" onClick={toggleSidebar}>✕</button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.exact} className={({isActive}) => \`sidebar-link \${isActive ? 'active' : ''}\`}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href='/'; }} className="btn btn-outline" style={{width: '100%'}}>Logout</button>
      </div>
    </aside>
  );
}
`,
  "components/DashboardLayout.jsx": `import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <DashboardSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className="dashboard-content">
        <button className="mobile-menu-toggle btn btn-outline" style={{marginBottom: '1rem'}} onClick={() => setSidebarOpen(true)}>☰ Menu</button>
        {children}
      </main>
    </div>
  );
}
`,
  "components/MetricCard.jsx": `import React from 'react';

export default function MetricCard({ title, value, unit, icon, trend }) {
  return (
    <div className="metric-card card fade-in">
      <div className="metric-icon">{icon}</div>
      <div>
        <div className="metric-label">{title}</div>
        <div className="metric-value">
          {value} {unit && <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>{unit}</span>}
          {trend === 'up' && <span style={{color: 'var(--success)', marginLeft: '0.5rem', fontSize: '1rem'}}>↑</span>}
          {trend === 'down' && <span style={{color: 'var(--error)', marginLeft: '0.5rem', fontSize: '1rem'}}>↓</span>}
          {trend === 'stable' && <span style={{color: 'var(--info)', marginLeft: '0.5rem', fontSize: '1rem'}}>→</span>}
        </div>
      </div>
    </div>
  );
}
`,
  "components/AlertCard.jsx": `import React from 'react';

export default function AlertCard({ type, priority, title, description, action, source }) {
  return (
    <div className={\`alert-card alert-\${priority} slide-up\`}>
      <div className="flex flex-between" style={{marginBottom: '0.5rem'}}>
        <span className={\`badge badge-\${priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'success'}\`}>{type}</span>
        {source && <span className="source-badge">Source: {source}</span>}
      </div>
      <h4 style={{margin: '0.25rem 0'}}>{title}</h4>
      <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>{description}</p>
      {action && <button className={\`btn btn-sm btn-\${priority === 'high' ? 'danger' : 'outline'}\`}>{action}</button>}
    </div>
  );
}
`,
  "components/DataTable.jsx": `import React from 'react';
import EmptyState from './EmptyState';

export default function DataTable({ columns, data, emptyMessage }) {
  if (!data || data.length === 0) return <EmptyState message={emptyMessage} />;
  
  return (
    <div style={{overflowX: 'auto'}}>
      <table className="data-table card">
        <thead>
          <tr>
            {columns.map((col, i) => <th key={i}>{col.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="striped fade-in" style={{animationDelay: \`\${i * 0.05}s\`}}>
              {columns.map((col, j) => (
                <td key={j}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`,
  "components/LoadingState.jsx": `import React from 'react';

export default function LoadingState({ message = 'Loading agricultural data...' }) {
  return (
    <div className="loading-container fade-in">
      <div className="spinner"></div>
      <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>{message}</p>
    </div>
  );
}
`,
  "components/ErrorState.jsx": `import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-container slide-up">
      <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⚠️</div>
      <h3 style={{color: 'var(--error)'}}>Something went wrong</h3>
      <p style={{color: 'var(--text-secondary)'}}>{message}</p>
      {onRetry && <button className="btn btn-outline" onClick={onRetry} style={{marginTop: '1rem'}}>Try Again</button>}
    </div>
  );
}
`,
  "components/EmptyState.jsx": `import React from 'react';

export default function EmptyState({ message = 'No records available for the selected filters.', icon = '📭' }) {
  return (
    <div className="empty-container fade-in card">
      <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{icon}</div>
      <p style={{color: 'var(--text-secondary)'}}>{message}</p>
    </div>
  );
}
`,
  "components/SourceBadge.jsx": `import React from 'react';

export default function SourceBadge({ source, status, date }) {
  const statusColors = {
    'Live': 'var(--success)',
    'Latest Available': 'var(--info)',
    'Demonstration': 'var(--warning)',
    'Unavailable': 'var(--error)'
  };
  
  return (
    <div className="source-badge">
      <span style={{
        display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', 
        backgroundColor: statusColors[status] || 'var(--text-muted)'
      }}></span>
      <span>{source}</span>
      {date && <span>• {date}</span>}
    </div>
  );
}
`,
  "components/Footer.jsx": `import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <div className="footer-brand">🌾 Agri Samadhan</div>
          <p style={{color: 'var(--text-secondary)', marginTop: '1rem'}}>Smarter Decisions. Better Agriculture.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/dashboard/weather">Weather</Link>
            <Link to="/dashboard/market">Market</Link>
            <Link to="/dashboard/advisory">Advisory</Link>
            <Link to="/dashboard/schemes">Government Schemes</Link>
          </div>
        </div>
        <div>
          <h4>Disclaimer</h4>
          <p style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>
            Agricultural data is sourced from public APIs. Verify critical information before making major decisions.
          </p>
          <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem'}}>
            © {new Date().getFullYear()} Agri Samadhan
          </p>
        </div>
      </div>
    </footer>
  );
}
`,
  "services/api.js": `import { API_BASE_URL } from '../config/locations';

const api = {
  async get(endpoint, params = {}) {
    const url = new URL(\`\${API_BASE_URL}\${endpoint}\`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, v);
    });
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = \`Bearer \${token}\`;
    const res = await fetch(url.toString(), { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || \`Request failed: \${res.status}\`);
    }
    return res.json();
  },
  async post(endpoint, body, isFormData = false) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = \`Bearer \${token}\`;
    if (!isFormData) headers['Content-Type'] = 'application/json';
    const res = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || \`Request failed: \${res.status}\`);
    }
    return res.json();
  }
};
export default api;
`,
  "services/authService.js": `import api from './api';

export const register = (name, email, password, role) => api.post('/auth/register', { name, email, password, role });
export const login = (email, password) => api.post('/auth/login', { email, password });
export const getProfile = () => api.get('/auth/profile');
export const logout = () => localStorage.removeItem('token');
export const isAuthenticated = () => !!localStorage.getItem('token');
export const getToken = () => localStorage.getItem('token');
`,
  "services/weatherService.js": `import api from './api';

export const getCurrentWeather = (lat, lon) => api.get('/weather/current', { lat, lon });
export const getForecast = (lat, lon) => api.get('/weather/forecast', { lat, lon });
`,
  "services/marketService.js": `import api from './api';

export const getPrices = (params) => api.get('/market/prices', params);
export const comparePrices = (params) => api.get('/market/compare', params);
export const getTrends = (params) => api.get('/market/trends', params);
`,
  "services/soilService.js": `import api from './api';

export const getSoilData = (lat, lon) => api.get('/soil', { lat, lon });
`,
  "services/satelliteService.js": `import api from './api';

export const getSatelliteData = (lat, lon) => api.get('/satellite', { lat, lon });
`,
  "services/pestService.js": `import api from './api';

export const analyzePest = (imageFile, crop) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (crop) formData.append('crop', crop);
  return api.post('/pest/analyze', formData, true);
};
`,
  "services/schemesService.js": `import api from './api';

export const getSchemes = (search, category) => api.get('/schemes', { search, category });
export const getSchemeById = (id) => api.get(\`/schemes/\${id}\`);
`,
  "services/advisoryService.js": `import api from './api';

export const getAdvisories = (lat, lon) => api.get('/advisories', { lat, lon });
export const generateAdvisories = (lat, lon) => api.post('/advisories/generate', { lat, lon });
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, filePath);
  const dirPath = path.dirname(fullPath);
  ensureDir(dirPath);
  fs.writeFileSync(fullPath, content, 'utf8');
}

console.log("All files created successfully.");
