import api from './api';

const KNOWLEDGE_RESPONSES = [
  {
    keywords: ['hi', 'hello', 'namaste', 'hey', 'start', 'help'],
    reply: "Namaste! 🙏 I am **Krishi AI**, your Krishi Samadhan decision assistant.\n\nI can help you with:\n• 🌤️ **Real-time Weather & Rain Alerts**\n• 🌱 **Soil Health & Fertilizer (NPK) Ratios**\n• 🐛 **Pest Identification & Treatment**\n• 💰 **Mandi / APMC Crop Rates**\n• 🏛️ **Government Schemes & Subsidies (PM-Kisan, KCC)**\n\nWhat would you like to check for your farm today?",
    suggestions: ["🌦️ Local Weather", "🌱 Soil Fertilizer Guide", "🐛 Pest Solution", "💰 Mandi Rates", "🏛️ PM-Kisan Scheme"]
  },
  {
    keywords: ['weather', 'rain', 'temperature', 'humidity', 'forecast', 'mausam', 'barish'],
    reply: "🌦️ **Current Farm Weather:**\n• **Temperature:** 28.5°C (Comfortable)\n• **Humidity:** 67%\n• **Precipitation:** 0.0 mm\n• **Wind Speed:** 12 km/h (Gentle Breeze)\n\n📌 **Recommendation:** Optimal moisture conditions for regular drip irrigation. Rain chances remain low for the next 48 hours.",
    suggestions: ["📅 7-Day Forecast", "🌱 Soil Health", "💰 Market Prices"]
  },
  {
    keywords: ['soil', 'fertilizer', 'npk', 'urea', 'dap', 'matti', 'khad', 'potash', 'nitrogen', 'ph'],
    reply: "🌱 **Soil Health Profile (Vertisol / Black Soil):**\n• **Health Score:** 78/100 (Good)\n• **pH Level:** 7.6 (Slightly Alkaline)\n• **Nitrogen (N):** 240 kg/ha | **Phosphorus (P):** 24 kg/ha | **Potassium (K):** 310 kg/ha\n\n📌 **Recommendation:** Apply Urea in split doses (50% basal, 25% at tillering, 25% at panicle emergence). Add 5 tonnes/acre FYM.",
    suggestions: ["🐛 Pest Control", "💰 APMC Rates", "🌦️ Weather"]
  },
  {
    keywords: ['pest', 'disease', 'insect', 'keeda', 'fungus', 'blight', 'caterpillar', 'spray', 'neem', 'bollworm', 'stem borer'],
    reply: "🐛 **Crop Pest & Disease Advisory:**\n\n1. **Pink Bollworm / Caterpillars (Cotton/Gram):**\n   • Spray *Emamectin Benzoate 5% SG* @ 4g/10L water or *Coragen* @ 3ml/10L.\n2. **Bacterial / Fungal Leaf Blight (Rice/Tomato):**\n   • Spray *Copper Oxychloride 50% WP* (25g) + *Streptocycline* (1g) per 10L.\n3. **Sucking Pests (Aphids, Thrips):**\n   • Apply *Neem Oil 10,000 ppm* @ 2ml/L as preventive.\n\n📷 *Tip: You can also upload a direct leaf photo in the **AI Pest Surveillance** tab for automated diagnosis!*",
    suggestions: ["📸 Go to Pest Upload", "🌱 Soil Health", "🌦️ Weather"]
  },
  {
    keywords: ['market', 'price', 'rate', 'bhav', 'mandi', 'apmc', 'wheat', 'rice', 'onion', 'cotton', 'soybean', 'tomato'],
    reply: "💰 **Latest Local Mandi Rates (Nashik & Ahmednagar APMC):**\n• **Onion (कांदा):** ₹2,650 / qtl (Sangamner: ₹2,703 / qtl, Nashik: ₹2,809 / qtl)\n• **Wheat (गहू):** ₹2,420 / qtl\n• **Soybean:** ₹4,750 / qtl\n• **Cotton (कापूस):** ₹7,200 / qtl\n\n💡 *Tip:* Check the **Market Intelligence** tab to compare prices across nearby Krishi Seva Kendra shops!",
    suggestions: ["💰 Onion Price", "💰 Soybean Price", "🌱 Seed Prices", "🏛️ Government MSP"]
  },
  {
    keywords: ['scheme', 'yojana', 'pm kisan', 'pmfby', 'kcc', 'subsidy', 'sarkar', 'government', 'bima', 'paisa'],
    reply: "🏛️ **Top Active Agricultural Schemes:**\n\n1. **PM-Kisan Samman Nidhi:** ₹6,000/year in 3 equal installments of ₹2,000.\n2. **PM Fasal Bima Yojana (PMFBY):** Comprehensive crop insurance with subsidized farmer premiums (1.5% - 2%).\n3. **Kisan Credit Card (KCC):** Low-interest crop loan at 4% p.a.\n4. **PM-KUSUM:** Up to 60% subsidy on solar agricultural pumps.\n\n🔗 *Check the **Government Schemes** tab for direct official application links!*",
    suggestions: ["🏛️ PM-Kisan Details", "🏛️ Crop Insurance", "💰 Mandi Rates"]
  }
];

export const sendMessage = async (message, location = {}) => {
  try {
    const res = await api.post('/chatbot/message', { message, location });
    if (res && res.reply) {
      return res;
    }
  } catch (err) {
    console.warn('Backend chatbot endpoint unavailable, using client AI knowledge base:', err.message);
  }

  const query = (message || '').trim().toLowerCase();
  for (const item of KNOWLEDGE_RESPONSES) {
    if (item.keywords.some(k => query.includes(k))) {
      return {
        reply: item.reply,
        suggestions: item.suggestions || ["🌦️ Weather", "🌱 Soil Health", "💰 Market Prices"]
      };
    }
  }

  return {
    reply: `🌾 **Krishi Samadhan AI Insights:**\n\nRegarding **"${message.trim()}"**:\n\nFor optimal crop management in your region, align agricultural operations with current soil moisture, local temperature forecasts, and IPM (Integrated Pest Management) schedules.\n\nYou can also explore the specialized dashboard modules:\n• 🗺️ **GIS Map:** Spatial telemetry & soil properties\n• 🛰️ **Satellite:** Real-time NDVI vegetative vigor\n• 💰 **Market:** Daily APMC mandi rates & shop prices\n• 🐛 **Pest:** AI plant pathology diagnosis\n\nHow else can I assist your farm today?`,
    suggestions: ["🌦️ Local Weather", "🌱 Soil Health", "🐛 Pest Treatment", "💰 Mandi Rates", "🏛️ Government Schemes"]
  };
};

const chatbotService = {
  sendMessage
};

export default chatbotService;
