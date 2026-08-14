export const AVAILABLE_LOCATIONS = {
  "Sangamner": {
    name: "Sangamner (Ahmednagar)",
    district: "Ahmednagar",
    state: "Maharashtra",
    latitude: 19.5772,
    longitude: 74.2173,
    soilType: "Vertisol (Medium Deep Black Soil)",
    primaryCrops: ["Onion", "Pomegranate", "Tomato", "Wheat", "Bajra"],
    apmcMandi: "Sangamner APMC"
  },
  "Nashik": {
    name: "Nashik (Nashik Valley)",
    district: "Nashik",
    state: "Maharashtra",
    latitude: 19.9975,
    longitude: 73.7898,
    soilType: "Clay Loam / Red Loam",
    primaryCrops: ["Grapes", "Onion", "Tomato", "Soybean", "Vegetables"],
    apmcMandi: "Nashik (Panchavati) APMC"
  },
  "Kopargaon": {
    name: "Kopargaon (Godavari Basin)",
    district: "Ahmednagar",
    state: "Maharashtra",
    latitude: 19.8917,
    longitude: 74.4789,
    soilType: "Alluvial Black Soil",
    primaryCrops: ["Sugarcane", "Wheat", "Gram", "Maize"],
    apmcMandi: "Kopargaon APMC"
  },
  "Sinnar": {
    name: "Sinnar (Nashik)",
    district: "Nashik",
    state: "Maharashtra",
    latitude: 19.8458,
    longitude: 73.9986,
    soilType: "Shallow to Medium Black Soil",
    primaryCrops: ["Onion", "Bajra", "Groundnut", "Pomegranate"],
    apmcMandi: "Sinnar APMC"
  },
  "Shirdi": {
    name: "Shirdi / Rahata",
    district: "Ahmednagar",
    state: "Maharashtra",
    latitude: 19.7645,
    longitude: 74.4776,
    soilType: "Black Cotton Soil",
    primaryCrops: ["Guava", "Pomegranate", "Sugarcane", "Wheat"],
    apmcMandi: "Rahata APMC"
  },
  "Yeola": {
    name: "Yeola (Nashik)",
    district: "Nashik",
    state: "Maharashtra",
    latitude: 20.0425,
    longitude: 74.4883,
    soilType: "Medium Black Vertisol",
    primaryCrops: ["Onion", "Cotton", "Maize", "Soybean"],
    apmcMandi: "Yeola APMC"
  },
  "Pune": {
    name: "Pune Agricultural District",
    district: "Pune",
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    soilType: "Clay Loam / Red Soil",
    primaryCrops: ["Sugarcane", "Floriculture", "Vegetables", "Rice"],
    apmcMandi: "Pune (Gultekdi) APMC"
  },
  "Ahmednagar": {
    name: "Ahmednagar (Ahilyanagar)",
    district: "Ahmednagar",
    state: "Maharashtra",
    latitude: 19.0952,
    longitude: 74.7496,
    soilType: "Black Cotton Soil",
    primaryCrops: ["Jowar", "Bajra", "Cotton", "Sugarcane", "Onion"],
    apmcMandi: "Ahmednagar APMC"
  },
  "Chhatrapati Sambhajinagar": {
    name: "Chhatrapati Sambhajinagar (Aurangabad)",
    district: "Aurangabad",
    state: "Maharashtra",
    latitude: 19.8762,
    longitude: 75.3433,
    soilType: "Deep Vertisol",
    primaryCrops: ["Cotton", "Soybean", "Sweet Lime (Mosambi)", "Jowar"],
    apmcMandi: "Jadhavwadi APMC"
  },
  "Solapur": {
    name: "Solapur (Pomegranate Belt)",
    district: "Solapur",
    state: "Maharashtra",
    latitude: 17.6599,
    longitude: 75.9064,
    soilType: "Black & Mixed Red Soil",
    primaryCrops: ["Pomegranate", "Jowar", "Sugarcane", "Pulses"],
    apmcMandi: "Solapur APMC"
  },
  "Kolhapur": {
    name: "Kolhapur (Western Ghats Basin)",
    district: "Kolhapur",
    state: "Maharashtra",
    latitude: 16.7050,
    longitude: 74.2433,
    soilType: "Laterite & Heavy Alluvial",
    primaryCrops: ["Sugarcane", "Rice", "Soybean", "Turmeric"],
    apmcMandi: "Kolhapur (Shahupuri) APMC"
  },
  "Jalgaon": {
    name: "Jalgaon (Banana & Cotton Hub)",
    district: "Jalgaon",
    state: "Maharashtra",
    latitude: 21.0077,
    longitude: 75.5626,
    soilType: "Deep Black Fertile Basin",
    primaryCrops: ["Banana", "Cotton", "Jowar", "Maize"],
    apmcMandi: "Jalgaon APMC"
  },
  "Nagpur": {
    name: "Nagpur (Vidarbha Basin)",
    district: "Nagpur",
    state: "Maharashtra",
    latitude: 21.1458,
    longitude: 79.0882,
    soilType: "Black & Yellowish Clay Loam",
    primaryCrops: ["Nagpur Orange", "Cotton", "Soybean", "Paddy"],
    apmcMandi: "Nagpur APMC"
  }
};

export const DEFAULT_LOCATION = AVAILABLE_LOCATIONS["Sangamner"];

export const getUserLocation = () => {
  if (typeof window !== 'undefined') {
    try {
      // 1. Check if user is logged in and has custom location in user object
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.location) {
          const locKey = Object.keys(AVAILABLE_LOCATIONS).find(k =>
            parsed.location.toLowerCase().includes(k.toLowerCase())
          );
          if (locKey) {
            return {
              ...AVAILABLE_LOCATIONS[locKey],
              rawLocation: parsed.location
            };
          }
        }
      }

      // 2. Check explicitly selected location in localStorage
      const activeLoc = localStorage.getItem('activeLocation');
      if (activeLoc && AVAILABLE_LOCATIONS[activeLoc]) {
        return AVAILABLE_LOCATIONS[activeLoc];
      }
    } catch (e) {
      console.warn('Error reading stored location:', e);
    }
  }
  return DEFAULT_LOCATION;
};

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    if (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '5000') {
      return `http://${hostname}:5000/api`;
    }
    return '/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export default DEFAULT_LOCATION;
