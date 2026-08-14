export const DEFAULT_LOCATION = {
  name: "Maharashtra Agricultural Zone (Nashik / Ahmednagar)",
  latitude: 19.8833,
  longitude: 74.4833,
  lat: 19.8833,
  lon: 74.4833
};

const getApiBaseUrl = () => {
  // If explicitly configured in environment (e.g. Vercel, Render)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // When running in a browser
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // If opened on localhost / 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    // If opened on another device via Local IP (e.g. 192.168.x.x, 172.x.x.x, or 10.x.x.x on mobile)
    if (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '5000') {
      return `http://${hostname}:5000/api`;
    }
    // If deployed on cloud without explicit VITE_API_URL
    return '/api';
  }

  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export default DEFAULT_LOCATION;
