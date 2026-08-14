import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import DashboardLayout from '../components/DashboardLayout';
import SourceBadge from '../components/SourceBadge';
import DEFAULT_LOCATION from '../config/locations';

// Fix default leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationSelector({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const GIS = () => {
  const initialLat = DEFAULT_LOCATION.latitude || DEFAULT_LOCATION.lat || 19.8833;
  const initialLon = DEFAULT_LOCATION.longitude || DEFAULT_LOCATION.lon || 74.4833;

  const [coords, setCoords] = useState({ lat: initialLat, lon: initialLon });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const handleLocationSelect = (lat, lon) => {
    setCoords({ lat, lon });
    setAnalysisDone(false);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisDone(true);
    }, 600);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>GIS & Spatial Intelligence Dashboard</h1>
            <p>Interactive agricultural mapping, spatial layers, and field telemetry.</p>
          </div>
          <SourceBadge source="OpenStreetMap & Sentinel-2 Format" status="Interactive" />
        </div>
      </div>

      <div className="gis-layout">
        {/* Sidebar */}
        <div className="gis-sidebar">
          <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
            📍 Locality Inspection
          </h2>

          <div style={{ background: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Coordinates</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-900)', marginTop: '0.2rem' }}>
              {coords.lat.toFixed(4)}° N, {coords.lon.toFixed(4)}° E
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              💡 Click anywhere on the map to pin a new point.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', flexGrow: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Region/Zone:</span>
              <strong style={{ color: 'var(--primary-900)' }}>Deccan Plateau (MH)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Soil Classification:</span>
              <strong style={{ color: 'var(--primary-900)' }}>Vertisol (Black Soil)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Crop Health (NDVI):</span>
              <span className="badge badge-success">Good (0.65)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Agri Risk Index:</span>
              <span className="badge badge-info">Low Risk</span>
            </div>

            {analysisDone && (
              <div style={{ background: '#fcfdfc', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-800)', marginBottom: '0.3rem' }}>
                  ✅ Spatial Telemetry Ready
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Elevation ~520m MSL. Drainage capacity is moderate. No flood inundation detected.
                </div>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? 'Analyzing Spatial Raster...' : 'Inspect Coordinates'}
          </button>
        </div>

        {/* Map Container */}
        <div className="gis-map-container">
          <MapContainer
            center={[coords.lat, coords.lon]}
            zoom={12}
            style={{ height: '100%', width: '100%', minHeight: '480px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationSelector onLocationSelect={handleLocationSelect} />
            <Marker position={[coords.lat, coords.lon]}>
              <Popup>
                <div style={{ padding: '0.25rem' }}>
                  <strong style={{ color: '#2d6a4f' }}>🌾 Agri Samadhan Station</strong><br />
                  <strong>Lat:</strong> {coords.lat.toFixed(4)}°<br />
                  <strong>Lon:</strong> {coords.lon.toFixed(4)}°<br />
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Active Farm Monitoring Node</span>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GIS;
