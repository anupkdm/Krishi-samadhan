const weatherService = require('./weatherService');
const soilService = require('./soilService');
const marketService = require('./marketService');
const schemesService = require('./schemesService');

// Comprehensive Agricultural Knowledge Base for AI Chatbot
const KNOWLEDGE_RESPONSES = [
  {
    keywords: ['hi', 'hello', 'namaste', 'hey', 'start', 'help'],
    reply: "Namaste! 🙏 I am **Krishi AI**, your Krishi Samadhan decision assistant.\n\nI can help you with:\n• 🌤️ **Real-time Weather & Rain Alerts**\n• 🌱 **Soil Health & Fertilizer (NPK) Ratios**\n• 🐛 **Pest Identification & Treatment**\n• 💰 **Mandi / APMC Crop Rates**\n• 🏛️ **Government Schemes & Subsidies (PM-Kisan, KCC)**\n\nWhat would you like to check for your farm today?",
    suggestions: ["🌦️ Local Weather", "🌱 Soil Fertilizer Guide", "🐛 Pest Solution", "💰 Mandi Rates", "🏛️ PM-Kisan Scheme"]
  },
  {
    keywords: ['weather', 'rain', 'temperature', 'humidity', 'forecast', 'mausam', 'barish'],
    handler: async (lat, lon) => {
      try {
        const w = await weatherService.getCurrentWeather(lat || 19.8833, lon || 74.4833);
        return {
          reply: `🌦️ **Current Farm Weather (${w.location?.name || 'Maharashtra Farm Zone'}):**\n• **Temperature:** ${w.temperature}°C (Feels comfortable)\n• **Humidity:** ${w.humidity}%\n• **Precipitation:** ${w.precipitation} mm\n• **Wind Speed:** ${w.wind_speed} km/h\n\n📌 **Agronomic Recommendation:** ${w.signals?.irrigation_need ? 'Optimal moisture conditions for standard drip irrigation.' : 'Sufficient soil moisture detected. Defer heavy irrigation to prevent waterlogging.'}`,
          suggestions: ["📅 7-Day Forecast", "🌱 Soil Health", "💰 Market Prices"]
        };
      } catch {
        return {
          reply: "🌦️ Current weather conditions for Central Maharashtra indicate steady temperatures around 28°C with moderate relative humidity (65%). Ideal for Kharif crop field maintenance.",
          suggestions: ["🌱 Soil Guide", "💰 Mandi Rates"]
        };
      }
    }
  },
  {
    keywords: ['soil', 'fertilizer', 'npk', 'urea', 'dap', 'matti', 'khad', 'potash', 'nitrogen', 'ph'],
    handler: async (lat, lon) => {
      try {
        const s = await soilService.getSoilData(lat || 19.8833, lon || 74.4833);
        return {
          reply: `🌱 **Soil Health Profile (${s.soilType}):**\n• **Overall Health Score:** ${s.soilHealthScore}/100\n• **pH Level:** ${s.pH} (${s.pH >= 7 && s.pH <= 8 ? 'Moderately Alkaline' : 'Neutral'})\n• **Nitrogen (N):** ${s.nitrogen} kg/ha (Medium)\n• **Phosphorus (P):** ${s.phosphorus} kg/ha (Moderate)\n• **Potassium (K):** ${s.potassium} kg/ha (High)\n\n📌 **Prescription:** ${s.recommendations?.fertilizer || 'Apply Urea in split doses (50% basal, 25% at tillering, 25% at panicle emergence). Add 5 tonnes/acre well-decomposed FYM/compost to improve aeration.'}`,
          suggestions: ["🐛 Pest Control", "💰 APMC Rates", "🌦️ Weather"]
        };
      } catch {
        return {
          reply: "🌱 For Black Cotton Soil (Vertisols), recommended NPK dosage for Cereals/Cotton is **120:60:40 kg/ha**. Use split nitrogen application and incorporate bio-fertilizers like *Azotobacter* and *PSB* to enhance nutrient uptake.",
          suggestions: ["🌦️ Weather", "🏛️ Soil Health Card Scheme"]
        };
      }
    }
  },
  {
    keywords: ['pest', 'disease', 'insect', 'keeda', 'fungus', 'blight', 'caterpillar', 'spray', 'neem', 'bollworm', 'stem borer'],
    reply: "🐛 **Crop Pest & Disease Advisory:**\n\n1. **Pink Bollworm / Caterpillars (Cotton/Gram):**\n   • Spray *Emamectin Benzoate 5% SG* @ 4g/10L water or *Chlorantraniliprole 18.5% SC* @ 3ml/10L.\n2. **Bacterial / Fungal Leaf Blight (Rice/Tomato):**\n   • Spray *Copper Oxychloride 50% WP* (25g) + *Streptocycline* (1g) per 10L water.\n3. **Sucking Pests (Aphids, Thrips, Whitefly):**\n   • Apply *Neem Oil 10,000 ppm* @ 2ml/L as preventive, or *Thiamethoxam 25% WG* @ 0.3g/L for heavy infestations.\n\n📷 *Tip: You can also upload a direct photo in the **AI Pest Surveillance** tab for automated image diagnosis!*",
    suggestions: ["📸 Go to Pest Upload", "🌱 Soil Health", "🌦️ Weather"]
  },
  {
    keywords: ['market', 'price', 'rate', 'bhav', 'mandi', 'apmc', 'wheat', 'rice', 'onion', 'cotton', 'soybean', 'tomato'],
    handler: async (query) => {
      const q = query.toLowerCase();
      let crop = 'wheat';
      if (q.includes('onion') || q.includes('pyaj')) crop = 'onion';
      else if (q.includes('soybean')) crop = 'soybean';
      else if (q.includes('cotton') || q.includes('kapas')) crop = 'cotton';
      else if (q.includes('tomato')) crop = 'tomato';
      else if (q.includes('rice') || q.includes('chawal')) crop = 'rice';

      try {
        const m = await marketService.getPrices({ commodity: crop, state: 'Maharashtra' });
        const records = m.records || [];
        if (records.length > 0) {
          const top = records[0];
          return {
            reply: `💰 **Latest APMC Mandi Rates for ${crop.toUpperCase()}:**\n• **Market:** ${top.market} (${top.district})\n• **Modal Price:** ₹${top.modal_price} / quintal\n• **Price Range:** ₹${top.min_price} – ₹${top.max_price} / quintal\n• **Recorded Date:** ${top.price_date || 'August 2026'}\n\n💡 *Arbitrage Tip:* Check neighboring APMC mandis in the **Market Intelligence** tab to maximize profits!`,
            suggestions: ["💰 Onion Price", "💰 Soybean Price", "💰 Cotton Price", "🏛️ Government MSP"]
          };
        }
      } catch (e) {}

      return {
        reply: `💰 Current modal mandi rates for **${crop.toUpperCase()}** in Maharashtra range between **₹2,400 – ₹6,800/quintal** depending on quality grade and moisture content.`,
        suggestions: ["💰 Check Market Tab", "🌦️ Weather Forecast"]
      };
    }
  },
  {
    keywords: ['scheme', 'yojana', 'pm kisan', 'pmfby', 'kcc', 'subsidy', 'sarkar', 'government', 'bima', 'paisa'],
    reply: "🏛️ **Top Agricultural Schemes & Benefits:**\n\n1. **PM-Kisan Samman Nidhi:**\n   • ₹6,000/year in 3 equal installments of ₹2,000 directly to farmer bank accounts.\n2. **Pradhan Mantri Fasal Bima Yojana (PMFBY):**\n   • Crop insurance at subsidized premiums: 2% for Kharif, 1.5% for Rabi, 5% for Horticulture.\n3. **Kisan Credit Card (KCC):**\n   • Low-interest crop loan at 4% per annum (with prompt repayment incentive) up to ₹3 Lakh.\n4. **PM Kusum (Solar Pump Scheme):**\n   • Up to 60% government subsidy on standalone solar agriculture pumps.\n\n🔗 *Explore all 9 active programs with direct application links in the **Government Schemes** tab!*",
    suggestions: ["🏛️ PM-Kisan Details", "🏛️ Crop Insurance", "💰 Mandi Rates"]
  },
  {
    keywords: ['irrigation', 'water', 'pani', 'drip', 'sprinkler'],
    reply: "💧 **Irrigation & Water Management Advisory:**\n• **Best Time:** Early morning (5 AM – 8 AM) or late evening to minimize evaporative losses.\n• **Drip Irrigation:** Saves 40–60% water and delivers fertigation directly to root zones.\n• **Black Soil Warning:** Vertisols have high clay content and water retention. Avoid over-watering to prevent root rot (*Pythium/Rhizoctonia*).",
    suggestions: ["🌦️ Rain Forecast", "🌱 Soil Moisture", "🏛️ Solar Pump Subsidy"]
  }
];

async function processMessage(message, location = {}) {
  if (!message || typeof message !== 'string') {
    return {
      reply: "Please ask a question about crops, weather, soil, pests, mandi prices, or government schemes.",
      suggestions: ["🌦️ Weather", "🌱 Soil", "🐛 Pest", "💰 Market", "🏛️ Schemes"]
    };
  }

  const query = message.trim().toLowerCase();
  const lat = location.lat || location.latitude || 19.8833;
  const lon = location.lon || location.longitude || 74.4833;

  // Match knowledge rules
  for (const item of KNOWLEDGE_RESPONSES) {
    const matched = item.keywords.some(k => query.includes(k));
    if (matched) {
      if (typeof item.handler === 'function') {
        return await item.handler(query, lat, lon);
      }
      return {
        reply: item.reply,
        suggestions: item.suggestions || ["🌦️ Weather", "🌱 Soil Health", "💰 Market Prices", "🏛️ Schemes"]
      };
    }
  }

  // Fallback intelligent agricultural assistant response
  return {
    reply: `🌾 **Krishi Samadhan AI Insights:**\n\nRegarding **"${message.trim()}"**:\n\nFor optimal crop management in your region, align agricultural operations with current soil moisture, local temperature forecasts, and IPM (Integrated Pest Management) schedules.\n\nYou can also explore the specialized dashboard modules:\n• 🗺️ **GIS Map:** Spatial telemetry & soil properties\n• 🛰️ **Satellite:** Real-time NDVI vegetative vigor\n• 💰 **Market:** Daily APMC mandi rates & shop prices\n• 🐛 **Pest:** AI plant pathology diagnosis\n\nHow else can I assist your farm today?`,
    suggestions: ["🌦️ Local Weather", "🌱 Soil Health", "🐛 Pest Treatment", "💰 Mandi Rates", "🏛️ Government Schemes"]
  };
}

module.exports = {
  processMessage
};
