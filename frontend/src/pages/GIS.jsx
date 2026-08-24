import React, { useState, useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  Circle,
  Tooltip,
  useMapEvents,
  useMap
} from 'react-leaflet';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import gisService from '../services/gisService';
import { AVAILABLE_LOCATIONS } from '../config/locations';

// Fix default leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom DivIcons for map features
const createCustomIcon = (emoji, label, bg = '#ffffff', borderColor = '#2d6a4f') => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="
        background: ${bg};
        border: 2px solid ${borderColor};
        border-radius: 20px;
        padding: 2px 8px;
        font-size: 11px;
        font-weight: 700;
        color: #1f2937;
        box-shadow: 0 3px 6px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        transform: translate(-50%, -50%);
      ">
        <span>${emoji}</span>
        <span>${label}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// Component to handle map clicks & inspection
function MapClickHandler({ onCoordinateClick }) {
  useMapEvents({
    click(e) {
      onCoordinateClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Recenter Map on location change
function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView([coords.lat, coords.lon], 14, { animate: true });
  }, [coords, map]);
  return null;
}

const TILE_PROVIDERS = {
  satellite: {
    name: '🛰️ Satellite Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  osm: {
    name: '🗺️ Standard Street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  topo: {
    name: '🏔️ Topographic',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
  },
  dark: {
    name: '🌙 Dark Terrain',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
  }
};

const GIS = () => {
  const { activeLocation, setCustomLocation } = useAuth();
  const { language } = useLanguage();

  const [coords, setCoords] = useState({
    lat: activeLocation.latitude || 19.5772,
    lon: activeLocation.longitude || 74.2173
  });

  const [gisData, setGisData] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [activeBaseMap, setActiveBaseMap] = useState('satellite');

  // Layer Toggles matching the GIS requirements
  const [layers, setLayers] = useState({
    farmBoundaries: true,     // 🟩 Farm boundaries
    cropType: true,           // 🌱 Crop type
    irrigation: true,         // 💧 Irrigation/water availability
    rainfall: true,           // 🌧 Rainfall radar
    temperature: false,       // 🌡 Temperature
    soilHealth: true,         // 🟤 Soil health
    satelliteCropHealth: true,// 🛰 Satellite crop-health (NDVI)
    pestRiskZones: true,      // 🐛 Pest/disease risk zones
    farmerLocation: true,     // 📍 Farmer & Sensor location
    mandiLocations: true,     // 💰 Nearby market locations
    govtSchemes: false        // 🏛 Government schemes
  });

  // Filters
  const [cropFilter, setCropFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  // Modals
  const [showArchModal, setShowArchModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync coords on location change
  useEffect(() => {
    if (activeLocation.latitude && activeLocation.longitude) {
      setCoords({
        lat: activeLocation.latitude,
        lon: activeLocation.longitude
      });
    }
  }, [activeLocation]);

  // Load GIS Spatial Data
  const loadGisData = async () => {
    try {
      const data = await gisService.getGisData(coords.lat, coords.lon);
      setGisData(data);
      if (data.farmPlots && data.farmPlots.length > 0) {
        setSelectedPlot(data.farmPlots[0]);
      }
    } catch (err) {
      console.error('Error fetching GIS data:', err);
    }
  };

  useEffect(() => {
    loadGisData();
  }, [coords]);

  // Handle Layer Toggle
  const toggleLayer = (key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filtered Farm Plots
  const filteredPlots = useMemo(() => {
    if (!gisData?.farmPlots) return [];
    return gisData.farmPlots.filter((plot) => {
      const matchCrop = cropFilter === 'All' || plot.crop.toLowerCase().includes(cropFilter.toLowerCase());
      const matchRisk = riskFilter === 'All' || plot.pestRisk === riskFilter || (riskFilter === 'High' && plot.soilMoisturePercent < 25);
      return matchCrop && matchRisk;
    });
  }, [gisData, cropFilter, riskFilter]);

  // Color helper for NDVI / Health
  const getPlotColor = (plot) => {
    if (!layers.cropType && layers.satelliteCropHealth) {
      if (plot.ndvi > 0.7) return '#10b981'; // Healthy Green
      if (plot.ndvi >= 0.5) return '#eab308'; // Moderate Yellow
      return '#ef4444'; // Stressed Red
    }
    return plot.cropColor || '#2d6a4f';
  };

  return (
    <DashboardLayout>
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 99999,
          background: '#1b4332',
          color: '#ffffff',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          fontWeight: 700,
          border: '1px solid #4ade80',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP HEADER STRIP */}
      <div className="gis-header-strip">
        <div className="gis-header-left">
          <div className="gis-header-title">
            <span>🌾</span> AGRI-SAMADHAN GIS DASHBOARD
          </div>
          <div className="gis-header-subtitle">
            <span>Interactive Farm Map &bull; 7-Layer Spatial Intelligence for</span>
            <strong>{activeLocation.name}</strong>
            <span style={{ opacity: 0.8 }}>({coords.lat.toFixed(4)}°N, {coords.lon.toFixed(4)}°E)</span>
          </div>
        </div>

        <div className="gis-header-badges">
          <button
            className="gis-badge-pill"
            onClick={() => setShowArchModal(true)}
            style={{ background: 'rgba(255, 255, 255, 0.25)', border: '1px solid #86efac', color: '#ffffff' }}
          >
            <span>🏗️</span> 7-Layer Architecture
          </button>

          <div
            className="gis-badge-pill"
            style={{ background: '#ef4444', borderColor: '#f87171' }}
          >
            <span>🔔</span> 3 Active Alerts
          </div>

          <div
            className="gis-badge-pill"
            style={{ cursor: 'default', background: 'rgba(0,0,0,0.3)' }}
          >
            <span>👨‍🌾</span> Farmer: <strong>{selectedPlot?.farmerName || 'Ramesh Patil'}</strong>
          </div>
        </div>
      </div>

      {/* MAIN GIS LAYOUT (LEFT SIDEBAR + CENTER MAP) */}
      <div className="gis-layout">
        {/* SIDEBAR CONTROLS & INSPECTION */}
        <div className="gis-sidebar">
          {/* Locality Selector */}
          <div className="gis-sidebar-section">
            <div className="gis-sidebar-title">
              <span>📍 Location & Cadastre</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-600)' }}>10m Sync</span>
            </div>
            <select
              className="language-select-input"
              style={{ width: '100%', padding: '0.55rem' }}
              value={Object.keys(AVAILABLE_LOCATIONS).find(k => AVAILABLE_LOCATIONS[k].name === activeLocation.name) || 'Sangamner'}
              onChange={(e) => {
                const loc = AVAILABLE_LOCATIONS[e.target.value];
                if (loc && setCustomLocation) {
                  setCustomLocation(loc);
                }
              }}
            >
              {Object.keys(AVAILABLE_LOCATIONS).map((key) => (
                <option key={key} value={key}>
                  {AVAILABLE_LOCATIONS[key].name}
                </option>
              ))}
            </select>
          </div>

          {/* GIS SPATIAL LAYERS TOGGLE */}
          <div className="gis-sidebar-section">
            <div className="gis-sidebar-title">
              <span>🗺️ Spatial Map Layers</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {Object.values(layers).filter(Boolean).length}/11 Active
              </span>
            </div>

            <div className="gis-layer-group">
              <div
                className={`gis-layer-item ${layers.farmBoundaries ? 'active' : ''}`}
                onClick={() => toggleLayer('farmBoundaries')}
              >
                <div className="gis-layer-label">
                  <span className="gis-layer-dot" style={{ background: '#2d6a4f' }}></span>
                  <span>🟩 Farm Boundaries</span>
                </div>
                <input type="checkbox" checked={layers.farmBoundaries} readOnly />
              </div>

              <div
                className={`gis-layer-item ${layers.cropType ? 'active' : ''}`}
                onClick={() => toggleLayer('cropType')}
              >
                <div className="gis-layer-label">
                  <span className="gis-layer-dot" style={{ background: '#e76f51' }}></span>
                  <span>🌱 Crop Types & Stage</span>
                </div>
                <input type="checkbox" checked={layers.cropType} readOnly />
              </div>

              <div
                className={`gis-layer-item ${layers.satelliteCropHealth ? 'active' : ''}`}
                onClick={() => toggleLayer('satelliteCropHealth')}
              >
                <div className="gis-layer-label">
                  <span className="gis-layer-dot" style={{ background: '#10b981' }}></span>
                  <span>🛰️ Satellite NDVI Health</span>
                </div>
                <input type="checkbox" checked={layers.satelliteCropHealth} readOnly />
              </div>

              <div
                className={`gis-layer-item ${layers.irrigation ? 'active' : ''}`}
                onClick={() => toggleLayer('irrigation')}
              >
                <div className="gis-layer-label">
                  <span className="gis-layer-dot" style={{ background: '#3b82f6' }}></span>
                  <span>💧 Water & Canals</span>
                </div>
                <input type="checkbox" checked={layers.irrigation} readOnly />
              </div>

              <div
                className={`gis-layer-item ${layers.rainfall ? 'active' : ''}`}
                onClick={() => toggleLayer('rainfall')}
              >
                <div className="gis-layer-label">
                  <span className="gis-layer-dot" style={{ background: '#60a5fa' }}></span>
                  <span>🌧️ Rainfall Radar</span>
                </div>
                <input type="checkbox" checked={layers.rainfall} readOnly />
              </div>

              <div
                className={`gis-layer-item ${layers.soilHealth ? 'active' : ''}`}
                onClick={() => toggleLayer('soilHealth')}
              >
                <div className="gis-layer-label">
                  <span className="gis-layer-dot" style={{ background: '#854d0e' }}></span>
                  <span>🟤 Soil Nutrients (NPK)</span>
                </div>
                <input type="checkbox" checked={layers.soilHealth} readOnly />
              </div>

              <div
                className={`gis-layer-item ${layers.pestRiskZones ? 'active' : ''}`}
                onClick={() => toggleLayer('pestRiskZones')}
              >
                <div className="gis-layer-label">
                  <span className="gis-layer-dot" style={{ background: '#ef4444' }}></span>
                  <span>🐛 Pest Alert Hotspots</span>
                </div>
                <input type="checkbox" checked={layers.pestRiskZones} readOnly />
              </div>

              <div
                className={`gis-layer-item ${layers.mandiLocations ? 'active' : ''}`}
                onClick={() => toggleLayer('mandiLocations')}
              >
                <div className="gis-layer-label">
                  <span className="gis-layer-dot" style={{ background: '#f59e0b' }}></span>
                  <span>💰 APMC Mandis & Rates</span>
                </div>
                <input type="checkbox" checked={layers.mandiLocations} readOnly />
              </div>

              <div
                className={`gis-layer-item ${layers.farmerLocation ? 'active' : ''}`}
                onClick={() => toggleLayer('farmerLocation')}
              >
                <div className="gis-layer-label">
                  <span className="gis-layer-dot" style={{ background: '#7c3aed' }}></span>
                  <span>📍 IoT Sensor Nodes</span>
                </div>
                <input type="checkbox" checked={layers.farmerLocation} readOnly />
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="gis-sidebar-section">
            <div className="gis-sidebar-title">
              <span>🔍 Filter Plots</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>Crop</label>
                <select
                  className="language-select-input"
                  style={{ width: '100%', fontSize: '0.78rem' }}
                  value={cropFilter}
                  onChange={(e) => setCropFilter(e.target.value)}
                >
                  <option value="All">All Crops</option>
                  <option value="Onion">Onion</option>
                  <option value="Pomegranate">Pomegranate</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Grapes">Grapes</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Wheat">Wheat</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>Risk Level</label>
                <select
                  className="language-select-input"
                  style={{ width: '100%', fontSize: '0.78rem' }}
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                >
                  <option value="All">All Risks</option>
                  <option value="High">⚠️ High Risk</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low / Safe</option>
                </select>
              </div>
            </div>
          </div>

          {/* Selected Farm Plot Telemetry Inspector */}
          {selectedPlot && (
            <div className="gis-sidebar-section" style={{ background: '#f0fdf4', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1b4332' }}>
                  {selectedPlot.cropIcon} {selectedPlot.crop}
                </span>
                <span className={`badge badge-${selectedPlot.pestRisk === 'High' ? 'danger' : 'success'}`}>
                  {selectedPlot.pestRisk} Risk
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Survey No: <strong>{selectedPlot.surveyNo}</strong> &bull; Owner: <strong>{selectedPlot.farmerName}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.78rem' }}>
                <div style={{ background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e5e7eb' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Area</div>
                  <strong>{selectedPlot.areaAcres} Acres</strong>
                </div>

                <div style={{ background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e5e7eb' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>NDVI Health</div>
                  <strong style={{ color: selectedPlot.ndvi > 0.7 ? '#10b981' : '#f59e0b' }}>{selectedPlot.ndvi} ({selectedPlot.healthStatus})</strong>
                </div>

                <div style={{ background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e5e7eb' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Soil Moisture</div>
                  <strong>{selectedPlot.soilMoisturePercent}%</strong>
                </div>

                <div style={{ background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e5e7eb' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Est. Yield</div>
                  <strong>{selectedPlot.estimatedYield}</strong>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#166534', background: '#dcfce7', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Agronomic Directive:</strong> {selectedPlot.recommendedAction}
              </div>
            </div>
          )}
        </div>

        {/* CENTER INTERACTIVE GIS MAP */}
        <div className="gis-map-wrapper">
          {/* Map Toolbar (Base Map Switcher & Recenter) */}
          <div className="gis-map-toolbar">
            {Object.keys(TILE_PROVIDERS).map((key) => (
              <button
                key={key}
                className={`gis-tool-btn ${activeBaseMap === key ? 'active' : ''}`}
                onClick={() => setActiveBaseMap(key)}
              >
                {TILE_PROVIDERS[key].name}
              </button>
            ))}
          </div>

          <MapContainer
            center={[coords.lat, coords.lon]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution={TILE_PROVIDERS[activeBaseMap].attribution}
              url={TILE_PROVIDERS[activeBaseMap].url}
            />

            <MapRecenter coords={coords} />
            <MapClickHandler onCoordinateClick={(lat, lon) => setCoords({ lat, lon })} />

            {/* 1. FARM BOUNDARIES & CROPS (POLYGONS) */}
            {layers.farmBoundaries && filteredPlots.map((plot) => (
              <Polygon
                key={plot.id}
                positions={plot.polygon}
                pathOptions={{
                  color: getPlotColor(plot),
                  fillColor: getPlotColor(plot),
                  fillOpacity: selectedPlot?.id === plot.id ? 0.65 : 0.4,
                  weight: selectedPlot?.id === plot.id ? 3 : 1.5,
                  dashArray: selectedPlot?.id === plot.id ? null : '3'
                }}
                eventHandlers={{
                  click: () => setSelectedPlot(plot)
                }}
              >
                <Tooltip direction="center" permanent={false} opacity={0.9}>
                  <div>
                    <strong>{plot.cropIcon} {plot.crop}</strong> ({plot.areaAcres} Ac)<br />
                    <span>{plot.farmerName} &bull; NDVI {plot.ndvi}</span>
                  </div>
                </Tooltip>

                <Popup>
                  <div style={{ minWidth: '220px', padding: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px', marginBottom: '6px' }}>
                      <strong style={{ color: '#1b4332', fontSize: '1rem' }}>
                        {plot.cropIcon} {plot.crop}
                      </strong>
                      <span className={`badge badge-${plot.pestRisk === 'High' ? 'danger' : 'success'}`}>
                        {plot.pestRisk} Risk
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', lineHeight: '1.4', color: '#374151' }}>
                      <div><strong>Farmer:</strong> {plot.farmerName} ({plot.farmerPhone})</div>
                      <div><strong>Survey No:</strong> {plot.surveyNo} | <strong>Area:</strong> {plot.areaAcres} Acres</div>
                      <div><strong>Stage:</strong> {plot.cropStage} ({plot.cropVariety})</div>
                      <div><strong>NDVI Health:</strong> <strong style={{ color: '#10b981' }}>{plot.ndvi}</strong> ({plot.healthStatus})</div>
                      <div><strong>Soil Moisture:</strong> {plot.soilMoisturePercent}%</div>
                      <div><strong>Water Source:</strong> {plot.waterSource}</div>
                      <div><strong>Yield Forecast:</strong> {plot.estimatedYield}</div>
                    </div>

                    <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '4px', marginTop: '8px', fontSize: '0.78rem', color: '#15803d' }}>
                      <strong>AI Advice:</strong> {plot.recommendedAction}
                    </div>

                    <button
                      className="btn btn-sm btn-primary"
                      style={{ width: '100%', marginTop: '8px', fontSize: '0.78rem', padding: '4px 8px' }}
                      onClick={() => openSmsForPlot(plot)}
                    >
                      📲 Send Alert SMS
                    </button>
                  </div>
                </Popup>
              </Polygon>
            ))}

            {/* 2. WATER & CANALS (POLYLINES & BOREWELL MARKERS) */}
            {layers.irrigation && gisData?.waterInfrastructure?.map((infra) => {
              if (infra.type === 'Canal') {
                return (
                  <Polyline
                    key={infra.id}
                    positions={infra.coordinates}
                    pathOptions={{ color: '#0284c7', weight: 4, opacity: 0.8 }}
                  >
                    <Popup>
                      <div>
                        <strong style={{ color: '#0284c7' }}>💧 {infra.name}</strong><br />
                        <span>Discharge: {infra.discharge}</span><br />
                        <span className="badge badge-info">{infra.status}</span>
                      </div>
                    </Popup>
                  </Polyline>
                );
              }
              return (
                <Marker
                  key={infra.id}
                  position={[infra.lat, infra.lon]}
                  icon={createCustomIcon('💧', infra.type, '#e0f2fe', '#0284c7')}
                >
                  <Popup>
                    <div>
                      <strong>{infra.name}</strong><br />
                      <span>Type: {infra.type}</span><br />
                      <span>Capacity/Yield: {infra.yield || infra.capacity}</span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* 3. PEST & DISEASE OUTBREAK HOTSPOTS (CIRCLES) */}
            {layers.pestRiskZones && gisData?.pestHotspots?.map((pest) => (
              <Circle
                key={pest.id}
                center={pest.center}
                radius={pest.radiusMeters}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#f87171',
                  fillOpacity: 0.25,
                  weight: 2,
                  dashArray: '4'
                }}
              >
                <Popup>
                  <div style={{ maxWidth: '240px' }}>
                    <strong style={{ color: '#dc2626' }}>🐛 {pest.name}</strong><br />
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Pest: {pest.pestName}</span><br />
                    <span className="badge badge-danger">High Severity Hotspot</span>
                    <p style={{ fontSize: '0.78rem', marginTop: '6px', color: '#333' }}>
                      {pest.advice}
                    </p>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* 4. APMC MANDIS & LIVE RATES (MARKERS) */}
            {layers.mandiLocations && gisData?.mandis?.map((mandi) => (
              <Marker
                key={mandi.id}
                position={[mandi.lat, mandi.lon]}
                icon={createCustomIcon('💰', mandi.name.split(' ')[0] + ' APMC', '#fef3c7', '#d97706')}
              >
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <strong style={{ color: '#b45309' }}>🏛️ {mandi.name}</strong><br />
                    <span style={{ fontSize: '0.78rem', color: '#666' }}>Distance: ~{mandi.distanceKm} km</span>
                    <div style={{ marginTop: '8px' }}>
                      <strong style={{ fontSize: '0.82rem' }}>Live Trading Rates:</strong>
                      {mandi.rates.map((r, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '2px 0', borderBottom: '1px dotted #e5e7eb' }}>
                          <span>{r.commodity}:</span>
                          <strong>₹{r.modal} {r.unit}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 5. IOT SENSORS & TELEMETRY NODES */}
            {layers.farmerLocation && gisData?.sensors?.map((sensor) => (
              <Marker
                key={sensor.id}
                position={[sensor.lat, sensor.lon]}
                icon={createCustomIcon('📡', sensor.name.split(' ')[2] || 'IoT', '#ede9fe', '#7c3aed')}
              >
                <Popup>
                  <div>
                    <strong style={{ color: '#6d28d9' }}>📡 {sensor.name}</strong><br />
                    <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                      <div>Soil Moisture (10cm): <strong>{sensor.soilMoisture10cm}</strong></div>
                      <div>Soil Temp: <strong>{sensor.soilTemp}</strong></div>
                      <div>Leaf Wetness: <strong>{sensor.leafWetness}</strong></div>
                      <div>Solar Battery: <strong>{sensor.battery}</strong></div>
                      <div style={{ color: '#888', fontSize: '0.72rem', marginTop: '4px' }}>Ping: {sensor.lastPing}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Current Selected Center Marker */}
            <Marker position={[coords.lat, coords.lon]}>
              <Popup>
                <div>
                  <strong style={{ color: '#2d6a4f' }}>📍 Farm Core Center</strong><br />
                  <span>Lat: {coords.lat.toFixed(4)}°N | Lon: {coords.lon.toFixed(4)}°E</span><br />
                  <span style={{ fontSize: '0.78rem', color: '#666' }}>Click anywhere on map to reposition</span>
                </div>
              </Popup>
            </Marker>
          </MapContainer>

          {/* Map Legend Floating Box */}
          <div className="gis-map-legend">
            <div style={{ fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
              📊 Spatial Legend
            </div>
            <div className="gis-legend-row">
              <span style={{ width: '12px', height: '12px', background: '#10b981', display: 'inline-block', borderRadius: '2px' }}></span>
              <span>Healthy Canopy (NDVI &gt; 0.70)</span>
            </div>
            <div className="gis-legend-row">
              <span style={{ width: '12px', height: '12px', background: '#f59e0b', display: 'inline-block', borderRadius: '2px' }}></span>
              <span>Moderate Stress / Onion Plots</span>
            </div>
            <div className="gis-legend-row">
              <span style={{ width: '12px', height: '12px', background: '#ef4444', display: 'inline-block', borderRadius: '2px' }}></span>
              <span>High Risk / Pest Outbreak Hotspot</span>
            </div>
            <div className="gis-legend-row">
              <span style={{ width: '12px', height: '3px', background: '#0284c7', display: 'inline-block' }}></span>
              <span>Active Irrigation Canal Network</span>
            </div>
          </div>
        </div>
      </div>



      {/* 7-LAYER ARCHITECTURE MODAL */}
      {showArchModal && (
        <div className="gis-modal-backdrop" onClick={() => setShowArchModal(false)}>
          <div className="gis-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  🌾 7-Layer Agricultural GIS Architecture
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  End-to-end telemetry flow from multi-sensor data sources to localized farmer action.
                </p>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => setShowArchModal(false)}
                style={{ background: '#f3f4f6', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Layer 1 */}
              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.95rem' }}>1. Data Sources</div>
                <div style={{ fontSize: '0.82rem', color: '#1f2937', marginTop: '0.25rem' }}>
                  Weather APIs (IMD/OpenMeteo) + Sentinel-2 Satellite (NDVI/EVI) + In-situ IoT Soil Sensors + Groundwater + Crop Telemetry + Mandi Rates + Govt Schemes.
                </div>
              </div>

              {/* Layer 2 */}
              <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
                <div style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.95rem' }}>2. Data Integration Layer</div>
                <div style={{ fontSize: '0.82rem', color: '#1f2937', marginTop: '0.25rem' }}>
                  ETL spatial engine, coordinate projection (EPSG:4326), sensor noise filtering, and multi-spectral raster harmonization.
                </div>
              </div>

              {/* Layer 3 */}
              <div style={{ background: '#faf5ff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e9d5ff' }}>
                <div style={{ fontWeight: 800, color: '#6b21a8', fontSize: '0.95rem' }}>3. GIS Layer</div>
                <div style={{ fontSize: '0.82rem', color: '#1f2937', marginTop: '0.25rem' }}>
                  Vector farm boundaries, cadastral Survey No indexing, irrigation canals, thermal layers, and APMC geo-tagging.
                </div>
              </div>

              {/* Layer 4 */}
              <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a' }}>
                <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.95rem' }}>4. AI / Analytics Layer</div>
                <div style={{ fontSize: '0.82rem', color: '#1f2937', marginTop: '0.25rem' }}>
                  Crop Water Stress Index (CWSI), epidemiology pest propagation models, weather risk scoring, and yield forecasting algorithms.
                </div>
              </div>

              {/* Layer 5 */}
              <div style={{ background: '#fff7ed', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ffedd5' }}>
                <div style={{ fontWeight: 800, color: '#9a3412', fontSize: '0.95rem' }}>5. Decision Support Layer</div>
                <div style={{ fontSize: '0.82rem', color: '#1f2937', marginTop: '0.25rem' }}>
                  Rule engine converting multi-source indices into ranked agronomic priorities and threshold triggers.
                </div>
              </div>

              {/* Layer 6 */}
              <div style={{ background: '#fdf2f8', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #fbcfe8' }}>
                <div style={{ fontWeight: 800, color: '#9d174d', fontSize: '0.95rem' }}>6. Farmer Advisory Layer</div>
                <div style={{ fontSize: '0.82rem', color: '#1f2937', marginTop: '0.25rem' }}>
                  Multilingual localization into English, Marathi (मराठी), and Hindi (हिंदी) with simple, actionable field instructions.
                </div>
              </div>

              {/* Layer 7 */}
              <div style={{ background: '#f0fdfa', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #99f6e4' }}>
                <div style={{ fontWeight: 800, color: '#115e59', fontSize: '0.95rem' }}>7. Dashboard & Alerts Layer</div>
                <div style={{ fontSize: '0.82rem', color: '#1f2937', marginTop: '0.25rem' }}>
                  Interactive Leaflet map, real-time alert center, SMS/WhatsApp dispatcher, and action pipeline execution.
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => setShowArchModal(false)}>
                Close Architecture Explorer
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default GIS;

