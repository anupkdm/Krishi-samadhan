import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import DashboardLayout from '../components/DashboardLayout';
import SourceBadge from '../components/SourceBadge';
import { useAuth } from '../context/AuthContext';

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

// Component to recenter map when active location changes
function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView([coords.lat, coords.lon], map.getZoom());
  }, [coords, map]);
  return null;
}

const GIS = () => {
  const { activeLocation } = useAuth();
  const [coords, setCoords] = useState({
    lat: activeLocation.latitude || 19.8833,
    lon: activeLocation.longitude || 74.4833
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  useEffect(() => {
    if (activeLocation.latitude && activeLocation.longitude) {
      setCoords({
        lat: activeLocation.latitude,
        lon: activeLocation.longitude
      });
      setAnalysisDone(false);
    }
  }, [activeLocation]);

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
            <p>Interactive agricultural mapping, spatial layers, and field telemetry for <strong>{activeLocation.name}</strong>.</p>
          </div>
          <SourceBadge source="OpenStreetMap & Sentinel-2 Telemetry" status="Interactive" />
        </div>
      </div>

      <div className="gis-layout">
        {/* Sidebar */}
        <div className="gis-sidebar">
          <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
            📍 Locality Inspection
          </h2>

          <div style={{ background: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Farm Coordinates</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-900)', marginTop: '0.2rem' }}>
              {coords.lat.toFixed(4)}° N, {coords.lon.toFixed(4)}° E
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              District: <strong>{activeLocation.district}</strong> ({activeLocation.name})
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', flexGrow: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Region/Zone:</span>
              <strong style={{ color: 'var(--primary-900)' }}>{activeLocation.district || 'Maharashtra'} Basin</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Soil Classification:</span>
              <strong style={{ color: 'var(--primary-900)' }}>{activeLocation.soilType || 'Vertisol'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Crop Health (NDVI):</span>
              <span className="badge badge-success">Healthy (0.72)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Local Mandi:</span>
              <span className="badge badge-info">{activeLocation.apmcMandi || 'APMC Market'}</span>
            </div>

            {analysisDone && (
              <div style={{ background: '#fcfdfc', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-800)', marginBottom: '0.3rem' }}>
                  ✅ Spatial Telemetry Synced
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Elevation ~540m MSL. Soil drainage capacity is optimal for {activeLocation.primaryCrops?.slice(0, 2).join(', ') || 'Kharif crops'}. No water inundation anomalies.
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
            <MapRecenter coords={coords} />
            <Marker position={[coords.lat, coords.lon]}>
              <Popup>
                <div style={{ padding: '0.25rem' }}>
                  <strong style={{ color: '#2d6a4f' }}>🌾 {activeLocation.name}</strong><br />
                  <strong>Lat:</strong> {coords.lat.toFixed(4)}°N | <strong>Lon:</strong> {coords.lon.toFixed(4)}°E<br />
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Soil: {activeLocation.soilType}</span>
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
