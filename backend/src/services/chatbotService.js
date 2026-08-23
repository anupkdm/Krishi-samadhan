const weatherService = require('./weatherService');
const soilService = require('./soilService');
const marketService = require('./marketService');
const schemesService = require('./schemesService');

// Comprehensive Regional Topological Database
const TOPOLOGY_DATABASE = {
  "sangamner": {
    regionName: "Sangamner / Ahmednagar (Pravara River Basin)",
    shortName: "Sangamner / Pravara Basin",
    topography: "Western Ghats rain-shadow plateau, Pravara River alluvium",
    soilType: "Deep Vertisol (Black Cotton Soil, 55% Montmorillonite Clay, pH 7.8)",
    groundwater: "140 - 180 ft depth, Godavari Left Bank Canal command area",
    majorCrops: ["Onion (Rangada/Garva)", "Pomegranate (Bhagwa)", "Sugarcane (Co 86032)", "Soybean", "Table Grapes"],
    apmcHub: "Sangamner APMC & Kopargaon Sub-Yard",
    modalPrices: {
      onion: "₹2,750 – ₹2,840/qtl",
      soybean: "₹4,750 – ₹4,820/qtl",
      pomegranate: "₹115 – ₹150/kg",
      sugarcane: "₹3,150/tonne (FRP Rate)"
    }
  },
  "nashik": {
    regionName: "Nashik / Lasalgaon (Upper Godavari Basin)",
    shortName: "Nashik / Lasalgaon Belt",
    topography: "Godavari Valley & Girna Basin, 560m elevation, temperate winter",
    soilType: "Medium Black Alluvial & Red Sandy Loam, pH 7.4",
    groundwater: "80 - 120 ft depth, Gangapur & Darna Dam network",
    majorCrops: ["Table Grapes (Thompson/Sonaka)", "Onion (Lasalgaon)", "Tomato", "Capsicum"],
    apmcHub: "Lasalgaon APMC (Asia's Largest Onion Market) & Pimpalgaon Baswant",
    modalPrices: {
      onion: "₹2,820 – ₹2,950/qtl",
      tomato: "₹1,900 – ₹2,200/qtl",
      grapes: "₹85 – ₹120/kg"
    }
  },
  "pune": {
    regionName: "Pune / Baramati (Bhima-Nira Basin)",
    shortName: "Pune / Baramati Belt",
    topography: "Deccan Trap Plateau, 570m elevation, Nira Left Bank Canal",
    soilType: "Medium to Deep Black Clay, pH 7.6",
    groundwater: "100 - 150 ft depth, Nira Deoghar & Veer Canal Network",
    majorCrops: ["Sugarcane", "Pomegranate", "Floriculture (Roses/Gerbera)", "Vegetables"],
    apmcHub: "Pune Gultekdi APMC & Baramati Market Yard",
    modalPrices: {
      sugarcane: "₹3,200/tonne",
      onion: "₹2,700 – ₹2,800/qtl",
      tomato: "₹1,850 – ₹2,150/qtl"
    }
  }
};

exports.processMessage = async (message, context = {}) => {
  const { location = {}, language = 'en', user = null } = context;
  const lat = location.latitude || 19.8833;
  const lon = location.longitude || 74.4833;
  const locName = (location.name || 'sangamner').toLowerCase();

  let matchedKey = 'sangamner';
  for (const key of Object.keys(TOPOLOGY_DATABASE)) {
    if (locName.includes(key) || (location.district && location.district.toLowerCase().includes(key))) {
      matchedKey = key;
      break;
    }
  }
  const topo = TOPOLOGY_DATABASE[matchedKey];
  const query = (message || '').toLowerCase().trim();

  const friendName = user?.name ? ` ${user.name}` : ' मित्रा';
  const friendNameHi = user?.name ? ` ${user.name}` : ' भाई';
  const friendNameEn = user?.name ? ` ${user.name}` : ' my friend';

  // 1. PRODUCT BUYING LINKS, SHOP ADDRESSES & BUDGET TIERS
  if (['buy', 'purchase', 'shop', 'store', 'price', 'product', 'medicine', 'pesticide', 'fungicide', 'coragen', 'ampligo', 'proclaim', 'bighaat', 'agrostar', 'iffco', 'amazon', 'दुकान', 'औषध', 'खरेदी', 'किंमत', 'दुकानदार', 'पत्ता', 'लिंक', 'दवा', 'कीटनाशक', 'खरीद', 'दाम', 'सस्ती', 'महंगी'].some(k => query.includes(k))) {
    if (language === 'mr') {
      return {
        reply: `🛒 **प्रमाणित कीटकनाशके, खरेदी लिंक्स व स्थानिक कृषी केंद्रांचे पत्ते**\n\nमित्रा, तुझ्या पिकासाठी **कमी खर्चाच्या (Affordable) ते उच्च दर्जाच्या (Premium)** औषधांची संपूर्ण माहिती, ऑनलाईन खरेदी लिंक्स आणि स्थानिक दुकानांचे पत्ते खालीलप्रमाणे आहेत:\n\n---\n\n### 🌟 १. उच्च दर्जाची व जलद परिणामकारक औषधे (Premium / Fast Knockdown)\n• **सिंजेंटा अ‍ॅम्प्लिगो / अलिका (Chlorantraniliprole 9.3% + Lambda 4.6% ZC)**\n  - **किंमत:** ₹८५० ते ₹९२० (१०० मिली) | एकरी खर्च: ~₹६८०\n  - **खरेदी लिंक्स:**\n    - [BigHaat: अ‍ॅम्प्लिगो खरेदी करा](https://www.bighaat.com/products/ampligo-insecticide)\n    - [AgroStar: अ‍ॅम्प्लिगो ऑर्डर करा](https://www.agrostar.in/product/ampligo-insecticide)\n\n• **FMC कोराजन (Coragen - Chlorantraniliprole 18.5% SC)**\n  - **किंमत:** ₹१,७५० ते ₹१,८९० (१५० मिली) | एकरी खर्च: ~₹७०० (६० मिली/एकर)\n  - [BigHaat: कोराजन खरेदी करा](https://www.bighaat.com/products/coragen-insecticide)\n\n---\n\n### 💰 २. सर्वात किफायतशीर व कमी खर्चाची औषधे (Best Value / Low Cost)\n• **प्रोक्लेम (Emamectin Benzoate 5% SG) + डायथेन M-45 (Mancozeb 75% WP)**\n  - **किंमत:** ₹३८० (१०० ग्रॅम) + ₹२६० (५०० ग्रॅम) = **₹६४० कॉम्बो** | एकरी खर्च: ~₹३२०\n  - [BigHaat: प्रोक्लेम 5% SG](https://www.bighaat.com/products/proclaim-insecticide)\n  - [IFFCO Bazar: शेतकरी पोर्टल](https://www.iffcobazar.in)\n\n---\n\n### 🏬 नजीकची अधिकृत कृषी सेवा केंद्रे:\n१. **ओम कृषी सेवा केंद्र** – शिवाजी चौक, अकोले रोड, संगमनेर | 📞 +91 98224 51230\n२. **श्री गणेश कृषी केंद्र** – मार्केट यार्ड गेट नं. २, पिंपळगाव बसवंत | 📞 +91 94222 18765`,
        suggestions: ["🚜 आवश्यक शेती यंत्रे व स्प्रेअर", "🌦️ फवारणीसाठी हवामान", "💰 आजचे बाजारभाव"]
      };
    }
    return {
      reply: `🛒 **Verified Crop Protection Products, Buying Links & Store Directory**\n\nHere is the tiered comparison from **Affordable/Budget** to **Premium High-Efficacy** solutions with verified buying links:\n\n---\n\n### 🌟 1. Top / Premium High-Efficacy Tier\n• **Syngenta Ampligo (Chlorantraniliprole + Lambda ZC)** – ₹850 to ₹920 (100 ml)\n  - [BigHaat Store: Buy Ampligo](https://www.bighaat.com/products/ampligo-insecticide)\n  - [AgroStar Online: Order Ampligo](https://www.agrostar.in/product/ampligo-insecticide)\n\n• **FMC Coragen (Chlorantraniliprole 18.5% SC)** – ₹1,750 to ₹1,890 (150 ml)\n  - [BigHaat: FMC Coragen](https://www.bighaat.com/products/coragen-insecticide)\n\n---\n\n### 💰 2. Most Affordable / Best Value Tier\n• **Proclaim (Emamectin Benzoate 5% SG) + Mancozeb 75% WP** – ₹640 Combo (Cost: ~₹320/acre)\n  - [BigHaat: Proclaim Insecticide](https://www.bighaat.com/products/proclaim-insecticide)\n  - [IFFCO Bazar: Farmer Portal](https://www.iffcobazar.in)\n\n---\n\n### 🏬 Nearby Physical Stores:\n1. **Om Krishi Seva Kendra** – Shivaji Chowk, Akole Road, Sangamner | 📞 +91 98224 51230\n2. **Shree Ganesh Krishi Kendra** – Market Yard Gate #2, Pimpalgaon Baswant | 📞 +91 94222 18765`,
      suggestions: ["🚜 Required Farm Machinery", "🌦️ Local Weather", "💰 Mandi Rates"]
    };
  }

  // 2. REQUIRED FARM MACHINERY & SPRAYER TECH
  if (['machine', 'machinery', 'tech', 'technology', 'equipment', 'tractor', 'sprayer', 'drone', 'rotavator', 'planter', 'weeder', 'यंत्र', 'ट्रॅक्टर', 'स्प्रेअर', 'फवारणी', 'ड्रोन', 'रोटाव्हेटर', 'मशीन', 'यंत्रे'].some(k => query.includes(k))) {
    if (language === 'mr') {
      return {
        reply: `🚜 **शेतीसाठी आवश्यक आधुनिक यंत्रसामग्री व स्प्रेअर तंत्रज्ञान**\n\n• **१६L १२V १२Ah ड्युअल मोटर बॅटरी स्प्रे पंप (दाब: ८.० बार):** कांदा, कापूस, टोमॅटोसाठी योग्य (किंमत: ₹२,८०० – ₹३,५००).\n• **१०L ते १६L किसान ड्रोन फवारणी:** ६ मिनिटांत १ एकर फवारणी, ९०% पाण्याची बचत आणि शेतकर्‍याला औषध विषबाधा होत नाही (भाडे: ₹३५० – ₹४५०/एकर).\n• **हॉलो कोन ब्रास नोझल (०.३ मिमी):** औषध पानांच्या खालच्या बाजूला बारीक धुक्यासारखे बसवण्यासाठी.\n• **४५ HP ट्रॅक्टर + ७ फुटी रोटाव्हेटर + गादीवाफा (BBF) मेकर:** उत्तम मशागत व ठिबक अंथरण्यासाठी.`,
        suggestions: ["🛒 औषध खरेदी लिंक्स", "🌦️ फवारणी हवामान", "💰 बाजारभाव"]
      };
    }
    return {
      reply: `🚜 **Required Agricultural Machinery & Precision Sprayer Tech**\n\n• **16L Dual-Motor Battery Sprayer (8.0 bar):** Row crops (Onion, Tomato, Cotton). Price: ₹2,800 – ₹3,500.\n• **10L Agricultural Kisan Drone:** 1 acre in 6 mins, 90% water saving, uniform canopy penetration (Custom Hiring: ₹350 – ₹450/acre).\n• **Hollow Cone Brass Nozzle (0.3mm):** Produces 80-120 micron fog under leaves.\n• **45-55 HP Tractor + 7-ft Rotavator + Raised Bed Former:** Precision bed preparation with in-line drip tape laying.`,
      suggestions: ["🛒 Pest Medicine Buying Links", "🌦️ Weather Window", "💰 APMC Mandi Rates"]
    };
  }

  // 3. GREETING
  if (['hi', 'hello', 'namaste', 'hey', 'start', 'help', 'namaskar', 'नमस्कार', 'नमस्ते', 'प्रणाम'].some(k => query.includes(k))) {
    return {
      reply: `🌿 **राम राम${friendName}! कसा आहेस?** 🙏\n\nमी तुझा शेती मित्र **कृषी AI**. आपल्या **${topo.shortName}** भागातील शेती, औषध खरेदी लिंक्स, शेती यंत्रे आणि बाजारभावांची सर्व पक्की माहिती माझ्याकडे आहे. सांग, आज शेतात काय काम चालू आहे?`,
      suggestions: ["🛒 औषध खरेदी लिंक्स व दुकाने", "🚜 आवश्यक शेती यंत्रे व स्प्रेअर", "💰 कांद्याचा बाजारभाव", "🌦️ आजचे हवामान"]
    };
  }

  // 4. GENERAL FALLBACK
  return {
    reply: `🌿 **तुझ्या प्रश्नाचे उत्तर,${friendName}:**\n\nआपल्या **${topo.shortName}** भागासाठी औषध खरेदी, किंमत तुलना, स्थानिक कृषी दुकाने किंवा शेती यंत्रांविषयी माहिती हवी असल्यास खालील पर्यायांवर क्लिक करा.`,
    suggestions: ["🛒 औषध खरेदी लिंक्स व दुकाने", "🚜 आवश्यक शेती यंत्रे व स्प्रेअर", "💰 आजचे बाजारभाव", "🌦️ आजचे हवामान"]
  };
};
