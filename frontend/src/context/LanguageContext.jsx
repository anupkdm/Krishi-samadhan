import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Brand & Global
    brandName: "Krishi Samadhan",
    tagline: "Smarter Decisions. Better Agriculture.",
    heroTitle1: "Smarter Decisions.",
    heroTitle2: "Better Agriculture.",
    heroSubtitle: "A unified agricultural platform connecting real-time weather, soil diagnostics, satellite NDVI, crop health, APMC mandi rates, and government schemes to empower farmer decisions.",
    explorePlatform: "Explore Platform",
    learnMore: "Learn More",
    activeStream: "Active Stream",
    monitoringLocality: "Monitoring Locality",

    // Navigation
    home: "Home",
    features: "Features",
    howItWorks: "How It Works",
    dashboard: "Dashboard",
    login: "Sign In",
    register: "Create Account",
    logout: "Sign Out",
    backToHome: "Back to Home",
    locality: "Locality",
    profile: "Profile",

    // Dashboard Sidebar Items
    overview: "Overview",
    gisDashboard: "GIS Spatial Map",
    weatherMonitoring: "Weather Monitoring",
    satelliteMonitoring: "Satellite Monitoring",
    soilHealth: "Soil Health & Nutrients",
    pestSurveillance: "AI Pest Surveillance",
    govSchemes: "Government Schemes",
    marketIntelligence: "Market Intelligence",
    farmerAdvisory: "Farmer Advisory",

    // Page Titles & Descriptions
    dashTitle: "Unified Agriculture Dashboard",
    dashDesc: "Real-time telemetry and decision support for",
    weatherTitle: "Weather Monitoring",
    weatherDesc: "Real-time micrometeorology and 7-day agricultural forecasts for",
    soilTitle: "Soil Health & Nutrients",
    soilDesc: "Soil chemistry, macronutrients (NPK), moisture profile, and conditioning for",
    advisoryTitle: "Farmer Advisory & Decision Support",
    advisoryDesc: "Integrated multi-source intelligence converting telemetry into actionable agronomic decisions for",
    gisTitle: "GIS & Spatial Intelligence Dashboard",
    gisDesc: "Interactive agricultural mapping, spatial layers, and field telemetry for",
    satelliteTitle: "Satellite Monitoring & Vegetation Indices",
    satelliteDesc: "Multispectral telemetry, Normalized Difference Vegetation Index (NDVI), and canopy health for",
    pestTitle: "AI Crop Pest Surveillance & Pathology",
    pestDesc: "Deep learning crop image analysis for real-time disease detection and treatment plans.",
    schemesTitle: "Government Agricultural Schemes",
    schemesDesc: "Verified Central and Maharashtra State agricultural support programs, financial subsidies, and credit facilities.",
    marketTitle: "Market Intelligence & Agri Input Store",
    marketDesc: "Real-time APMC mandi commodity prices, nearby shop comparisons, and input price tracking.",

    // Weather & Metrics
    ambientConditions: "Current Ambient Conditions",
    humidity: "Relative Humidity",
    windSpeed: "Wind Speed",
    precipitation: "Precipitation",
    weatherCode: "Weather Code",
    synopticForecast: "7-Day Agricultural Synoptic Forecast",
    weatherSignals: "Automated Agricultural Weather Signals",
    sprayFavorable: "Spray Favorable: Wind speeds are gentle and no precipitation expected.",
    sprayWarning: "Spray Warning: High winds or rain detected, defer chemical spraying.",
    irrigationRecommended: "Irrigation Recommended: Low precipitation in past 24 hours.",
    soilMoistureSufficient: "Soil Moisture Sufficient: Defer heavy irrigation.",

    // Soil
    soilIndex: "Overall Soil Health Index",
    soilClassification: "Soil Classification",
    physicalProperties: "💧 Physical Properties",
    chemicalProperties: "⚗️ Chemical Properties",
    primaryNutrients: "🧪 Primary Nutrients (NPK)",
    organicCarbon: "Organic Carbon (SOC)",
    soilRecommendations: "Agronomic Soil Health Recommendations",
    nitrogen: "Nitrogen (Available N)",
    phosphorus: "Phosphorus (Available P)",
    potassium: "Potassium (Available K)",
    phLevel: "Soil pH Level",

    // Market & Store
    apmcRates: "APMC Mandi Rates",
    inputStore: "Agri Input Store",
    fertilizers: "Fertilizers",
    seeds: "Seeds",
    pesticides: "Pesticides",
    priceComparison: "Shop Price Comparison",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    modalPrice: "Modal / Avg Price",

    // Advisories
    activeAdvisories: "Active Farm Advisories",
    rerunEngine: "🔄 Re-Run Advisory Engine",
    synthesizing: "⚙️ Synthesizing Rules...",
    highPriority: "High Priority",
    mediumPriority: "Medium Priority",
    lowPriority: "Low Priority",

    // Schemes
    searchSchemes: "Search by scheme name or benefit (e.g. Kisan, Solar, Drip, Tractor)...",
    allCategories: "All Categories",
    visitPortal: "Visit Portal ↗",
    benefits: "Benefits",
    eligibility: "Eligibility",

    // Pest
    uploadPhoto: "Upload Crop Leaf Photo",
    analyzeImage: "🔍 Analyze Leaf Pathology",
    pestDiagnosis: "AI Diagnostic Result",
    severity: "Severity Level",
    treatmentPlan: "Prescribed Treatment Plan",

    // Common
    temperature: "Temperature",
    soilMoisture: "Soil Moisture",
    cropHealth: "Crop Health",
    search: "Search",
    filter: "Filter",
    status: "Status",
    refresh: "Refresh",
    applyNow: "Visit Portal",
    loadingMsg: "Loading data...",
    retry: "Try Again",

    // Chatbot
    chatTitle: "Krishi AI Assistant",
    chatSubtitle: "Active Decision Support",
    chatPlaceholder: "Ask in English, मराठी or हिंदी...",
    chatLauncher: "Ask Krishi AI",
    chatGreeting: "Namaste! 🙏 I am Krishi AI, your Krishi Samadhan decision assistant. Ask me anything about weather, soil nutrients, pest treatments, mandi rates, or government schemes!",
    sugWeather: "🌦️ Local Weather",
    sugSoil: "🌱 Soil Fertilizer Guide",
    sugPest: "🐛 Pest Solution",
    sugMandi: "💰 Mandi Rates",
    sugSchemes: "🏛️ PM-Kisan Scheme"
  },

  mr: {
    // Brand & Global
    brandName: "कृषी समाधान",
    tagline: "हुशार निर्णय. समृद्ध शेती.",
    heroTitle1: "अचूक निर्णय.",
    heroTitle2: "समृद्ध शेती.",
    heroSubtitle: "हवामान, माती, उपग्रह, पीक, बाजारभाव आणि सरकारी योजनांची माहिती एकाच छताखाली देणारे सर्वसमावेशक कृषी निर्णय व्यासपीठ.",
    explorePlatform: "प्लॅटफॉर्म पहा",
    learnMore: "अधिक माहिती",
    activeStream: "थेट प्रवाह",
    monitoringLocality: "शेत परिसर",

    // Navigation
    home: "मुख्यपृष्ठ",
    features: "वैशिष्ट्ये",
    howItWorks: "कसे कार्य करते",
    dashboard: "डॅशबोर्ड",
    login: "लॉगिन करा",
    register: "नोंदणी करा",
    logout: "लॉगआउट",
    backToHome: "मुख्यपृष्ठावर जा",
    locality: "स्थान",
    profile: "माझे प्रोफाईल",

    // Dashboard Sidebar Items
    overview: "विहंगावलोकन",
    gisDashboard: "जीआयएस नकाशा",
    weatherMonitoring: "हवामान अंदाज",
    satelliteMonitoring: "उपग्रह निरीक्षण",
    soilHealth: "माती आरोग्य (मृदा)",
    pestSurveillance: "एआय कीड व रोग निदान",
    govSchemes: "शासकीय योजना",
    marketIntelligence: "बाजारभाव (मंडी)",
    farmerAdvisory: "शेतकरी सल्ला",

    // Page Titles & Descriptions
    dashTitle: "एकीकृत कृषी डॅशबोर्ड",
    dashDesc: "थेट माहिती व निर्णय समर्थन —",
    weatherTitle: "हवामान निरीक्षण व अंदाज",
    weatherDesc: "थेट स्थानिक हवामान आणि ७ दिवसांचा कृषी अंदाज —",
    soilTitle: "माती आरोग्य व अन्नद्रव्ये",
    soilDesc: "मातीची रासायनिक स्थिती, NPK पोषण, ओलावा आणि खत नियोजन —",
    advisoryTitle: "शेतकरी सल्ला व निर्णय सहाय्य",
    advisoryDesc: "हवामान, माती आणि बाजारभावानुसार तयार केलेला कृषी तज्ज्ञ सल्ला —",
    gisTitle: "जीआयएस व नकाशा प्रणाली",
    gisDesc: "स्थानिक शेतीचे उपग्रह नकाशे आणि जमिनीची माहिती —",
    satelliteTitle: "उपग्रह निरीक्षण व पीक निर्देशांक",
    satelliteDesc: "Sentinel-2 उपग्रहाद्वारे NDVI पीक आरोग्य आणि ओलावा निर्देशांक —",
    pestTitle: "एआय कीड व रोग निदान",
    pestDesc: "झाडाच्या पानाचा फोटो काढून तात्काळ रोग निदान व औषध फवारणी उपाय मिळवा.",
    schemesTitle: "शासकीय कृषी योजना व सबसिडी",
    schemesDesc: "केंद्र व महाराष्ट्र शासनाच्या सर्व अनुदान, पीक विमा व कर्ज योजनांची माहिती.",
    marketTitle: "बाजारभाव व कृषी सेवा केंद्र दर",
    marketDesc: "थेट कृषी उत्पन्न बाजार समिती भाव आणि खते, बियाणे, औषधांचे दर.",

    // Weather & Metrics
    ambientConditions: "सद्य परिस्थिती",
    humidity: "हवेतील आर्द्रता",
    windSpeed: "वाऱ्याचा वेग",
    precipitation: "पडलेला पाऊस",
    weatherCode: "हवामान कोड",
    synopticForecast: "📅 पुढील ७ दिवसांचा कृषी हवामान अंदाज",
    weatherSignals: "⚠️ स्वयंचलित कृषी हवामान संकेत",
    sprayFavorable: "✅ फवारणीस अनुकूल: वारा मंद असून पावसाची शक्यता नाही.",
    sprayWarning: "⚠️ फवारणी टाळा: जोरदार वारे किंवा पावसाचा अंदाज.",
    irrigationRecommended: "💧 पाणी देणे आवश्यक: गेल्या २४ तासांत पाऊस नाही.",
    soilMoistureSufficient: "✅ मातीत पुरेसा ओलावा: अति सिंचन टाळा.",

    // Soil
    soilIndex: "एकूण माती आरोग्य निर्देशांक",
    soilClassification: "जमिनीचा प्रकार",
    physicalProperties: "💧 भौतिक गुणधर्म",
    chemicalProperties: "⚗️ रासायनिक गुणधर्म",
    primaryNutrients: "🧪 मुख्य अन्नद्रव्ये (NPK)",
    organicCarbon: "सेंद्रिय कर्ब (SOC)",
    soilRecommendations: "💡 कृषी तज्ज्ञांचा माती सुधारणा सल्ला",
    nitrogen: "उपलब्ध नत्र (N)",
    phosphorus: "उपलब्ध स्फुरद (P)",
    potassium: "उपलब्ध पालाश (K)",
    phLevel: "सामू (pH)",

    // Market & Store
    apmcRates: "बाजार समिती (मंडी) दर",
    inputStore: "कृषी इनपुट केंद्र",
    fertilizers: "खते",
    seeds: "बियाणे",
    pesticides: "कीटकनाशके",
    priceComparison: "दुकान दर तुलना",
    minPrice: "किमान दर",
    maxPrice: "कमाल दर",
    modalPrice: "सरासरी दर",

    // Advisories
    activeAdvisories: "सक्रिय शेती सल्ले",
    rerunEngine: "🔄 सल्ले अद्यतनित करा",
    synthesizing: "⚙️ विश्लेषण सुरू आहे...",
    highPriority: "तातडीचा सल्ला",
    mediumPriority: "मध्यम प्राधान्य",
    lowPriority: "सामान्य सल्ला",

    // Schemes
    searchSchemes: "योजना किंवा लाभाचे नाव शोधा (उदा. किसान, सौर, ठिबक, ट्रॅक्टर)...",
    allCategories: "सर्व वर्गवारी",
    visitPortal: "अधिकृत पोर्टल ↗",
    benefits: "योजनेचे लाभ",
    eligibility: "पात्रता निकष",

    // Pest
    uploadPhoto: "पानाचा फोटो अपलोड करा",
    analyzeImage: "🔍 रोग निदान करा",
    pestDiagnosis: "एआय निदान निकाल",
    severity: "तीव्रता",
    treatmentPlan: "उपाययोजना व फवारणी",

    // Common
    temperature: "तापमान",
    soilMoisture: "मातीतील ओलावा",
    cropHealth: "पिकांचे आरोग्य",
    search: "शोधा",
    filter: "फिल्टर",
    status: "स्थिती",
    refresh: "ताजे करा",
    applyNow: "अधिकृत पोर्टल",
    loadingMsg: "माहिती लोड होत आहे...",
    retry: "पुन्हा प्रयत्न करा",

    // Chatbot
    chatTitle: "कृषी AI सहाय्यक",
    chatSubtitle: "सक्रिय कृषी सल्लागार",
    chatPlaceholder: "मराठी, हिंदी किंवा इंग्रजीत विचारा...",
    chatLauncher: "कृषी AI ला विचारा",
    chatGreeting: "नमस्कार! 🙏 मी कृषी AI, आपला कृषी समाधान सहाय्यक आहे. हवामान, मातीचे आरोग्य, खतांचे प्रमाण, कीड नियंत्रण किंवा बाजारभावाबद्दल काहीही विचारा!",
    sugWeather: "🌦️ स्थानिक हवामान",
    sugSoil: "🌱 खत व माती मार्गदर्शन",
    sugPest: "🐛 कीड नियंत्रण उपाय",
    sugMandi: "💰 आजचे बाजारभाव",
    sugSchemes: "🏛️ नमो शेतकरी योजना"
  },

  hi: {
    // Brand & Global
    brandName: "कृषि समाधान",
    tagline: "सटीक निर्णय. बेहतर कृषि.",
    heroTitle1: "सटीक निर्णय.",
    heroTitle2: "बेहतर कृषि.",
    heroSubtitle: "मौसम, मिट्टी, उपग्रह, फसल, मंडी भाव और सरकारी योजनाओं की जानकारी को एक साथ जोड़ने वाला एकीकृत कृषि मंच।",
    explorePlatform: "मंच देखें",
    learnMore: "और जानें",
    activeStream: "सक्रिय स्ट्रीम",
    monitoringLocality: "निगरानी क्षेत्र",

    // Navigation
    home: "होम",
    features: "विशेषताएं",
    howItWorks: "यह कैसे काम करता है",
    dashboard: "डैशबोर्ड",
    login: "लॉग इन",
    register: "खाता बनाएं",
    logout: "लॉग आउट",
    backToHome: "होम पर वापस जाएं",
    locality: "स्थान",
    profile: "मेरी प्रोफ़ाइल",

    // Dashboard Sidebar Items
    overview: "अवलोकन",
    gisDashboard: "जीआईएस मानचित्र",
    weatherMonitoring: "मौसम निगरानी",
    satelliteMonitoring: "उपग्रह निगरानी",
    soilHealth: "मृदा स्वास्थ्य (मिट्टी)",
    pestSurveillance: "एआई कीट व रोग निदान",
    govSchemes: "सरकारी योजनाएं",
    marketIntelligence: "मंडी भाव",
    farmerAdvisory: "किसान सलाह",

    // Page Titles & Descriptions
    dashTitle: "एकीकृत कृषि डैशबोर्ड",
    dashDesc: "लाइव डेटा और निर्णय सहायता —",
    weatherTitle: "मौसम निगरानी एवं पूर्वानुमान",
    weatherDesc: "वास्तविक समय मौसम और 7-दिवसीय कृषि पूर्वानुमान —",
    soilTitle: "मृदा स्वास्थ्य एवं पोषण प्रबंधन",
    soilDesc: "मिट्टी की रसायन, NPK पोषक तत्व, नमी और खाद अनुशंसाएं —",
    advisoryTitle: "किसान सलाह एवं निर्णय सहायता",
    advisoryDesc: "मौसम, मिट्टी और मंडी भाव के आधार पर कृषि वैज्ञानिकों की सलाह —",
    gisTitle: "जीआईएस एवं स्थानिक मानचित्र",
    gisDesc: "खेतों का सैटेलाइट नक्शा और भू-स्थानिक डेटा —",
    satelliteTitle: "उपग्रह निगरानी एवं फसल सूचकांक",
    satelliteDesc: "Sentinel-2 उपग्रह द्वारा NDVI फसल स्वास्थ्य और नमी सूचकांक —",
    pestTitle: "एआई फसल कीट एवं रोग पहचान",
    pestDesc: "पत्ती की तस्वीर खींचकर तुरंत रोग पहचान और सटीक उपचार योजना पाएं।",
    schemesTitle: "सरकारी कृषि योजनाएं एवं सब्सिडी",
    schemesDesc: "केंद्र एवं राज्य सरकार की सभी सब्सिडी, बीमा और ऋण योजनाओं की जानकारी।",
    marketTitle: "मंडी भाव एवं कृषि स्टोर दरें",
    marketDesc: "लाइव APMC मंडी भाव एवं खाद, बीज, कीटनाशक दुकानों के रेट।",

    // Weather & Metrics
    ambientConditions: "वर्तमान मौसम स्थिति",
    humidity: "सापेक्ष आर्द्रता",
    windSpeed: "हवा की गति",
    precipitation: "वर्षा मात्रा",
    weatherCode: "मौसम कोड",
    synopticForecast: "📅 7-दिवसीय कृषि मौसम पूर्वानुमान",
    weatherSignals: "⚠️ स्वचालित कृषि मौसम संकेत",
    sprayFavorable: "✅ छिड़काव के लिए अनुकूल: शांत हवा और बारिश की संभावना नहीं।",
    sprayWarning: "⚠️ छिड़काव टालें: तेज हवा या बारिश की चेतावनी।",
    irrigationRecommended: "💧 सिंचाई की सिफारिश: पिछले 24 घंटों में बारिश नहीं हुई।",
    soilMoistureSufficient: "✅ मिट्टी में पर्याप्त नमी: अतिरिक्त सिंचाई न करें।",

    // Soil
    soilIndex: "समग्र मृदा स्वास्थ्य सूचकांक",
    soilClassification: "मिट्टी का वर्गीकरण",
    physicalProperties: "💧 भौतिक गुण",
    chemicalProperties: "⚗️ रासायनिक गुण",
    primaryNutrients: "🧪 मुख्य पोषक तत्व (NPK)",
    organicCarbon: "जैविक कार्बन (SOC)",
    soilRecommendations: "💡 कृषि वैज्ञानिक मृदा सुधार सिफारिशें",
    nitrogen: "उपलब्ध नाइट्रोजन (N)",
    phosphorus: "उपलब्ध फास्फोरस (P)",
    potassium: "उपलब्ध पोटाश (K)",
    phLevel: "पीएच मान (pH)",

    // Market & Store
    apmcRates: "मंडी (APMC) भाव",
    inputStore: "कृषि इनपुट स्टोर",
    fertilizers: "खाद/उर्वरक",
    seeds: "बीज",
    pesticides: "कीटनाशक",
    priceComparison: "दुकान मूल्य तुलना",
    minPrice: "न्यूनतम भाव",
    maxPrice: "अधिकतम भाव",
    modalPrice: "औसत / मॉडल भाव",

    // Advisories
    activeAdvisories: "सक्रिय किसान सलाह",
    rerunEngine: "🔄 सलाह अपडेट करें",
    synthesizing: "⚙️ विश्लेषण जारी है...",
    highPriority: "उच्च प्राथमिकता",
    mediumPriority: "मध्यम प्राथमिकता",
    lowPriority: "सामान्य सलाह",

    // Schemes
    searchSchemes: "योजना या लाभ का नाम खोजें (जैसे किसान, सोलर, ड्रिप, ट्रैक्टर)...",
    allCategories: "सभी श्रेणियां",
    visitPortal: "आधिकारिक पोर्टल ↗",
    benefits: "योजना के लाभ",
    eligibility: "पात्रता",

    // Pest
    uploadPhoto: "पत्ती की तस्वीर अपलोड करें",
    analyzeImage: "🔍 रोग की जांच करें",
    pestDiagnosis: "एआई जांच परिणाम",
    severity: "गंभीरता",
    treatmentPlan: "सटीक उपचार योजना",

    // Common
    temperature: "तापमान",
    soilMoisture: "मिट्टी की नमी",
    cropHealth: "फसल स्वास्थ्य",
    search: "खोजें",
    filter: "फ़िल्टर",
    status: "स्थिति",
    refresh: "रिफ्रेश",
    applyNow: "आधिकारिक पोर्टल",
    loadingMsg: "डेटा लोड हो रहा है...",
    retry: "पुनः प्रयास करें",

    // Chatbot
    chatTitle: "कृषि AI सहायक",
    chatSubtitle: "सक्रिय निर्णय सहायता",
    chatPlaceholder: "हिंदी, मराठी या अंग्रेजी में पूछें...",
    chatLauncher: "कृषि AI से पूछें",
    chatGreeting: "नमस्ते! 🙏 मैं कृषि AI हूँ, आपका कृषि समाधान सहायक। मौसम, खाद, कीट नियंत्रण, मंडी भाव या सरकारी योजनाओं के बारे में कुछ भी पूछें!",
    sugWeather: "🌦️ आज का मौसम",
    sugSoil: "🌱 खाद और मिट्टी सलाह",
    sugPest: "🐛 कीट नियंत्रण उपाय",
    sugMandi: "💰 आज का मंडी भाव",
    sugSchemes: "🏛️ पीएम किसान योजना"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('agri_lang') || 'en';
  });

  const setLanguage = (lang) => {
    if (['en', 'mr', 'hi'].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('agri_lang', lang);
    }
  };

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
