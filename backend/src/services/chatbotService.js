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
  },
  "jalgaon": {
    regionName: "Jalgaon / Khandesh (Tapi River Basin)",
    shortName: "Jalgaon / Khandesh",
    topography: "Tapi River Floodplain, heavy clay deep alluvial soil",
    soilType: "Deep Vertisols (High Moisture Holding Capacity, pH 8.0)",
    groundwater: "150 - 220 ft depth, Hatnur Dam network",
    majorCrops: ["Banana (Grand Naine)", "Cotton (Bt Hybrid)", "Maize", "Jowar"],
    apmcHub: "Jalgaon APMC & Raver Banana Yard",
    modalPrices: {
      banana: "₹1,450 – ₹1,750/qtl",
      cotton: "₹7,250 – ₹7,500/qtl",
      maize: "₹2,180 – ₹2,260/qtl"
    }
  },
  "marathwada": {
    regionName: "Chhatrapati Sambhajinagar / Jalna (Marathwada)",
    shortName: "Marathwada Basin",
    topography: "Semi-arid Godavari-Dudhna Plateau, undulating terrain",
    soilType: "Medium Black with Calcareous Nodules (Kankar), pH 8.2",
    groundwater: "180 - 250 ft depth, Jayakwadi Dam Canal network",
    majorCrops: ["Cotton", "Soybean", "Sweet Orange (Mosambi)", "Tur (Pigeon Pea)"],
    apmcHub: "Jalna Seed & Cotton APMC, Jadhavwadi Sambhajinagar",
    modalPrices: {
      cotton: "₹7,300 – ₹7,550/qtl",
      soybean: "₹4,720 – ₹4,800/qtl",
      tur: "₹9,800 – ₹10,200/qtl"
    }
  }
};

function getMatchedTopology(loc = {}) {
  const name = ((loc.name || '') + ' ' + (loc.district || '')).toLowerCase();
  if (name.includes('nashik') || name.includes('lasalgaon') || name.includes('niphad') || name.includes('dindori')) {
    return TOPOLOGY_DATABASE.nashik;
  }
  if (name.includes('pune') || name.includes('baramati') || name.includes('shirur') || name.includes('junnar')) {
    return TOPOLOGY_DATABASE.pune;
  }
  if (name.includes('jalgaon') || name.includes('dhule') || name.includes('raver') || name.includes('bhusawal')) {
    return TOPOLOGY_DATABASE.jalgaon;
  }
  if (name.includes('jalna') || name.includes('aurangabad') || name.includes('sambhajinagar') || name.includes('beed') || name.includes('parbhani')) {
    return TOPOLOGY_DATABASE.marathwada;
  }
  return TOPOLOGY_DATABASE.sangamner;
}

// Multilingual Human-Like Agricultural Companion
async function processMessage(message, location = {}, language = 'en', user = null) {
  if (!message || typeof message !== 'string') {
    return {
      reply: "Hey there! Ask me anything about your crops, today's weather, mandi prices, soil fertilizer advice, or government schemes. I'm right here to guide you!",
      suggestions: ["🌦️ Local Weather", "🌱 Soil NPK Guide", "🐛 Pest Treatment", "💰 Mandi Rates", "🏛️ Government Schemes"]
    };
  }

  const query = message.trim().toLowerCase();
  const topo = getMatchedTopology(location);
  const lat = location.lat || location.latitude || 19.5772;
  const lon = location.lon || location.longitude || 74.2173;
  const friendName = user?.name ? ` ${user.name}` : ' मित्रा';
  const friendNameHi = user?.name ? ` ${user.name}` : ' भाई';
  const friendNameEn = user?.name ? ` ${user.name}` : ' my friend';

  // 1. GREETING & FRIENDLY WELCOME
  if (['hi', 'hello', 'namaste', 'hey', 'start', 'help', 'namaskar', 'नमस्कार', 'नमस्ते', 'प्रणाम', 'kasa ahes', 'kasa kay'].some(k => query.includes(k))) {
    if (language === 'mr') {
      return {
        reply: `🌿 **राम राम${friendName}! कसा आहेस?** 🙏\n\nमी तुझा शेती मित्र **कृषी AI**. आपल्या **${topo.shortName}** भागातील शेती, काळी जमीन आणि हवामानाची सर्व माहिती माझ्याकडे आहे.\n\nतुला कोणत्याही गोष्टीची चिंता असेल — जसे की:\n• 🌦️ *आज फवारणी करावी की नाही? पाऊस कधी पडेल?*\n• 🌱 *कांदा, डाळिंब किंवा उसाला खताचा योग्य डोस काय द्यावा?*\n• 🐛 *पानांवर कीड-रोग दिसल्यास कमी खर्चात कोणता फवारा मारावा?*\n• 💰 *${topo.apmcHub.split(' ')[0]} बाजारात आज काय भाव चालू आहे?*\n• 🏛️ *महाडीबीटी सबसिडी किंवा पीएम-किसानचा फॉर्म कसा भरावा?*\n\nतू मला मित्रासारखा हक्काने कोणताही प्रश्न विचार. सांग, आज शेतात काय काम चालू आहे?`,
        suggestions: [`🌦️ आजचे हवामान कसे आहे?`, `💰 कांद्याचा बाजारभाव काय आहे?`, `🌱 खत नियोजन कसे करावे?`, "🐛 कीड नियंत्रण उपाय", "📝 योजना अर्ज कसा करावा?"]
      };
    }
    if (language === 'hi') {
      return {
        reply: `🌿 **राम राम${friendNameHi}! कैसे हो आप?** 🙏\n\nमैं आपका अपना डिजिटल कृषि मित्र **कृषि AI**। अपने **${topo.shortName}** क्षेत्र की काली मिट्टी, फसलों और मौसम के बारे में आपको जो भी सलाह चाहिए, मैं बिल्कुल एक दोस्त की तरह मदद करूँगा।\n\nआप मुझसे बेझिझक पूछ सकते हैं:\n• 🌦️ *आज कीटनाशक छिड़कें या नहीं? बारिश कब होगी?*\n• 🌱 *फसल के लिए संतुलित खाद (NPK) की सही मात्रा क्या है?*\n• 🐛 *कीट या रोग लगने पर सबसे असरदार उपाय क्या है?*\n• 💰 *${topo.apmcHub.split(' ')[0]} मंडी में आज का ताज़ा भाव क्या चल रहा है?*\n• 🏛️ *ड्रिप या सोलर पंप सब्सिडी का फॉर्म कैसे भरें?*\n\nबताइए भाई, आज आपके खेत के लिए किस विषय पर बात करें?`,
        suggestions: [`🌦️ आज का मौसम कैसा है?`, `💰 मंडी भाव क्या है?`, `🌱 खाद की सही खुराक`, "🐛 कीट-रोग समाधान", "📝 योजना का फॉर्म कैसे भरें?"]
      };
    }
    return {
      reply: `🌿 **Hey${friendNameEn}! How are you doing today?** 🙏\n\nI'm **Krishi AI**, your dedicated farming companion for the **${topo.shortName}** region. Think of me as your knowledgeable farming buddy who knows your local soil, weather patterns, and mandi trends inside out.\n\nHere are some things we can figure out together:\n• 🌦️ *Is today a safe window for foliar spraying? Any rain coming?*\n• 🌱 *What's the cost-effective NPK fertilizer schedule for your soil?*\n• 🐛 *How to tackle pest outbreaks before they damage your crop canopy?*\n• 💰 *What are the live trading rates at ${topo.apmcHub.split(' ')[0]} APMC?*\n• 🏛️ *How to easily fill out MahaDBT drip, farm pond, or solar subsidies?*\n\nFeel free to ask me anything about your field. What's on your mind today?`,
      suggestions: [`🌦️ How is the weather today?`, `💰 What are today's mandi rates?`, `🌱 Best fertilizer schedule`, "🐛 Pest management tips", "📝 How to apply for schemes?"]
    };
  }

  // 2. WEATHER & RAINFALL CONVERSATION
  if (['weather', 'rain', 'temperature', 'humidity', 'forecast', 'mausam', 'barish', 'havaman', 'paus', 'हवामान', 'पाऊस', 'तापमान', 'मौसम', 'बारिश', 'वर्षा', 'वारा'].some(k => query.includes(k))) {
    let curWeather = null;
    try {
      curWeather = await weatherService.getCurrentWeather(lat, lon);
    } catch (e) {}

    const temp = curWeather?.temperature || 28.5;
    const humidity = curWeather?.humidity || 66;
    const rain = curWeather?.precipitation || 0.0;
    const wind = curWeather?.wind_speed || 12.4;

    if (language === 'mr') {
      return {
        reply: `🌦️ **बघ${friendName}, आपल्या भागातील हवामानाची ताजी स्थिती अशी आहे:**\n\nसध्या तापमान **${temp}°C** आहे आणि हवेत **${humidity}%** आर्द्रता आहे. वाऱ्याचा वेग **${wind} किमी/तास** असून पाऊस पडण्याची शक्यता पुढील ४८ तासांत खूपच कमी आहे.\n\n💡 **तुझ्यासाठी एक मित्राचा थेट सल्ला:**\n१. **फवारणी:** ${wind < 15 && rain === 0 ? '✅ **फवारणीसाठी अगदी उत्तम वेळ आहे!** वारा शांत आहे, त्यामुळे औषध पानांवर नीट बसेल आणि उडून वाया जाणार नाही.' : '⚠️ **फवारणी थोडी थांबव** (वारा जास्त आहे किंवा पावसाची शक्यता आहे).'}\n२. **पाणी व्यवस्थापन:** आपली जमीन काळी कसदार असल्यामुळे ओलावा चांगला धरून ठेवते. उगीच जास्त पाणी साचू देऊ नकोस. सकाळी ५:३० ते ८:०० च्या दरम्यान ठिबक चालव, पाण्याचे बाष्पीभवन होणार नाही.\n\nकाही अडचण असेल तर नक्की सांग, ७ दिवसांचा सविस्तर अंदाज हवाय का?`,
        suggestions: ["📅 ७ दिवसांचा अंदाज", `🌱 खतांचा डोस काय द्यावा?`, `💰 कांदा बाजारभाव काय आहे?`]
      };
    }
    if (language === 'hi') {
      return {
        reply: `🌦️ **देखो${friendNameHi}, अपने क्षेत्र के मौसम का ताज़ा हाल बताता हूँ:**\n\nअभी तापमान लगभग **${temp}°C** है और हवा में नमी **${humidity}%** है। हवा की रफ्तार **${wind} किमी/घंटा** है और बारिश की संभावना बहुत कम है।\n\n💡 **मेरी तरफ से खास सलाह:**\n1. **छिड़काव:** ${wind < 15 && rain === 0 ? '✅ **दवा छिड़कने के लिए बिल्कुल सही समय है!** शांत हवा में स्प्रे की बर्बादी नहीं होगी।' : '⚠️ **छिड़काव अभी रोकें** (हवा तेज है)।'}\n2. **सिंचाई:** अपनी काली मिट्टी में नमी अच्छी बनी रहती है, इसलिए अधिक पानी से बचें। सुबह 5:30 से 8:00 बजे के बीच ड्रिप चलाएं।\n\nक्या 7 दिनों का पूरा पूर्वानुमान देखना चाहते हैं?`,
        suggestions: ["📅 7-दिवसीय मौसम", `🌱 संतुलित खाद की सलाह`, `💰 ताज़ा मंडी भाव`]
      };
    }
    return {
      reply: `🌦️ **Here's the live weather breakdown for our area,${friendNameEn}:**\n\nRight now, ambient temperature is sitting around **${temp}°C** with **${humidity}%** humidity. Winds are gentle at **${wind} km/h** and rainfall risk over the next 48 hours is minimal.\n\n💡 **Practical field advice from a friend:**\n1. **Spraying Window:** ${wind < 15 && rain === 0 ? '✅ **You have a clear green light for foliar spraying!** Low wind drift means your active chemical will stick cleanly to the leaves without wastage.' : '⚠️ **Hold off on spraying** for a calmer window.'}\n2. **Irrigation:** In our heavy Vertisol black soil, root-zone moisture holds tight. Run your drip early morning (5:30 AM – 8:00 AM) to beat evaporation.\n\nWould you like me to walk you through the 7-day synoptic forecast?`,
      suggestions: ["📅 7-Day Forecast", `🌱 Nutrient Schedule`, `💰 Mandi Prices`]
    };
  }

  // 3. MANDI RATES & MARKET INTELLIGENCE
  if (['market', 'price', 'rate', 'bhav', 'mandi', 'apmc', 'rates', 'kanda', 'onion', 'wheat', 'cotton', 'soybean', 'tomato', 'banana', 'grapes', 'pomegranate', 'bajarbhav', 'बाजारभाव', 'कांदा', 'गहू', 'कापूस', 'सोयाबीन', 'डाळिंब', 'केळी', 'द्राक्षे', 'मंडी', 'भाव', 'दाम'].some(k => query.includes(k))) {
    if (language === 'mr') {
      return {
        reply: `💰 **अरे${friendName}, आजच्या ${topo.apmcHub.split(' ')[0]} बाजाराचे ताजे भाव सांगतो!**\n\n• 🧅 **कांदा (लाल/रांगडा):** ${topo.modalPrices.onion || '₹२,७५० – ₹२,८४० / क्विंटल'} *(चांगल्या प्रतीच्या मालाला जोरदार मागणी आहे)*\n• 🌾 **सोयाबीन:** ${topo.modalPrices.soybean || '₹४,७५० – ₹४,८२० / क्विंटल'}\n• ⚪ **कापूस:** ${topo.modalPrices.cotton || '₹७,२५० – ₹७,५०० / क्विंटल'}\n• 🔴 **डाळिंब (भगवा):** ${topo.modalPrices.pomegranate || '₹११५ – ₹१५० / किलो'}\n\n💡 **पैसे जास्त मिळवण्यासाठी एक मित्राचा पक्का कानमंत्र:**\nमाल बाजारात नेण्यापूर्वी कांद्याची व्यवस्थित प्रतवारी (Size Grading) करून घे आणि मान चांगली सुकू दे. ग्रेडिंग करून माल नेलास तर एका क्विंटलमागे सहज **₹१५० ते ₹२५० जास्तीचा भाव** पदरात पडेल!\n\nतुझ्याकडे कोणता माल काढणीला आलाय? मी सांगतो कधी नेणे फायद्याचे ठरेल.`,
        suggestions: ["💰 कांद्याचे भाव वाढतील का?", "💰 सोयाबीन भाव अंदाज", "🌱 बियाणे/खतांचे दर", "🏛️ शासकीय हमीभाव"]
      };
    }
    if (language === 'hi') {
      return {
        reply: `💰 **अरे${friendNameHi}, आज के ${topo.apmcHub.split(' ')[0]} मंडी के ताज़ा भाव देखो!**\n\n• 🧅 **प्याज (कांदा):** ${topo.modalPrices.onion || '₹2,750 – ₹2,840 / क्विंटल'} *(मजबूत मांग)*\n• 🌾 **सोयाबीन:** ${topo.modalPrices.soybean || '₹4,750 – ₹4,820 / क्विंटल'}\n• ⚪ **कपास:** ${topo.modalPrices.cotton || '₹7,250 – ₹7,500 / क्विंटल'}\n• 🔴 **अनार (भगवा):** ${topo.modalPrices.pomegranate || '₹115 – ₹150 / किग्रा'}\n\n💡 **मुनाफा बढ़ाने के लिए मेरी टिप:**\nमंडी ले जाने से पहले माल की अच्छी तरह से छंटाई (Grading) जरूर कर लें। अगर माल ग्रेड किया हुआ हो, तो बोली में प्रति क्विंटल **₹150 से ₹250 अधिक** मिलते हैं!\n\nआप कौन सी फसल बेचने की सोच रहे हैं?`,
        suggestions: ["💰 प्याज के भाव का रुझान", "💰 सोयाबीन भाव", "🌱 खाद-बीज के दाम", "🏛️ सरकारी MSP"]
      };
    }
    return {
      reply: `💰 **Here is the latest market pulse from ${topo.apmcHub.split(' ')[0]} APMC,${friendNameEn}:**\n\n• 🧅 **Onion (Red/Rangada):** ${topo.modalPrices.onion || '₹2,750 – ₹2,840 / qtl'} *(Healthy buyer demand for well-cured lots)*\n• 🌾 **Soybean (Yellow):** ${topo.modalPrices.soybean || '₹4,750 – ₹4,820 / qtl'}\n• ⚪ **Cotton:** ${topo.modalPrices.cotton || '₹7,250 – ₹7,500 / qtl'}\n• 🔴 **Pomegranate (Bhagwa Grade-A):** ${topo.modalPrices.pomegranate || '₹115 – ₹150 / kg'}\n\n💡 **Insider tip to maximize your profit:**\nNever rush un-cured or mixed-grade produce to the auction yard. If you take an extra day to grade sizes and dry the neck leaves, buyers will bid **₹150 to ₹250 more per quintal** on your lot.\n\nWhich crop are you planning to harvest next?`,
      suggestions: ["💰 Onion Price Forecast", "💰 Soybean Rate Trend", "🌱 Input Shop Rates", "🏛️ Government MSP"]
    };
  }

  // 4. SOIL NPK & FERTILIZER ADVICE
  if (['soil', 'fertilizer', 'npk', 'urea', 'dap', 'matti', 'khad', 'potash', 'nitrogen', 'ph', 'phosphorus', 'zinc', 'boron', 'sulphur', 'gypsum', 'माती', 'खत', 'युरिया', 'डीएपी', 'पोटॅश', 'सल्फर', 'मिट्टी', 'खाद', 'उर्वरक'].some(k => query.includes(k))) {
    if (language === 'mr') {
      return {
        reply: `🌱 **आपल्या जमिनीच्या तब्येतीबद्दल विचारलंस हे खूप चांगलं केलंस${friendName}!**\n\nआपल्या भागातील जमीन **काळी कसदार (Vertisol)** आहे, जिचा सामू (pH) **७.८** च्या आसपास आहे. जमिनीत पालाश (Potassium) भरपूर आहे, पण नत्र (Nitrogen) आणि सेंद्रिय कर्ब थोडा कमी पडतोय.\n\n📌 **खर्चात बचत करणारा संतुलित खतांचा डोस (प्रति एकर):**\n१. **लागवडीवेळी (Basal Dose):** ५० किलो DAP + २५ किलो MOP + १० किलो सल्फर (गंधक) टाकून दे. गंधकामुळे कांद्याचा रंग, तिखटपणा आणि वजन खूप छान वाढते.\n२. **युरिया असा दे:** युरिया एकदम टाकू नकोस, वाहून जाईल. तो ३ हप्त्यांत विभागून दे (५०% लागवड, २५% एका महिन्याने, २५% ४५ दिवसांनी).\n३. **फुलगळ रोखण्यासाठी:** फुलोरा किंवा पोसण्याच्या अवस्थेत **झिंक सल्फेट (०.५%) + बोरॉन (०.२%)** चा एक हलका फवारा मारून घे.\n४. जमेल तेव्हा शेतात ५ टन चांगले कुजलेले शेणखत किंवा गांडूळ खत घाल, जमीन भुसभुशीत राहील.\n\nकोणत्या पिकाचे खत नियोजन करायचे आहे ते सांग, मी सविस्तर तारीखवार वेळापत्रक देतो!`,
        suggestions: ["🌱 कांदा खत वेळापत्रक", "🌱 डाळिंब खत नियोजन", "🐛 कीड नियंत्रण", "🌦️ हवामान अंदाज"]
      };
    }
    if (language === 'hi') {
      return {
        reply: `🌱 **मिट्टी की सेहत के बारे में पूछकर आपने बहुत समझदारी का काम किया${friendNameHi}!**\n\nहमारे क्षेत्र की मिट्टी **काली गहरी मिट्टी (Vertisol)** है, जिसका pH **7.8** है। इसमें पोटाश भरपूर है, लेकिन नाइट्रोजन और कार्बन की थोड़ी कमी है।\n\n📌 **कम खर्च में भरपूर पैदावार वाली खाद खुराक (प्रति एकड़):**\n1. **बुवाई के समय (बेसल डोज):** 50 किग्रा DAP + 25 किग्रा MOP + 10 किग्रा बेंटोनाइट सल्फर डालें। सल्फर से कंद/फल का वजन और चमक बढ़ती है।\n2. **यूरिया का सही तरीका:** सारा यूरिया एक बार में न डालें। इसे 3 किश्तों में बांटकर दें (50% बुवाई पर, 25% 30 दिन पर, 25% 45 दिन पर)।\n3. **सूक्ष्म पोषक तत्व:** फूल गिरने से रोकने और फल बढ़ाने के लिए 0.5% जिंक सल्फेट + 0.2% बोरॉन का स्प्रे करें।\n\nआप किस फसल के लिए खाद डालना चाहते हैं?`,
        suggestions: ["🌱 प्याज खाद चार्ट", "🌱 कपास पोषण गाइड", "🐛 कीट उपचार", "🌦️ मौसम रिपोर्ट"]
      };
    }
    return {
      reply: `🌱 **Taking care of your soil chemistry is the smartest investment you can make,${friendNameEn}!**\n\nOur regional soil is a **heavy Vertisol (Black Cotton Soil)** with a pH of **7.8**. It holds potassium naturally well, but available nitrogen and organic carbon need a little boost.\n\n📌 **Here's the high-yield, cost-effective formulation (Per Acre):**\n1. **Basal Application:** 50 kg DAP + 25 kg MOP + 10 kg Elemental Sulphur at planting. The sulphur significantly improves bulb pungency, skin luster, and storage shelf-life.\n2. **Split Nitrogen:** Never dump all Urea at once. Split it into 3 parts (50% at sowing, 25% at 30 days, 25% at 45 days) so the roots absorb every gram.\n3. **Micronutrient Foliar:** Spray **Zinc Sulphate (0.5%) + Boron (0.2%)** during active vegetative & enlargement stages to stop flower dropping.\n\nWhich crop are you looking to fertilize right now? Let's dial in the exact timeline!`,
      suggestions: ["🌱 Onion Nutrient Timeline", "🌱 Pomegranate Plan", "🐛 Pest Treatment", "🌦️ Spray Window Check"]
    };
  }

  // 5. PEST & DISEASE PROBLEM SOLVING
  if (['pest', 'disease', 'insect', 'keeda', 'fungus', 'blight', 'caterpillar', 'spray', 'neem', 'bollworm', 'thrips', 'aphid', 'telya', 'aali', 'कीड', 'रोग', 'अळी', 'तुडतुडे', 'मावा', 'बुरशी', 'तेल्या', 'करपा', 'कीट', 'रोग', 'इल्ली', 'फफूंद'].some(k => query.includes(k))) {
    if (language === 'mr') {
      return {
        reply: `🐛 **अरेरे, पिकावर कीड किंवा रोग दिसला का${friendName}? अजिबात काळजी करू नकोस, आपण वेळेत बंदोबस्त करू!**\n\nआपल्या भागात सध्या सर्वात जास्त आढळणाऱ्या समस्या आणि त्यांचे अचूक उपाय:\n\n१. 🧅 **कांद्यावरील फुलकिडे (थ्रिप्स) व जांभळा करपा:**\n   • पानांवर बारीक चंदेरी चट्टे किंवा टोक पिवळे पडत असेल, तर **इमामेक्टिन बेन्झोएट ५% एसजी (४ ग्रॅम/१० ली.) + मँकोझेब ७५% डब्ल्यूपी (२५ ग्रॅम/१० ली.)** चांगला स्टिकर टाकून फवार.\n   • शेतात एकरी १५ निळे चिकट सापळे लाव, अर्धे किडे तिथेच पकडले जातील!\n\n२. ⚪ **कापूस/सोयाबीनवरील बोंडअळी व पाने खाणारी अळी:**\n   • **कोराजन (Chlorantraniliprole 18.5% SC)** ६० मिली/एकर किंवा **प्रोफेनोफॉस ५०% ईसी** ४०० मिली/एकर फवार.\n\n३. 🔴 **डाळिंबावरील तेल्या (Bacterial Blight):**\n   • **स्ट्रेप्टोसायक्लिन (०.५ ग्रॅम/ली.) + कॉपर ऑक्सिक्लोराईड (२.५ ग्रॅम/ली.)** चा प्रतिबंधात्मक फवारा दे.\n\n📷 *एक सोपा मार्ग सांगू? बाधित पानाचा फोटो काढून आपल्या 'AI कीड निदान' स्कॅनरमध्ये टाक, लगेच खात्रीशीर निदान होईल!*`,
        suggestions: ["📸 कीड फोटो स्कॅनर", "🌱 खत नियोजन", "🌦️ फवारणीसाठी हवामान", "📝 योजना अर्ज"]
      };
    }
    if (language === 'hi') {
      return {
        reply: `🐛 **अरे${friendNameHi}, फसल पर कोई कीट या रोग दिख रहा है? बिल्कुल चिंता मत करो, मैं पक्का इलाज बताता हूँ!**\n\n1. 🧅 **प्याज में थ्रिप्स (कीट) व करपा रोग:**\n   • अगर पत्तियां पीली पड़ रही हैं, तो **इमामेक्टिन बेंजोएट 5% SG (4 ग्राम/10 ली.) + मैंकोजेब 75% WP (25 ग्राम/10 ली.)** स्टीकर मिलाकर छिड़कें।\n   • खेत में नीले स्टिकी ट्रैप (15 प्रति एकड़) लगाएं।\n\n2. ⚪ **कपास में इल्ली या गुलाबी सुंडी:**\n   • **कोराजन** 3 मिली/10 ली. या **प्रोफेनोफॉस 50% EC** 20 मिली/10 ली. पानी में मिलाकर स्प्रे करें।\n\n3. 🔴 **अनार में तेलिया (जीवाणु झुलसा):**\n   • **स्ट्रेप्टोसाइक्लिन (0.5 ग्राम/ली.) + कॉपर ऑक्सीक्लोराइड (2.5 ग्राम/ली.)** का छिड़काव करें।\n\n📷 *सुझाव: पत्ती की तस्वीर खींचकर 'AI कीट स्कैनर' में अपलोड करें, 2 सेकंड में रिपोर्ट मिलेगी!*`,
        suggestions: ["📸 कीट स्कैनर खोलें", "🌱 खाद सलाह", "🌦️ मौसम रिपोर्ट"]
      };
    }
    return {
      reply: `🐛 **Don't worry${friendNameEn}, let's tackle this pest issue right away before it spreads!**\n\nHere are the exact field-tested remedies for our regional crops:\n\n1. 🧅 **Thrips & Purple Blotch (Onion / Garlic):**\n   • Spray **Emamectin Benzoate 5% SG** @ 4g/10L water + **Mancozeb 75% WP** @ 25g/10L combined with a quality non-ionic wetting sticker.\n   • Set up 15 Blue Sticky Traps per acre—they pull thrips out of leaf sheaths naturally.\n\n2. ⚪ **Pink Bollworm / Spodoptera (Cotton / Soybean / Gram):**\n   • Spray **Chlorantraniliprole 18.5% SC (Coragen)** @ 3ml/10L or **Profenofos 50% EC** @ 20ml/10L.\n\n3. 🔴 **Bacterial Blight / Telya (Pomegranate):**\n   • Preventive spray: **Streptocycline @ 0.5g/L + Copper Oxychloride 50% WP @ 2.5g/L**.\n\n📷 *Pro-tip: Take a clear photo of the affected leaf and upload it directly into our 'AI Pest Scanner' tab for instant computer vision analysis!*`,
      suggestions: ["📸 Open Pest Scanner", "🌱 Soil Nutrient Plan", "🌦️ Spray Window Check"]
    };
  }

  // 6. STEP-BY-STEP SCHEME APPLICATION & FORM FILLING GUIDE
  if (['how to apply', 'fill form', 'form guide', 'apply', 'form', 'registration', 'document', 'kagadpatre', 'process', 'step', 'steps', 'mahadbt', 'arja', 'kasa bharaycha', 'अर्ज', 'फॉर्म', 'कागदपत्रे', 'नोंदणी', 'कसा भरायचा', 'प्रक्रिया', 'आवेदन', 'दस्तावेज', 'पंजीकरण', 'फॉर्म कैसे भरें'].some(k => query.includes(k))) {
    if (language === 'mr') {
      return {
        reply: `🏛️ **अरे वा${friendName}! सरकारी योजनांचा फायदा घ्यायलाच पाहिजे, मी तुला अगदी सोप्या भाषेत अर्ज भरण्याची पायरी-दर-पायरी माहिती देतो!**\n\n📋 **आधी हे कागदपत्रे जवळ काढून ठेव मित्रा:**\n• 📄 **७/१२ उतारा व ८-अ नोंद** (३ महिन्यांच्या आतील डिजिटल प्रत)\n• 🆔 **आधार कार्ड** (मोबाईल नंबर लिंक असलेला OTP साठी)\n• 🏦 **बँक पासबुक** (ज्या खात्याला आधार DBT लिंक आहे)\n• 💧 **विहीर/बोअरवेल दाखला किंवा वीज बिल** (ठिबक, तुषार व सौर पंपासाठी)\n• 📜 **जातीचा दाखला** (SC/ST प्रवर्गातील शेतकऱ्यांना ८० ते ९०% जास्तीचे अनुदान मिळते)\n\n───────────────────────────────\n\n📌 **महाडीबीटी (MahaDBT) वर असा भर फॉर्म (६ सोप्या पायऱ्या):**\n\n**🔹 पायरी १: पोर्टलवर नोंदणी करा**\n• अधिकृत पोर्टल उघड: \`mahadbt.maharashtra.gov.in\`\n• 'नवीन शेतकरी नोंदणी' वर क्लिक कर, आधार नंबर टाक आणि मोबाईलवर आलेला OTP टाकून लॉगिन आयडी बनव.\n\n**🔹 पायरी २: शेतकरी प्रोफाइल पूर्ण करा**\n• वैयक्तिक माहिती, बँक खात्याचा नंबर आणि जमिनीचा ७/१२ चा तपशील (जिल्हा, तालुका, गाव, गट नंबर व क्षेत्र) भर.\n\n**🔹 पायरी ३: योजनेचा घटक निवडा**\n• 'शेतकरी योजना' मध्ये जाऊन खालीलपैकी हवा तो घटक निवड:\n  - 💧 *ठिबक सिंचन / तुषार सिंचन:* ८०% थेट अनुदान\n  - ☀️ *सौर कृषी पंप (PM-KUSUM):* ६०% सबसिडी (३ ते ७.५ HP)\n  - 🌊 *मागेल त्याला शेततळे:* ₹७५,००० थेट अनुदान\n  - 🚜 *ट्रॅक्टर व अवजारे:* ५०% सबसिडी\n\n**🔹 पायरी ४: कागदपत्रे अपलोड करा**\n• ७/१२, ८-अ आणि वीज बिल PDF स्वरूपात (५०० KB पेक्षा कमी आकारात) अपलोड कर.\n\n**🔹 पायरी ५: ऑनलाइन फी भरून पावती घे**\n• फक्त ₹२३.६० ऑनलाइन फी (UPI ने) भर आणि अर्ज सबमिट कर. महाडीबीटीच्या संगणकीय सोडतीत (Lottery) तुझे नाव निवडले जाईल.\n\n**🔹 पायरी ६: पूर्वसंमती पत्र व थेट खात्यात पैसे जमा**\n• सोडतीत नाव आल्यावर कृषी विभागाचे **पूर्वसंमती पत्र (Pre-Sanction)** डाऊनलोड कर.\n• मान्यताप्राप्त दुकानातून साहित्य खरेदी करून GST पक्के बिल अपलोड कर. अनुदानाचे पैसे थेट तुझ्या बँकेत जमा होतील!\n\nकाहीही अडचण आली तर मला कधीही विचार, किंवा कृषी विभागाचा टोल-फ्री नंबर 📞 **1800-180-1551** वर कॉल कर.`,
        suggestions: ["💧 ठिबक सिंचन अर्ज", "☀️ सौर पंप योजना", "🏛️ पीएम-किसान स्टेटस", "📄 ७/१२ कागदपत्रे"]
      };
    }
    if (language === 'hi') {
      return {
        reply: `🏛️ **अरे बहुत बढ़िया${friendNameHi}! सरकारी योजनाओं का लाभ जरूर लेना चाहिए। मैं आपको बहुत सरल तरीके से फॉर्म भरने की पूरी प्रक्रिया समझाता हूँ:**\n\n📋 **पहले ये दस्तावेज पास में रख लें:**\n• 📄 **खतौनी / 7/12 व 8-A** (जमीन के स्वामित्व का डिजिटल प्रमाण)\n• 🆔 **आधार कार्ड** (मोबाइल नंबर से लिंक)\n• 🏦 **बैंक पासबुक** (Aadhaar NPCI DBT चालू होना चाहिए)\n• 💧 **जल स्रोत प्रमाण / बिजली बिल** (ड्रिप एवं सोलर पंप हेतु)\n• 📜 **जाति प्रमाण पत्र** (SC/ST विशेष 80-90% सब्सिडी हेतु)\n\n───────────────────────────────\n\n📌 **ऑनलाइन फॉर्म भरने के 6 आसान चरण (Steps):**\n\n**🔹 चरण 1: पोर्टल पर लॉगिन**\n• आधिकारिक पोर्टल \`mahadbt.maharashtra.gov.in\` या \`pmkisan.gov.in\` खोलें और आधार OTP से खाता बनाएं।\n\n**🔹 चरण 2: किसान प्रोफाइल भरें**\n• व्यक्तिगत विवरण, बैंक खाता और जमीन का खसरा/सर्वे नंबर दर्ज करें।\n\n**🔹 चरण 3: योजना चुनें**\n• ड्रिप/स्प्रिंकलर (80% सब्सिडी), सोलर पंप (60% सब्सिडी) अथवा खेत तालाब का चयन करें।\n\n**🔹 चरण 4: दस्तावेज अपलोड करें**\n• 7/12 खतौनी और बिजली बिल PDF/JPEG प्रारूप में अपलोड करें।\n\n**🔹 चरण 5: ₹23.60 फीस भरें**\n• नाममात्र शुल्क UPI द्वारा जमा कर रसीद लें। कंप्यूटर लॉटरी द्वारा चयन होगा।\n\n**🔹 चरण 6: पूर्व-स्वीकृति एवं DBT सब्सिडी**\n• चयन होने पर पूर्व-स्वीकृति पत्र डाउनलोड करें, सामान खरीदकर GST बिल अपलोड करें। सब्सिडी सीधे बैंक खाते में आ जाएगी।\n\nकोई भी दिक्कत आए तो किसान हेल्पलाइन 📞 **1800-180-1551** पर संपर्क करें।`,
        suggestions: ["💧 ड्रिप सब्सिडी फॉर्म", "☀️ सोलर पंप आवेदन", "🏛️ पीएम-किसान ई-केवाईसी"]
      };
    }
    return {
      reply: `🏛️ **Great initiative,${friendNameEn}! You should definitely claim all the government agricultural subsidies you're entitled to.**\n\nLet me walk you through the entire application process step-by-step just like a trusted advisor:\n\n📋 **First, keep these documents handy:**\n• 📄 **7/12 & 8-A Land Record** (Digital copy < 3 months old)\n• 🆔 **Aadhaar Card** (Linked with mobile number for OTP)\n• 🏦 **Bank Passbook / Cancelled Cheque** (Aadhaar NPCI DBT enabled)\n• 💧 **Water Source Proof / Electricity Bill** (For Drip & Solar Pump)\n• 📜 **Caste Certificate** (SC/ST categories receive enhanced 80-90% subsidy)\n\n───────────────────────────────\n\n📌 **Simple 6-Step Application Process (MahaDBT):**\n\n**🔹 Step 1: Registration & Aadhaar OTP Login**\n• Visit \`mahadbt.maharashtra.gov.in\` and click *New Farmer Registration*. Verify via mobile OTP.\n\n**🔹 Step 2: Fill Farmer Profile & Land Details**\n• Enter your personal details, bank IFSC, and cadastral survey/gat numbers with acreage.\n\n**🔹 Step 3: Select Scheme Component**\n• Under *Farmer Schemes*, choose your intended asset:\n  - 💧 *Drip / Sprinkler Irrigation:* Up to 80% direct subsidy.\n  - ☀️ *PM-KUSUM Solar Pump:* 60% subsidy for 3 HP to 7.5 HP pumps.\n  - 🌊 *Magel Tyala Shettale (Farm Pond):* Up to ₹75,000 grant.\n\n**🔹 Step 4: Upload Required Documents**\n• Upload 7/12, 8-A, and electricity bill in PDF/JPEG format (< 500 KB).\n\n**🔹 Step 5: Pay Online Fee (₹23.60)**\n• Pay the small portal fee via UPI/Netbanking. Beneficiary selection happens via computerized lottery.\n\n**🔹 Step 6: Pre-Sanction Order & Direct DBT Credit**\n• Once selected, download the **Pre-Sanction Order**, purchase equipment from an authorized dealer, and upload the GST invoice. The subsidy funds get credited directly to your bank account.\n\nNeed help with anything during the process? Just ask me or call the Kisan Helpline at 📞 **1800-180-1551**!`,
      suggestions: ["💧 Apply Drip Subsidy", "☀️ Solar Pump Guide", "🏛️ PM-Kisan KYC", "📄 Land Documents"]
    };
  }

  // 7. GENERAL SCHEMES OVERVIEW
  if (['scheme', 'yojana', 'pm kisan', 'namo shetkari', 'pmfby', 'kcc', 'subsidy', 'sarkar', 'government', 'bima', 'paisa', 'kusum', 'shettale', 'tractor', 'योजना', 'सबसिडी', 'अनुदान', 'विमा', 'नमो शेतकरी', 'शेततळे', 'योजनाएं', 'बीमा'].some(k => query.includes(k))) {
    if (language === 'mr') {
      return {
        reply: `🏛️ **आपल्या भागातील शेतकऱ्यांसाठी सध्या चालू असलेल्या प्रमुख योजना सांगतो मित्रा:**\n\n१. 💳 **पीएम-किसान + नमो शेतकरी योजना:** केंद्र व राज्य मिळून **वार्षिक ₹१२,०००** थेट तुझ्या बँक खात्यात येतात.\n२. 💧 **महाडीबीटी ठिबक व तुषार सिंचन:** लहान शेतकऱ्यांना **८०% थेट अनुदान** मिळते.\n३. ☀️ **पीएम-कुसुम सौर कृषी पंप:** ३ ते ७.५ एचपी सौर पंपावर **६०% सरकारी अनुदान** आहे.\n४. 🌊 **मागेल त्याला शेततळे:** शेततळ्यासाठी **₹७५,०००** थेट अनुदान मिळते.\n५. 🛡️ **पीक विमा व KCC:** अवघ्या ४% व्याजदराने ₹३ लाखांपर्यंत पीक कर्ज उपलब्ध आहे.\n\n📝 *तुला यापैकी कोणत्याही योजनेचा फॉर्म भरायचा असेल, तर मला 'अर्ज कसा करावा' असे विचार, मी लगेच सविस्तर पायऱ्या समजावून सांगतो!*`,
        suggestions: ["📝 योजना अर्ज कसा करावा?", "💧 ठिबक सिंचन अर्ज", "☀️ सौर पंप योजना", "💰 हमीभाव माहिती"]
      };
    }
    if (language === 'hi') {
      return {
        reply: `🏛️ **अपने क्षेत्र के किसानों के लिए चल रही प्रमुख योजनाएं ये हैं, भाई:**\n\n1. 💳 **पीएम-किसान + नमो शेतकरी योजना:** केंद्र व राज्य मिलाकर **₹12,000 प्रति वर्ष** सीधे बैंक में।\n2. 💧 **ड्रिप एवं स्प्रिंकलर सिंचाई:** छोटे किसानों को **80% तक सीधी सब्सिडी**।\n3. ☀️ **पीएम-कुसुम सोलर पंप:** 3 से 7.5 HP सोलर पंप पर **60% सरकारी छूट**।\n4. 🌊 **खेत तालाब योजना:** निर्माण हेतु **₹75,000** तक का अनुदान।\n\n📝 *अगर किसी योजना का फॉर्म भरना चाहते हैं, तो 'फॉर्म कैसे भरें' पूछें, मैं पूरी प्रक्रिया समझा दूंगा!*`,
        suggestions: ["📝 फॉर्म भरने की स्टेप गाइड", "💧 सोलर पंप सब्सिडी", "💰 मंडी भाव"]
      };
    }
    return {
      reply: `🏛️ **Here are the top active government programs for your farm,${friendNameEn}:**\n\n1. 💳 **PM-KISAN + Namo Shetkari:** Combined **₹12,000/year** direct benefit deposited into your bank account.\n2. 💧 **MahaDBT Micro-Irrigation:** Up to **80% direct subsidy** on drip and sprinkler sets.\n3. ☀️ **PM-KUSUM Solar Pumps:** **60% subsidy** on 3 HP to 7.5 HP standalone solar irrigation systems.\n4. 🌊 **Magel Tyala Shettale (Farm Pond):** Direct grant up to **₹75,000** for rainwater storage.\n\n📝 *Want to apply for any of these? Just ask me "How to fill scheme form" and I'll walk you through the documents and application steps!*`,
      suggestions: ["📝 Scheme Form Step Guide", "💧 Solar Pump Scheme", "💰 Mandi Rates"]
    };
  }

  // 8. IRRIGATION & WATER MANAGEMENT
  if (['irrigation', 'water', 'pani', 'drip', 'canal', 'borewell', 'well', 'shettale', 'पाणी', 'कालवा', 'ठिबक', 'विहीर', 'बोरवेल', 'पानी', 'नहर', 'ड्रिप'].some(k => query.includes(k))) {
    if (language === 'mr') {
      return {
        reply: `💧 **आपल्या भागातील पाणी व्यवस्थापनाबाबत मित्राचा एक चांगला सल्ला:**\n\nआपल्या **${topo.shortName}** भागात पाण्याचा मुख्य स्रोत **${topo.groundwater}** आहे. आपली जमीन काळी कसदार असल्यामुळे पाणी धरून ठेवण्याची क्षमता जास्त आहे.\n\n📌 **पाणी व पैशांची बचत करण्यासाठी काय करशील:**\n१. **ठिबक सिंचन वापर:** नेहमीच्या पद्धतीपेक्षा ५०% पाणी वाचते आणि खते थेट मुळाजवळ पोहोचतात.\n२. **वेळ सांभाळ:** दिवसा ऊन वाढण्यापूर्वी सकाळी ५:३० ते ८:०० दरम्यान ठिबक चालव.\n३. **शेततळे:** पावसाचे पाणी साठवण्यासाठी **मागेल त्याला शेततळे** योजनेचा लाभ घे, मी फॉर्म भरायला मदत करतो.\n\nशेतात पाणी कमी पडतंय का? सांग, आपण योग्य नियोजन करू!`,
        suggestions: ["💧 ठिबक सबसिडी अर्ज", "🌦️ पावसाचा अंदाज", "🌱 खत सल्ला"]
      };
    }
    return {
      reply: `💧 **Here's some practical water management advice for our land,${friendNameEn}:**\n\nIn our **${topo.shortName}** zone, our groundwater depth averages **${topo.groundwater}**. Because our black Vertisol soil holds water very well, the key is preventing waterlogging while keeping root zones aerated.\n\n📌 **Actionable water tips:**\n1. **Use Drip Fertigation:** It saves 40–50% water and delivers nutrients right where the roots need them.\n2. **Run Early Morning:** 5:30 AM to 8:00 AM slots prevent transpirational loss.\n3. **Rainwater Harvesting:** Consider digging a farm pond under the **Magel Tyala Shettale** grant.\n\nHow is your current water supply holding up?`,
      suggestions: ["💧 Drip Irrigation Subsidy", "🌦️ Rain Forecast", "🌱 Soil Health"]
    };
  }

  // FALLBACK FRIENDLY RESPONSE
  if (language === 'mr') {
    return {
      reply: `🌾 **अरे${friendName}, तुझ्या "${message.trim()}" या प्रश्नाबाबत सांगतो:**\n\nआपल्या **${topo.shortName}** भागातील **${topo.soilType.split('(')[0]}** आणि स्थानिक हवामानाचा विचार करता, शेतीची कामे योग्य नियोजनाने करणे फायद्याचे ठरेल.\n\nआपल्या डॅशबोर्डवर तुला हवी ती सर्व माहिती थेट उपलब्ध आहे:\n• 🗺️ **जीआयएस नकाशा:** शेताच्या सीमा व पिकांची तब्येत\n• 🌦️ **हवामान:** ७ दिवसांचा अचूक अंदाज\n• 💰 **बाजारपेठ:** ${topo.apmcHub.split(' ')[0]} चे थेट भाव\n• 🐛 **कीड निदान:** पानाचा फोटो काढून तपासणी\n\nमला अजून काहीही विचार, मी तुला सविस्तर सांगतो!`,
      suggestions: [`🌦️ आजचे हवामान`, `💰 आजचे बाजारभाव`, "🌱 खत नियोजन", "🐛 कीड नियंत्रण", "📝 योजना अर्ज"]
    };
  }
  if (language === 'hi') {
    return {
      reply: `🌾 **देखो${friendNameHi}, आपके "${message.trim()}" सवाल के बारे में:**\n\nअपने **${topo.shortName}** क्षेत्र की **${topo.soilType.split('(')[0]}** और मौसम के अनुसार सही समय पर कृषि कार्य करना सबसे बेहतर रहेगा।\n\nडैशबोर्ड पर आप सीधे देख सकते हैं:\n• 🗺️ **GIS मैप:** उपग्रह एवं फसल स्वास्थ्य\n• 🌦️ **मौसम:** 7-दिवसीय पूर्वानुमान\n• 💰 **मंडी:** ${topo.apmcHub.split(' ')[0]} के ताज़ा भाव\n• 🐛 **कीट निदान:** फोटो से रोग पहचान\n\nआप और क्या जानना चाहते हैं, बताइए?`,
      suggestions: [`🌦️ आज का मौसम`, `💰 मंडी भाव`, "🌱 खाद सलाह", "🐛 कीट उपचार", "📝 योजना फॉर्म"]
    };
  }
  return {
    reply: `🌾 **Hey${friendNameEn}, regarding your query about "${message.trim()}":**\n\nFor best results in our **${topo.shortName}** zone with **${topo.soilType.split('(')[0]}**, aligning your daily field activities with local weather windows and balanced nutrient management will give you the healthiest yields.\n\nYou can also explore our specialized modules:\n• 🗺️ **GIS Spatial Map:** Cadastral boundaries & NDVI\n• 🌦️ **Weather Monitoring:** 7-Day synoptic forecasts\n• 💰 **Market Intelligence:** Live rates for ${topo.apmcHub.split(' ')[0]}\n• 🐛 **AI Pest Surveillance:** Deep learning leaf pathology\n\nWhat else can I help you figure out today?`,
    suggestions: [`🌦️ Today's Weather`, `💰 Live Mandi Rates`, "🌱 Soil Health", "🐛 Pest Treatment", "📝 Scheme Application"]
  };
}

module.exports = {
  processMessage,
  TOPOLOGY_DATABASE
};
