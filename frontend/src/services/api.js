function getBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // Localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    // Accessing over local Wi-Fi from another device (e.g. mobile phone, tablet)
    if (window.location.port === '5173' || window.location.port === '3000') {
      return `http://${hostname}:5000/api`;
    }
    // Production deployed domain
    return `${window.location.origin}/api`;
  }

  return 'http://localhost:5000/api';
}

function buildUrl(endpoint, params = {}) {
  const base = getBaseUrl().replace(/\/+$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${base}${path}`;

  let url;
  try {
    url = new URL(fullUrl);
  } catch {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000';
    url = new URL(fullUrl, origin);
  }

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) {
      url.searchParams.set(k, v);
    }
  });

  return url.toString();
}

const api = {
  async get(endpoint, params = {}) {
    const requestUrl = buildUrl(endpoint, params);
    const token = localStorage.getItem('token');
    const headers = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(requestUrl, { headers });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || `Request failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`API GET error at ${endpoint}:`, err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error(`Cannot reach backend server. Please verify backend is running on ${getBaseUrl()}`);
      }
      throw err;
    }
  },

  async post(endpoint, body, isFormData = false) {
    const requestUrl = buildUrl(endpoint);
    const token = localStorage.getItem('token');
    const headers = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';

    try {
      const res = await fetch(requestUrl, {
        method: 'POST',
        headers,
        body: isFormData ? body : JSON.stringify(body)
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API POST error at ${endpoint}:`, err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error(`Cannot reach backend server. Please verify backend is running on ${getBaseUrl()}`);
      }
      throw err;
    }
  }
};

export default api;
