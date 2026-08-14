import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Brand
    brandName: "Krishi Samadhan",
    tagline: "Smarter Decisions. Better Agriculture.",
    heroTitle1: "Smarter Decisions.",
    heroTitle2: "Better Agriculture.",
    heroSubtitle: "A unified platform connecting weather, soil, satellite, crop, market and agricultural information to support better agricultural decision-making.",
    explorePlatform: "Explore Platform",
    learnMore: "Learn More",
    activeStream: "Active Stream",
    monitoringLocality: "Monitoring Locality",

    // Navigation
    home: "Home",
    features: "Features",
    howItWorks: "How It Works",
    dashboard: "Dashboard",
    login: "Login",
    register: "Register",
    logout: "Logout",
    backToHome: "Back to Home",
    locality: "Locality",

    // Dashboard Sidebar Items
    overview: "Overview",
    gisDashboard: "GIS Dashboard",
    weatherMonitoring: "Weather Monitoring",
    satelliteMonitoring: "Satellite Monitoring",
    soilHealth: "Soil Health",
    pestSurveillance: "AI Pest Surveillance",
    govSchemes: "Government Schemes",
    marketIntelligence: "Market Intelligence",
    farmerAdvisory: "Farmer Advisory",

    // Common Metrics & Actions
    temperature: "Temperature",
    soilMoisture: "Soil Moisture",
    cropHealth: "Crop Health",
    search: "Search",
    filter: "Filter",
    status: "Status",
    highPriority: "High Priority",
    moderatePriority: "Moderate Priority",
    lowPriority: "Low Priority",
    recommendation: "Agronomic Recommendation",
    refresh: "Refresh",
    applyNow: "Visit Portal",

    // Chatbot
    chatTitle: "Krishi AI Assistant",
    chatSubtitle: "Active Decision Support",
    chatPlaceholder: "Ask about weather, soil, pests, rates...",
    chatLauncher: "Ask Krishi AI",
    chatGreeting: "Namaste! 🙏 I am Krishi AI, your Krishi Samadhan decision assistant. Ask me anything about weather, soil nutrients, pest treatments, mandi rates, or government schemes!",

    // Quick Suggestions
    sugWeather: "🌦️ Local Weather",
    sugSoil: "🌱 Soil Fertilizer Guide",
    sugPest: "🐛 Pest Solution",
    sugMandi: "💰 Mandi Rates",
    sugSchemes: "🏛️ PM-Kisan Scheme"
  },

  mr: {
    // Brand
    brandName: "कृषी समाधान",
    tagline: "हुशार निर्णय. समृद्ध शेती.",
    heroTitle1: "अचूक निर्णय.",
    heroTitle2: "समृद्ध शेती.",
    heroSubtitle: "हवामान, माती, उपग्रह, पीक, बाजारभाव आणि सरकारी योजनांची माहिती एकाच छताखाली देणारे कृषी निर्णय व्यासपीठ.",
    explorePlatform: "प्लॅटफॉर्म पहा",
    learnMore: "अधिक माहिती",
    activeStream: "सक्रिय प्रवाह",
    monitoringLocality: "स्थान निरीक्षण",

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

    // Common Metrics & Actions
    temperature: "तापमान",
    soilMoisture: "मातीतील ओलावा",
    cropHealth: "पिकांचे आरोग्य",
    search: "शोधा",
    filter: "फिल्टर करा",
    status: "स्थिती",
    highPriority: "तातडीचा सल्ला",
    moderatePriority: "मध्यम प्राधान्य",
    lowPriority: "सामान्य सल्ला",
    recommendation: "कृषी तज्ज्ञांचा सल्ला",
    refresh: "ताजे करा",
    applyNow: "अधिकृत पोर्टल",

    // Chatbot
    chatTitle: "कृषी एआय सहाय्यक",
    chatSubtitle: "सक्रिय कृषी सल्लागार",
    chatPlaceholder: "हवामान, खते, कीड किंवा बाजारभावाबद्दल विचारा...",
    chatLauncher: "कृषी AI ला विचारा",
    chatGreeting: "नमस्कार! 🙏 मी कृषी एआय, आपला कृषी समाधान सहाय्यक आहे. हवामान, मातीचे आरोग्य, खतांचे प्रमाण, कीड नियंत्रण किंवा बाजारभावाबद्दल काहीही विचारा!",

    // Quick Suggestions
    sugWeather: "🌦️ स्थानिक हवामान",
    sugSoil: "🌱 खत व माती मार्गदर्शन",
    sugPest: "🐛 कीड नियंत्रण उपाय",
    sugMandi: "💰 आजचे बाजारभाव",
    sugSchemes: "🏛️ पीएम-किसान योजना"
  },

  hi: {
    // Brand
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
    register: "रजिस्टर करें",
    logout: "लॉग आउट",
    backToHome: "होम पर वापस जाएं",
    locality: "स्थान",

    // Dashboard Sidebar Items
    overview: "अवलोकन",
    gisDashboard: "जीआईएस डैशबोर्ड",
    weatherMonitoring: "मौसम निगरानी",
    satelliteMonitoring: "उपग्रह निगरानी",
    soilHealth: "मृदा स्वास्थ्य (मिट्टी)",
    pestSurveillance: "एआई कीट व रोग निदान",
    govSchemes: "सरकारी योजनाएं",
    marketIntelligence: "मंडी भाव",
    farmerAdvisory: "किसान सलाह",

    // Common Metrics & Actions
    temperature: "तापमान",
    soilMoisture: "मिट्टी की नमी",
    cropHealth: "फसल स्वास्थ्य",
    search: "खोजें",
    filter: "फ़िल्टर",
    status: "स्थिति",
    highPriority: "उच्च प्राथमिकता",
    moderatePriority: "मध्यम प्राथमिकता",
    lowPriority: "सामान्य सलाह",
    recommendation: "कृषि वैज्ञानिक सिफारिश",
    refresh: "रिफ्रेश",
    applyNow: "आधिकारिक पोर्टल",

    // Chatbot
    chatTitle: "कृषि एआई सहायक",
    chatSubtitle: "सक्रिय निर्णय सहायता",
    chatPlaceholder: "मौसम, खाद, कीट या मंडी भाव के बारे में पूछें...",
    chatLauncher: "कृषि AI से पूछें",
    chatGreeting: "नमस्ते! 🙏 मैं कृषि एआई हूँ, आपका कृषि समाधान सहायक। मौसम, खाद, कीट नियंत्रण, मंडी भाव या सरकारी योजनाओं के बारे में कुछ भी पूछें!",

    // Quick Suggestions
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
