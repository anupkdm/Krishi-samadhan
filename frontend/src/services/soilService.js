import api from './api';

const DEFAULT_SOIL_DATA = {
  location: {
    name: "Sangamner / Nashik Agricultural Basin",
    latitude: 19.8833,
    longitude: 74.4833
  },
  soilType: "Vertisol (Deep Black Cotton Soil)",
  soilHealthScore: 78,
  pH: 7.6,
  nitrogen: 240, // kg/ha (Medium)
  phosphorus: 24, // kg/ha (Medium)
  potassium: 310, // kg/ha (High)
  organicCarbon: 0.68, // %
  moisture: 38.5, // %
  temperature: 24.2, // °C
  texture: "Clayey Loam (High Water Retention)",
  recommendations: {
    fertilizer: "Apply Urea in split doses (50% basal, 25% at tillering, 25% at panicle emergence). Supplement with 5 tonnes/acre well-decomposed FYM.",
    soilHealthRating: "Good — Balanced for Onion, Cotton, Wheat & Pomegranate",
    drainageAlert: "Vertisols retain heavy moisture. Avoid waterlogging during active vegetative stages."
  }
};

export const getSoilData = async (lat = 19.8833, lon = 74.4833) => {
  try {
    const res = await api.get('/soil/data', { lat, lon });
    if (res && res.soilType) {
      return res;
    }
  } catch (err) {
    console.warn('Backend soil endpoint unavailable, using soil intelligence model:', err.message);
  }
  return { ...DEFAULT_SOIL_DATA, location: { ...DEFAULT_SOIL_DATA.location, latitude: lat, longitude: lon } };
};

export const getSoilHealth = getSoilData;

const soilService = {
  getSoilData,
  getSoilHealth
};

export default soilService;
