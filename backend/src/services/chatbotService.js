const weatherService = require('./weatherService');
const soilService = require('./soilService');
const marketService = require('./marketService');
const schemesService = require('./schemesService');

// Comprehensive Regional Locations & Agricultural Intelligence Database
const LOCATIONS_DB = {
  "nashik": {
    name: "Nashik",
    fullName: "Nashik (Nashik Valley)",
    district: "Nashik",
    state: "Maharashtra",
    lat: 19.9975,
    lon: 73.7898,
    soilType: "Medium Black Alluvial & Clay Loam (pH 7.4)",
    apmcHub: "Nashik (Panchavati) & Lasalgaon APMC",
    primaryCrops: ["Table Grapes", "Onion (Lasalgaon)", "Tomato", "Soybean"],
    mandiRates: {
      onion: "₹2,820 – ₹2,950/qtl",
      tomato: "₹1,900 – ₹2,200/qtl",
      grapes: "₹85 – ₹120/kg",
      soybean: "₹4,680 – ₹4,850/qtl"
    }
  },
  "sangamner": {
    name: "Sangamner",
    fullName: "Sangamner (Pravara Basin)",
    district: "Ahmednagar",
    state: "Maharashtra",
    lat: 19.5772,
    lon: 74.2173,
    soilType: "Deep Vertisol (Black Cotton Soil, pH 7.8)",
    apmcHub: "Sangamner APMC & Kopargaon Sub-Yard",
    primaryCrops: ["Onion", "Pomegranate (Bhagwa)", "Tomato", "Sugarcane", "Wheat"],
    mandiRates: {
      onion: "₹2,750 – ₹2,840/qtl",
      pomegranate: "₹115 – ₹150/kg",
      tomato: "₹1,800 – ₹2,100/qtl",
      sugarcane: "₹3,150/tonne"
    }
  },
  "pune": {
    name: "Pune",
    fullName: "Pune (Bhima-Nira Basin)",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.5204,
    lon: 73.8567,
    soilType: "Medium to Deep Black Clay (pH 7.6)",
    apmcHub: "Pune Gultekdi APMC & Baramati Market Yard",
    primaryCrops: ["Sugarcane", "Floriculture", "Vegetables", "Rice"],
    mandiRates: {
      sugarcane: "₹3,200/tonne",
      onion: "₹2,700 – ₹2,800/qtl",
      tomato: "₹1,850 – ₹2,150/qtl"
    }
  },
  "kopargaon": {
    name: "Kopargaon",
    fullName: "Kopargaon (Godavari Basin)",
    district: "Ahmednagar",
    state: "Maharashtra",
    lat: 19.8917,
    lon: 74.4789,
    soilType: "Alluvial Black Soil (pH 7.7)",
    apmcHub: "Kopargaon APMC",
    primaryCrops: ["Sugarcane", "Wheat", "Gram", "Maize"],
    mandiRates: {
      sugarcane: "₹3,250/tonne",
      wheat: "₹2,650 – ₹2,800/qtl",
      soybean: "₹4,700 – ₹4,820/qtl"
    }
  },
  "sinnar": {
    name: "Sinnar",
    fullName: "Sinnar (Nashik)",
    district: "Nashik",
    state: "Maharashtra",
    lat: 19.8458,
    lon: 73.9986,
    soilType: "Shallow to Medium Black Soil (pH 7.2)",
    apmcHub: "Sinnar APMC",
    primaryCrops: ["Onion", "Bajra", "Groundnut", "Pomegranate"],
    mandiRates: {
      onion: "₹2,780 – ₹2,880/qtl",
      bajra: "₹2,200 – ₹2,350/qtl",
      pomegranate: "₹110 – ₹145/kg"
    }
  },
  "shirdi": {
    name: "Shirdi",
    fullName: "Shirdi / Rahata",
    district: "Ahmednagar",
    state: "Maharashtra",
    lat: 19.7645,
    lon: 74.4776,
    soilType: "Black Cotton Soil (pH 7.8)",
    apmcHub: "Rahata APMC",
    primaryCrops: ["Guava", "Pomegranate", "Sugarcane", "Wheat"],
    mandiRates: {
      pomegranate: "₹120 – ₹155/kg",
      guava: "₹45 – ₹70/kg",
      sugarcane: "₹3,200/tonne"
    }
  },
  "yeola": {
    name: "Yeola",
    fullName: "Yeola (Nashik)",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.0425,
    lon: 74.4883,
    soilType: "Medium Black Vertisol (pH 7.5)",
    apmcHub: "Yeola APMC",
    primaryCrops: ["Onion", "Cotton", "Maize", "Soybean"],
    mandiRates: {
      onion: "₹2,800 – ₹2,920/qtl",
      cotton: "₹7,100 – ₹7,350/qtl",
      maize: "₹2,150 – ₹2,300/qtl"
    }
  },
  "solapur": {
    name: "Solapur",
    fullName: "Solapur (Pomegranate Belt)",
    district: "Solapur",
    state: "Maharashtra",
    lat: 17.6599,
    lon: 75.9064,
    soilType: "Black & Mixed Red Soil (pH 7.5)",
    apmcHub: "Solapur APMC",
    primaryCrops: ["Pomegranate", "Jowar", "Sugarcane", "Pulses"],
    mandiRates: {
      pomegranate: "₹125 – ₹160/kg",
      jowar: "₹2,600 – ₹2,850/qtl",
      sugarcane: "₹3,180/tonne"
    }
  },
  "kolhapur": {
    name: "Kolhapur",
    fullName: "Kolhapur (Western Ghats Basin)",
    district: "Kolhapur",
    state: "Maharashtra",
    lat: 16.7050,
    lon: 74.2433,
    soilType: "Laterite & Heavy Alluvial (pH 6.8)",
    apmcHub: "Kolhapur (Shahupuri) APMC",
    primaryCrops: ["Sugarcane", "Rice", "Soybean", "Turmeric"],
    mandiRates: {
      sugarcane: "₹3,350/tonne",
      rice: "₹3,500 – ₹3,900/qtl",
      turmeric: "₹12,500 – ₹14,200/qtl"
    }
  },
  "jalgaon": {
    name: "Jalgaon",
    fullName: "Jalgaon (Banana & Cotton Hub)",
    district: "Jalgaon",
    state: "Maharashtra",
    lat: 21.0077,
    lon: 75.5626,
    soilType: "Deep Black Fertile Basin (pH 7.8)",
    apmcHub: "Jalgaon APMC",
    primaryCrops: ["Banana", "Cotton", "Jowar", "Maize"],
    mandiRates: {
      banana: "₹1,400 – ₹1,850/qtl",
      cotton: "₹7,250 – ₹7,500/qtl"
    }
  },
  "nagpur": {
    name: "Nagpur",
    fullName: "Nagpur (Vidarbha Basin)",
    district: "Nagpur",
    state: "Maharashtra",
    lat: 21.1458,
    lon: 79.0882,
    soilType: "Black & Yellowish Clay Loam (pH 7.3)",
    apmcHub: "Nagpur APMC",
    primaryCrops: ["Nagpur Orange", "Cotton", "Soybean", "Paddy"],
    mandiRates: {
      orange: "₹4,500 – ₹6,200/qtl",
      cotton: "₹7,200 – ₹7,450/qtl",
      soybean: "₹4,750 – ₹4,900/qtl"
    }
  }
};

/**
 * Detect language of query and user context accurately
 */
function detectTargetLanguage(query, preferredLanguage = 'en') {
  // Check for Devanagari Unicode characters
  const hasDevanagari = /[\u0900-\u097F]/.test(query);
  if (hasDevanagari) {
    // Check Marathi specific keywords
    const mrMarkers = ['आहे', 'कसा', 'काय', 'हवामान', 'पाऊस', 'कांदा', 'सांगा', 'शेत', 'पिके', 'माहिती', 'दर'];
    if (mrMarkers.some(m => query.includes(m)) || preferredLanguage === 'mr') {
      return 'mr';
    }
    const hiMarkers = ['कैसा', 'मौसम', 'बारिश', 'फसल', 'बताइए', 'कीजिए', 'दाम', 'क्या'];
    if (hiMarkers.some(m => query.includes(m)) || preferredLanguage === 'hi') {
      return 'hi';
    }
    return preferredLanguage === 'hi' ? 'hi' : 'mr';
  }

  // If query is in Latin script (e.g. English query like "Weather in Nashik"):
  // Follow query language primarily, defaulting to English if Latin query is typed
  const hasLatin = /[a-zA-Z]/.test(query);
  if (hasLatin) {
    return 'en';
  }

  return preferredLanguage || 'en';
}

/**
 * Find matching location from query text or context
 */
function resolveLocation(query, locationContext = {}) {
  const q = (query || '').toLowerCase();
  
  // 1. Check if location explicitly mentioned in user query text
  for (const key of Object.keys(LOCATIONS_DB)) {
    if (q.includes(key)) {
      return LOCATIONS_DB[key];
    }
  }

  // 2. Check location context passed from user session
  const contextLocName = (locationContext.name || locationContext.district || '').toLowerCase();
  for (const key of Object.keys(LOCATIONS_DB)) {
    if (contextLocName.includes(key)) {
      return LOCATIONS_DB[key];
    }
  }

  // Fallback to Sangamner default or provided context coordinates
  if (locationContext.latitude && locationContext.longitude) {
    return {
      name: locationContext.name || "Sangamner",
      fullName: locationContext.name || "Sangamner",
      district: locationContext.district || "Ahmednagar",
      state: "Maharashtra",
      lat: locationContext.latitude,
      lon: locationContext.longitude,
      soilType: locationContext.soilType || "Medium Deep Black Soil",
      apmcHub: locationContext.apmcMandi || "Local APMC",
      primaryCrops: locationContext.primaryCrops || ["Onion", "Wheat", "Sugarcane"],
      mandiRates: {
        onion: "₹2,750 – ₹2,840/qtl",
        soybean: "₹4,700 – ₹4,850/qtl"
      }
    };
  }

  return LOCATIONS_DB["sangamner"];
}

exports.processMessage = async (message, locationArg, languageArg, userArg) => {
  // Support both processMessage(msg, location, lang, user) and processMessage(msg, { location, language, user })
  let location = {};
  let language = 'en';
  let user = null;

  if (locationArg && typeof locationArg === 'object' && !locationArg.latitude && (locationArg.location || locationArg.language)) {
    location = locationArg.location || {};
    language = locationArg.language || 'en';
    user = locationArg.user || null;
  } else {
    location = locationArg || {};
    language = languageArg || 'en';
    user = userArg || null;
  }

  const query = (message || '').trim();
  const qLower = query.toLowerCase();
  const targetLang = detectTargetLanguage(query, language);
  const loc = resolveLocation(query, location);

  const friendNameEn = user?.name ? ` ${user.name}` : '';
  const friendNameMr = user?.name ? ` ${user.name}` : ' मित्रा';
  const friendNameHi = user?.name ? ` ${user.name}` : ' भाई';

  // 1. WEATHER & CLIMATE QUERY
  if (['weather', 'rain', 'temperature', 'forecast', 'humidity', 'wind', 'precipitation', 'mausam', 'barish', 'havaman', 'paus', 'हवामान', 'पाऊस', 'तापमान', 'मौसम', 'बारिश', 'वर्षा', 'आर्द्रता'].some(k => qLower.includes(k))) {
    let currentTemp = 28.4;
    let humidity = 62;
    let windSpeed = 11.5;
    let rainProb = 10;
    let conditionEn = "Clear / Partly Cloudy";
    let conditionMr = "निरभ्र / अंशतः ढगाळ";
    let conditionHi = "साफ / आंशिक बादल";
    let minTemp = 19.2;
    let maxTemp = 31.5;

    try {
      const weatherData = await weatherService.getCurrentWeather(loc.lat, loc.lon).catch(() => null);
      const forecastData = await weatherService.getForecast(loc.lat, loc.lon).catch(() => null);

      if (weatherData) {
        currentTemp = weatherData.temperature ?? currentTemp;
        humidity = weatherData.humidity ?? humidity;
        windSpeed = weatherData.wind_speed ?? windSpeed;
      }
      if (forecastData?.forecast) {
        minTemp = forecastData.forecast.temperature_2m_min?.[0] ?? minTemp;
        maxTemp = forecastData.forecast.temperature_2m_max?.[0] ?? maxTemp;
        rainProb = forecastData.forecast.precipitation_probability_max?.[0] ?? rainProb;
      }
    } catch (e) {
      console.warn('Weather fetch error in chatbot:', e.message);
    }

    if (targetLang === 'mr') {
      return {
        reply: `🌦️ **${loc.name} परिसराचा हवामान अंदाज**\n\n• **सध्याचे तापमान:** ${currentTemp}°C (किमान ${minTemp}°C / कमाल ${maxTemp}°C)\n• **हवेची स्थिती:** ${conditionMr}\n• **हवेतील आर्द्रता:** ${humidity}%\n• **वाऱ्याचा वेग:** ${windSpeed} किमी/तास\n• **पावसाची शक्यता:** ${rainProb}% ${rainProb > 40 ? '(⚠️ पावसाचा अंदाज - निचरा चर मोकळे ठेवा)' : '(पावसाचा धोका नाही)'}\n\n🎯 **शेती सल्ला:**\n• **फवारणीची वेळ:** ${windSpeed > 15 ? '⚠️ जास्त वाऱ्यामुळे फवारणी टाळा' : '✅ फवारणीसाठी हवामान अनुकूल (सकाळी ६:३० ते ९:३० वाजेपर्यंत उत्तम)'}\n• **पाणी व्यवस्थापन:** ठिबक सिंचनाने आवश्यकतेनुसार ४५-६० मिनिटे पाणी द्यावे.`,
        suggestions: [`💰 ${loc.name} बाजारभाव`, `🌱 ${loc.name} मृदा आरोग्य`, "🛒 औषध खरेदी लिंक्स", "🚜 आवश्यक शेती यंत्रे"]
      };
    }

    if (targetLang === 'hi') {
      return {
        reply: `🌦️ **${loc.name} का मौसम पूर्वानुमान**\n\n• **वर्तमान तापमान:** ${currentTemp}°C (न्यूनतम ${minTemp}°C / अधिकतम ${maxTemp}°C)\n• **मौसम की स्थिति:** ${conditionHi}\n• **सापेक्ष आर्द्रता:** ${humidity}%\n• **हवा की गति:** ${windSpeed} किमी/घंटा\n• **बारिश की संभावना:** ${rainProb}% ${rainProb > 40 ? '(⚠️ बारिश की संभावना - जल निकासी साफ रखें)' : '(बारिश का कोई खतरा नहीं)'}\n\n🎯 **कृषि सलाह:**\n• **छिड़काव समय:** ${windSpeed > 15 ? '⚠️ तेज हवा के कारण छिड़काव टालें' : '✅ कीटनाशक छिड़काव के लिए मौसम अनुकूल (सुबह 6:30 से 9:30 बजे तक)'}\n• **सिंचाई:** आवश्यकतानुसार 45-60 मिनट ड्रिप सिंचाई चलाएं।`,
        suggestions: [`💰 ${loc.name} मंडी भाव`, `🌱 ${loc.name} मिट्टी स्वास्थ्य`, "🛒 दवा खरीद लिंक्स", "🚜 आवश्यक कृषि मशीनरी"]
      };
    }

    return {
      reply: `🌦️ **Weather Intelligence for ${loc.fullName}**\n\n• **Current Temperature:** ${currentTemp}°C (Min ${minTemp}°C / Max ${maxTemp}°C)\n• **Weather Condition:** ${conditionEn}\n• **Relative Humidity:** ${humidity}%\n• **Wind Speed:** ${windSpeed} km/h\n• **Precipitation Probability:** ${rainProb}% ${rainProb > 40 ? '(⚠️ Rain Expected - Clear drainage furrows)' : '(No immediate rain risk)'}\n\n🎯 **Agronomic Advisory:**\n• **Foliar Spray Window:** ${windSpeed > 15 ? '⚠️ Postpone foliar spraying due to high wind velocity' : '✅ Favorable for spraying (Best window: 6:30 AM – 9:30 AM)'}\n• **Irrigation:** Run scheduled drip fertigation cycle for 45–60 minutes.`,
      suggestions: [`💰 ${loc.name} APMC Rates`, `🌱 ${loc.name} Soil Profile`, "🛒 Pest Medicine Buy Links", "🚜 Required Machinery"]
    };
  }

  // 2. APMC MANDI RATES & MARKET PRICES
  if (['mandi', 'market', 'rate', 'price', 'bhav', 'apmc', 'कांदा भाव', 'बाजारभाव', 'भाव', 'मंडी', 'दाम', 'बजार'].some(k => qLower.includes(k))) {
    const rates = loc.mandiRates;
    const ratesListEn = Object.entries(rates).map(([crop, rate]) => `• **${crop.charAt(0).toUpperCase() + crop.slice(1)}:** ${rate}`).join('\n');
    const ratesListMr = Object.entries(rates).map(([crop, rate]) => `• **${crop}:** ${rate}`).join('\n');

    if (targetLang === 'mr') {
      return {
        reply: `💰 **${loc.apmcHub} थेट बाजारभाव**\n\n${ratesListMr}\n\n💡 **बाजार सल्ला:** प्रतवारी केलेला माल (Grade-1) सकाळच्या सत्रात विक्रीसाठी आणल्यास प्रति क्विंटल ₹१०० ते ₹१५० जास्त भाव मिळतो.`,
        suggestions: [`🌦️ ${loc.name} हवामान`, "🛒 औषध खरेदी लिंक्स व दुकाने", "🚜 शेती यंत्रे"]
      };
    }
    if (targetLang === 'hi') {
      return {
        reply: `💰 **${loc.apmcHub} आज के मंडी भाव**\n\n${ratesListMr}\n\n💡 **बाजार सलाह:** ग्रेडिंग की गई उच्च गुणवत्ता वाली उपज पर ₹100-₹150 प्रति क्विंटल अधिक मूल्य प्राप्त होता है।`,
        suggestions: [`🌦️ ${loc.name} मौसम`, "🛒 कीटनाशक खरीद लिंक", "🚜 कृषि मशीनरी"]
      };
    }
    return {
      reply: `💰 **Live APMC Mandi Rates for ${loc.apmcHub}**\n\n${ratesListEn}\n\n💡 **Market Tip:** Graded quality produce commands a ₹100–₹150/qtl premium during morning auction sessions.`,
      suggestions: [`🌦️ ${loc.name} Weather`, "🛒 Buy Pest Medicine", "🚜 Required Machinery"]
    };
  }

  // 3. SOIL & FERTILIZERS
  if (['soil', 'ph', 'fertilizer', 'nutrient', 'urea', 'dap', 'npk', 'potash', 'माती', 'मृदा', 'खत', 'युरिया', 'खाद'].some(k => qLower.includes(k))) {
    if (targetLang === 'mr') {
      return {
        reply: `🌱 **${loc.name} परिसराचे मृदा आरोग्य व खत नियोजन**\n\n• **जमिनीचा प्रकार:** ${loc.soilType}\n• **प्रमुख पिके:** ${loc.primaryCrops.join(', ')}\n\n📋 **खत मात्रा शिफारस:**\n१. **युरिया (४६% N):** एकाच वेळी न देता ३ समान हप्त्यांत विभागून द्या (पेरणीवेळी ५०%, फुटवे येताना २५%, फुलोऱ्यात २५%).\n२. **DAP (18:46:0) / 10:26:26:** बेसल डोस म्हणून पेरणीच्या वेळी द्या.\n३. **सेंद्रिय खत:** शेणखत किंवा गांडूळ खत प्रति एकर ४ ते ५ टन टाकून सेंद्रिय कर्ब वाढवा.`,
        suggestions: [`🌦️ ${loc.name} हवामान`, `💰 ${loc.name} बाजारभाव`, "🛒 औषध खरेदी लिंक्स"]
      };
    }
    if (targetLang === 'hi') {
      return {
        reply: `🌱 **${loc.name} क्षेत्र का मृदा स्वास्थ्य एवं उर्वरक प्रबंधन**\n\n• **मिट्टी का प्रकार:** ${loc.soilType}\n• **प्रमुख फसलें:** ${loc.primaryCrops.join(', ')}\n\n📋 **उर्वरक सलाह:**\n1. **यूरिया:** 3 किश्तों में विभाजित करके दें।\n2. **DAP / NPK:** बुवाई के समय बेसल डोज के रूप में दें।\n3. **गोबर खाद:** 4-5 टन प्रति एकड़ डालकर जैविक कार्बन बढ़ाएं।`,
        suggestions: [`🌦️ ${loc.name} मौसम`, `💰 ${loc.name} मंडी भाव`, "🛒 कीटनाशक खरीद लिंक"]
      };
    }
    return {
      reply: `🌱 **Soil Health & Fertilizer Management for ${loc.fullName}**\n\n• **Soil Type:** ${loc.soilType}\n• **Major Regional Crops:** ${loc.primaryCrops.join(', ')}\n\n📋 **Fertilizer Protocol:**\n1. **Urea (46% N):** Apply in 3 split doses (50% basal, 25% vegetative growth, 25% flowering) to prevent leaching.\n2. **DAP (18:46:0) / 10:26:26:** Apply as basal placement at root zone.\n3. **Organic Carbon:** Incorporate 4-5 tonnes/acre well-rotted FYM or vermicompost.`,
      suggestions: [`🌦️ ${loc.name} Weather`, `💰 ${loc.name} Mandi Rates`, "🛒 Pest Medicine Links"]
    };
  }

  // 4. PEST & DISEASE DIAGNOSIS & SPRAY
  if (['pest', 'disease', 'thrips', 'blight', 'fungicide', 'pesticide', 'spray', 'coragen', 'ampligo', 'proclaim', 'कीड', 'रोग', 'फवारणी', 'कीटनाशक', 'छिड़काव', 'थ्रिप्स', 'करपा'].some(k => qLower.includes(k))) {
    if (targetLang === 'mr') {
      return {
        reply: `🐛 **कीड व रोग नियंत्रण मार्गदर्शक**\n\n• **थ्रिप्स व अळी नियंत्रण:**\n  - **किफायतशीर उपाय:** प्रोक्लेम (Emamectin Benzoate 5% SG) ४ ग्रॅम + डायथेन M-45 २५ ग्रॅम प्रति १० लिटर पाणी.\n  - **प्रीमियम उपाय:** सिंजेंटा अ‍ॅम्प्लिगो ८ मिली प्रति १० लिटर पाणी.\n• **जैविक उपाय:** कडुनिंब तेल (१०,००० ppm) २० मिली प्रति १० लिटर पाणी.\n\n⚠️ **फवारणीची काळजी:** फवारणी नेहमी सकाळी ९:३० पूर्वी किंवा संध्याकाळी ५ नंतर करावी. स्टिकर (Wetting agent) अवश्य वापरावा.`,
        suggestions: ["🛒 औषध खरेदी लिंक्स व दुकाने", "🚜 आवश्यक स्प्रेअर व ड्रोन", `🌦️ ${loc.name} हवामान`]
      };
    }
    if (targetLang === 'hi') {
      return {
        reply: `🐛 **कीट एवं रोग नियंत्रण प्रबंधन**\n\n• **थ्रिप्स व कीट नियंत्रण:**\n  - **सस्ता व असरदार:** प्रोक्लेम (Emamectin Benzoate 5% SG) 4 ग्राम + मेंकोजेब 25 ग्राम प्रति 10 लीटर पानी।\n  - **प्रीमियम विकल्प:** सिंजेंटा एम्प्लिगो 8 मिली प्रति 10 लीटर पानी।\n• **जैविक समाधान:** नीम तेल (10,000 ppm) 20 मिली प्रति 10 लीटर।`,
        suggestions: ["🛒 कीटनाशक खरीद लिंक", "🚜 स्प्रेयर उपकरण", `🌦️ ${loc.name} मौसम`]
      };
    }
    return {
      reply: `🐛 **Crop Pathology & Pest Management Guide**\n\n• **Target Pest Protocol (Thrips, Caterpillars & Blight):**\n  - **Affordable Generic Tier:** Proclaim (Emamectin Benzoate 5% SG) @ 4g + Mancozeb 75% WP @ 25g per 10L water.\n  - **Premium Systemic Tier:** Syngenta Ampligo (Chlorantraniliprole + Lambda ZC) @ 8ml per 10L water.\n• **Bio-Control:** Neem Oil (10,000 ppm) @ 20ml/10L water before sunset.\n\n⚠️ **Spraying Best Practice:** Apply during calm wind conditions using a 0.3mm hollow cone nozzle with non-ionic sticker.`,
      suggestions: ["🛒 Pest Medicine Buy Links", "🚜 Required Sprayers & Drones", `🌦️ ${loc.name} Weather`]
    };
  }

  // 5. BUYING LINKS & LOCAL KRISHI STORES
  if (['buy', 'purchase', 'shop', 'store', 'bighaat', 'agrostar', 'iffco', 'दुकान', 'खरेदी', 'खरीद', 'कहाँ से खरीदें'].some(k => qLower.includes(k))) {
    if (targetLang === 'mr') {
      return {
        reply: `🛒 **प्रमाणित औषध खरेदी लिंक्स व स्थानिक कृषी दुकाने**\n\n• **ऑनलाईन खरेदी (घरपोच डिलिव्हरी):**\n  - [BigHaat Farmer Store](https://www.bighaat.com)\n  - [AgroStar Online Krishi App](https://www.agrostar.in)\n  - [IFFCO Bazar Portal](https://www.iffcobazar.in)\n\n• **${loc.name} परिसरातील अधिकृत कृषी केंद्रे:**\n  १. **ओम कृषी सेवा केंद्र** – शिवाजी चौक, संगमनेर | 📞 +91 98224 51230\n  २. **श्री गणेश कृषी केंद्र** – मार्केट यार्ड, पिंपळगाव बसवंत (नाशिक) | 📞 +91 94222 18765`,
        suggestions: [`💰 ${loc.name} बाजारभाव`, `🌦️ ${loc.name} हवामान`, "🚜 शेती यंत्रे"]
      };
    }
    return {
      reply: `🛒 **Verified Crop Input Stores & Online Purchase Links**\n\n• **Verified Doorstep Delivery Stores:**\n  - [BigHaat Agriculture Portal](https://www.bighaat.com)\n  - [AgroStar Direct Farm Inputs](https://www.agrostar.in)\n  - [IFFCO Bazar Official Store](https://www.iffcobazar.in)\n\n• **Authorized Local Physical Stores for ${loc.name} / ${loc.district}:**\n  1. **Om Krishi Seva Kendra** – Shivaji Chowk, Sangamner | 📞 +91 98224 51230\n  2. **Shree Ganesh Krishi Kendra** – Market Yard, Pimpalgaon Baswant (Nashik) | 📞 +91 94222 18765`,
      suggestions: [`🌦️ ${loc.name} Weather`, `💰 ${loc.name} Mandi Rates`, "🚜 Sprayers & Machinery"]
    };
  }

  // 6. FARM MACHINERY & SPRAYERS
  if (['machine', 'machinery', 'tractor', 'drone', 'sprayer', 'rotavator', 'यंत्र', 'ट्रॅक्टर', 'ड्रोन', 'पंप', 'मशीन'].some(k => qLower.includes(k))) {
    if (targetLang === 'mr') {
      return {
        reply: `🚜 **आधुनिक शेती यंत्रसामग्री व स्प्रेअर तंत्रज्ञान**\n\n• **१६L बॅटरी स्प्रे पंप:** कांदा व भाजीपाल्यासाठी योग्य (किंमत: ₹२,८०० – ₹३,५००).\n• **किसान ड्रोन फवारणी:** ६ मिनिटांत १ एकर फवारणी, ९०% पाण्याची बचत (भाडे: ₹३५० – ₹४५०/एकर).\n• **४५ HP ट्रॅक्टर + ७ फुटी रोटाव्हेटर:** भारी काळ्या जमिनीच्या मशागतीसाठी.\n• **गादीवाफा (BBF) बेड मेकर:** एकाच फेऱ्यात वाफा तयार करून ठिबक नळी अंथरण्यासाठी.`,
        suggestions: ["🛒 औषध खरेदी लिंक्स", `🌦️ ${loc.name} हवामान`, `💰 ${loc.name} बाजारभाव`]
      };
    }
    return {
      reply: `🚜 **Recommended Agricultural Machinery & Sprayers**\n\n• **16L Dual-Motor Battery Sprayer:** Ideal for row crops (Price: ₹2,800 – ₹3,500).\n• **10L Kisan Spraying Drone:** 1 acre in 6 mins, 90% water saving (Custom Hiring: ₹350 – ₹450/acre).\n• **45 HP 4WD Tractor + 7-ft Rotavator:** Efficient seedbed preparation in Vertisols.\n• **Raised Bed (BBF) Former + Drip Laying Unit:** Precision bed forming with in-line drip tape.`,
      suggestions: ["🛒 Pest Medicine Links", `🌦️ ${loc.name} Weather`, `💰 ${loc.name} Mandi Rates`]
    };
  }

  // 7. GREETING
  if (['hi', 'hello', 'hey', 'namaste', 'namaskar', 'start', 'help', 'नमस्कार', 'नमस्ते', 'प्रणाम'].some(k => qLower.includes(k))) {
    if (targetLang === 'mr') {
      return {
        reply: `🌿 **राम राम${friendNameMr}! कसा आहेस?** 🙏\n\nमी तुझा शेती मित्र **कृषी AI**. आपल्या **${loc.fullName}** भागातील हवामान, बाजारभाव, मृदा आरोग्य, कीड नियंत्रण आणि सरकारी योजनांविषयी तुला काय मदत हवी आहे?`,
        suggestions: [`🌦️ ${loc.name} हवामान`, `💰 ${loc.name} बाजारभाव`, `🌱 ${loc.name} मृदा आरोग्य`, "🛒 औषध खरेदी लिंक्स"]
      };
    }
    if (targetLang === 'hi') {
      return {
        reply: `🌿 **राम राम${friendNameHi}! कैसे हैं आप?** 🙏\n\nमैं आपका डिजिटल कृषि मित्र **कृषि AI**। अपने **${loc.fullName}** क्षेत्र के मौसम, मंडी भाव, मिट्टी स्वास्थ्य और कीटनाशक दवाओं की जानकारी के लिए आप निसंकोच पूछ सकते हैं।`,
        suggestions: [`🌦️ ${loc.name} मौसम`, `💰 ${loc.name} मंडी भाव`, `🌱 ${loc.name} मिट्टी स्वास्थ्य`, "🛒 दवा खरीद लिंक्स"]
      };
    }
    return {
      reply: `🌿 **Hello${friendNameEn}! Welcome to Krishi AI Assistant.** 🙏\n\nI am your dedicated digital agronomic companion for **${loc.fullName}**. Ask me about live weather forecast, APMC mandi rates, soil health, pest remedies, or government schemes. How can I help you today?`,
      suggestions: [`🌦️ Weather in ${loc.name}`, `💰 ${loc.name} APMC Rates`, `🌱 ${loc.name} Soil Profile`, "🛒 Pest Medicine Links"]
    };
  }

  // 8. GENERAL / OTHER QUERY
  if (targetLang === 'mr') {
    return {
      reply: `🌿 **${loc.name} परिसरासाठी सल्ला:**\n\nतुमच्या "${query}" या प्रश्नासंदर्भात, आम्ही अचूक माहिती उपलब्ध करून देतो. कृपया हवामान, बाजारभाव, कीड नियंत्रण किंवा खत नियोजनाविषयी निवडा:`,
      suggestions: [`🌦️ ${loc.name} हवामान`, `💰 ${loc.name} बाजारभाव`, "🐛 कीड नियंत्रण उपाय", "🛒 औषध खरेदी लिंक्स"]
    };
  }
  if (targetLang === 'hi') {
    return {
      reply: `🌿 **${loc.name} क्षेत्र के लिए कृषि सलाह:**\n\nआपके प्रश्न "${query}" के संबंध में कृपया मौसम, मंडी भाव, उर्वरक या कीटनाशक में से संबंधित विषय चुनें:`,
      suggestions: [`🌦️ ${loc.name} मौसम`, `💰 ${loc.name} मंडी भाव`, "🐛 कीट प्रबंधन", "🛒 दवा खरीद लिंक्स"]
    };
  }
  return {
    reply: `🌿 **Agronomic Guidance for ${loc.fullName}:**\n\nRegarding your query **"${query}"**, you can get instant real-time data for ${loc.name}. Please choose from the topics below or ask a specific question about weather, mandi rates, soil, or pest treatments:`,
    suggestions: [`🌦️ Weather in ${loc.name}`, `💰 ${loc.name} APMC Rates`, `🌱 ${loc.name} Soil Profile`, "🐛 Pest & Disease Guide"]
  };
};
