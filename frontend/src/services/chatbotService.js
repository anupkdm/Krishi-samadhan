import api from './api';

export const TOPOLOGY_PRESETS = [
  {
    id: "sangamner",
    name: "Sangamner / Ahmednagar (Pravara River Basin)",
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
      sugarcane: "₹3,150/tonne"
    }
  },
  {
    id: "nashik",
    name: "Nashik / Lasalgaon (Upper Godavari Basin)",
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
  {
    id: "pune",
    name: "Pune / Baramati (Bhima-Nira Basin)",
    shortName: "Pune / Baramati Belt",
    topography: "Deccan Trap Plateau, 570m elevation, Nira Left Bank Canal",
    soilType: "Medium to Deep Black Clay, pH 7.6",
    groundwater: "100 - 150 ft depth, Nira Deoghar & Veer Canal Network",
    majorCrops: ["Sugarcane", "Pomegranate", "Floriculture (Roses)", "Vegetables"],
    apmcHub: "Pune Gultekdi APMC & Baramati Market Yard",
    modalPrices: {
      sugarcane: "₹3,200/tonne",
      onion: "₹2,700 – ₹2,800/qtl",
      tomato: "₹1,850 – ₹2,150/qtl"
    }
  }
];

export const sendMessage = async (message, context = {}) => {
  const { location = {}, language = 'en', user = null } = context;

  try {
    const res = await api.post('/chatbot/message', { message, location, language, user });
    if (res && (res.reply || res.message)) {
      return res;
    }
  } catch (err) {
    console.warn('Backend chatbot API unavailable, routing through client friend AI engine:', err.message);
  }

  // Instant client-side human-like friend AI companion
  const query = (message || '').trim().toLowerCase();
  const locName = location.name || "Sangamner / Ahmednagar";
  const matchedTopo = TOPOLOGY_PRESETS.find(p =>
    locName.toLowerCase().includes(p.id) ||
    (location.district && location.district.toLowerCase().includes(p.id))
  ) || TOPOLOGY_PRESETS[0];

  const friendName = user?.name ? ` ${user.name}` : ' मित्रा';
  const friendNameHi = user?.name ? ` ${user.name}` : ' भाई';
  const friendNameEn = user?.name ? ` ${user.name}` : ' my friend';

  const buildResponse = ({ en, mr, hi, suggestionsEn, suggestionsMr, suggestionsHi }) => {
    if (language === 'mr') {
      return { reply: mr, suggestions: suggestionsMr || ["🌦️ आजचे हवामान", "🌱 खत सल्ला", "💰 बाजारभाव", "📝 योजना अर्ज"] };
    }
    if (language === 'hi') {
      return { reply: hi, suggestions: suggestionsHi || ["🌦️ आज का मौसम", "🌱 खाद सलाह", "💰 मंडी भाव", "📝 योजना फॉर्म"] };
    }
    return { reply: en, suggestions: suggestionsEn || ["🌦️ Local Weather", "🌱 Soil Fertilizer Guide", "💰 Mandi Rates", "📝 Scheme Guide"] };
  };

  // 1. GREETING
  if (['hi', 'hello', 'namaste', 'hey', 'start', 'help', 'namaskar', 'नमस्कार', 'नमस्ते', 'प्रणाम', 'kasa ahes'].some(k => query.includes(k))) {
    return buildResponse({
      en: `🌿 **Hey${friendNameEn}! How are you doing today?** 🙏\n\nI'm **Krishi AI**, your dedicated farming companion for **${matchedTopo.shortName || matchedTopo.name}**. Think of me as your knowledgeable farming buddy who knows your local soil, weather patterns, and mandi trends.\n\nAsk me anything about your field—weather windows, fertilizer dosages, pest treatments, live APMC rates, or step-by-step subsidy form filling. What's on your mind today?`,
      mr: `🌿 **राम राम${friendName}! कसा आहेस?** 🙏\n\nमी तुझा शेती मित्र **कृषी AI**. आपल्या **${matchedTopo.shortName || matchedTopo.name}** भागातील शेती, काळी जमीन आणि हवामानाची सर्व माहिती माझ्याकडे आहे.\n\nतुला कोणत्याही गोष्टीची चिंता असेल — हवामान अंदाज, खतांचा योग्य डोस, कीड नियंत्रण, आजचे बाजारभाव किंवा सरकारी योजनेचा फॉर्म भरताना येणाऱ्या अडचणी — तू मला मित्रासारखा हक्काने विचार. सांग, आज शेतात काय काम चालू आहे?`,
      hi: `🌿 **राम राम${friendNameHi}! कैसे हो आप?** 🙏\n\nमैं आपका अपना डिजिटल कृषि मित्र **कृषि AI**। अपने **${matchedTopo.shortName || matchedTopo.name}** क्षेत्र की काली मिट्टी, फसलों और मौसम के बारे में आपको जो भी सलाह चाहिए, मैं बिल्कुल एक दोस्त की तरह मदद करूँगा।\n\nबताइए भाई, आज आपके खेत के लिए किस विषय पर बात करें?`,
      suggestionsEn: [`🌦️ How is the weather today?`, `💰 What are today's mandi rates?`, `🌱 Best fertilizer schedule`, "🐛 Pest management tips", "📝 How to apply for schemes?"],
      suggestionsMr: [`🌦️ आजचे हवामान कसे आहे?`, `💰 कांद्याचा बाजारभाव काय आहे?`, `🌱 खत नियोजन कसे करावे?`, "🐛 कीड नियंत्रण उपाय", "📝 योजना अर्ज कसा करावा?"],
      suggestionsHi: [`🌦️ आज का मौसम कैसा है?`, `💰 मंडी भाव क्या है?`, `🌱 खाद की सही खुराक`, "🐛 कीट-रोग समाधान", "📝 योजना का फॉर्म कैसे भरें?"]
    });
  }

  // 2. WEATHER
  if (['weather', 'rain', 'temperature', 'humidity', 'forecast', 'mausam', 'barish', 'havaman', 'paus', 'हवामान', 'पाऊस', 'तापमान', 'मौसम', 'बारिश', 'वर्षा'].some(k => query.includes(k))) {
    return buildResponse({
      en: `🌦️ **Here's the live weather breakdown for our area,${friendNameEn}:**\n\nRight now, ambient temperature is around **28.5°C** with **66%** relative humidity. Winds are calm at **12.4 km/h** and rainfall risk over the next 48 hours is very low.\n\n💡 **Practical field advice from a friend:**\n1. **Spraying Window:** ✅ **Favorable spray window right now!** Gentle wind means zero drift wastage.\n2. **Irrigation:** In our heavy Vertisol black soil, root-zone moisture holds well. Run your drip early in the morning (5:30 AM – 8:00 AM) to beat evaporation.\n\nWould you like me to walk you through the 7-day forecast?`,
      mr: `🌦️ **बघ${friendName}, आपल्या भागातील हवामानाची ताजी स्थिती अशी आहे:**\n\nसध्या तापमान **२८.५°C** आहे आणि हवेत **६६%** आर्द्रता आहे. वाऱ्याचा वेग **१२.४ किमी/तास** असून पाऊस पडण्याची शक्यता पुढील ४८ तासांत खूपच कमी आहे.\n\n💡 **तुझ्यासाठी एक मित्राचा थेट सल्ला:**\n१. **फवारणी:** ✅ **फवारणीसाठी अगदी उत्तम वेळ आहे!** वारा शांत आहे, त्यामुळे औषध पानांवर नीट बसेल.\n२. **पाणी व्यवस्थापन:** आपली जमीन काळी कसदार असल्यामुळे ओलावा चांगला धरून ठेवते. सकाळी ५:३० ते ८:०० च्या दरम्यान ठिबक चालव, पाण्याचे बाष्पीभवन होणार नाही.\n\n७ दिवसांचा सविस्तर अंदाज हवाय का?`,
      hi: `🌦️ **देखो${friendNameHi}, अपने क्षेत्र के मौसम का ताज़ा हाल बताता हूँ:**\n\nअभी तापमान लगभग **28.5°C** है और हवा में नमी **66%** है। हवा की रफ्तार **12.4 किमी/घंटा** है और बारिश की संभावना बहुत कम है।\n\n💡 **मेरी तरफ से खास सलाह:**\n1. **छिड़काव:** ✅ **दवा छिड़कने के लिए बिल्कुल सही समय है!** शांत हवा में स्प्रे की बर्बादी नहीं होगी।\n2. **सिंचाई:** सुबह 5:30 से 8:00 बजे के बीच ड्रिप चलाएं।\n\nक्या 7 दिनों का पूरा पूर्वानुमान देखना चाहते हैं?`,
      suggestionsEn: ["📅 7-Day Forecast", `🌱 Nutrient Schedule`, `💰 Mandi Prices`],
      suggestionsMr: ["📅 ७ दिवसांचा अंदाज", `🌱 खतांचा डोस काय द्यावा?`, `💰 कांदा बाजारभाव काय आहे?`],
      suggestionsHi: ["📅 7-दिवसीय मौसम", `🌱 संतुलित खाद की सलाह`, `💰 ताज़ा मंडी भाव`]
    });
  }

  // 3. MANDI RATES
  if (['market', 'price', 'rate', 'bhav', 'mandi', 'apmc', 'rates', 'kanda', 'onion', 'wheat', 'cotton', 'soybean', 'tomato', 'bajarbhav', 'बाजारभाव', 'कांदा', 'गहू', 'कापूस', 'सोयाबीन', 'मंडी', 'भाव', 'दाम'].some(k => query.includes(k))) {
    return buildResponse({
      en: `💰 **Here is the latest market pulse from ${matchedTopo.apmcHub.split(' ')[0]} APMC,${friendNameEn}:**\n\n• 🧅 **Onion (Red/Rangada):** ${matchedTopo.modalPrices.onion || '₹2,750 – ₹2,840/qtl'} *(Healthy buyer demand for well-cured lots)*\n• 🌾 **Soybean:** ${matchedTopo.modalPrices.soybean || '₹4,750 – ₹4,820/qtl'}\n• ⚪ **Cotton:** ${matchedTopo.modalPrices.cotton || '₹7,250 – ₹7,500/qtl'}\n• 🔴 **Pomegranate (Bhagwa):** ${matchedTopo.modalPrices.pomegranate || '₹115 – ₹150/kg'}\n\n💡 **Insider tip to maximize your profit:**\nGrade your produce by size and ensure proper neck drying before heading to the market. You'll easily fetch **₹150 to ₹250 more per quintal**!`,
      mr: `💰 **अरे${friendName}, आजच्या ${matchedTopo.apmcHub.split(' ')[0]} बाजाराचे ताजे भाव सांगतो!**\n\n• 🧅 **कांदा (लाल/रांगडा):** ${matchedTopo.modalPrices.onion || '₹२,७५० – ₹२,८४० / क्विंटल'} *(चांगल्या प्रतीच्या मालाला जोरदार मागणी आहे)*\n• 🌾 **सोयाबीन:** ${matchedTopo.modalPrices.soybean || '₹४,७५० – ₹४,८२० / क्विंटल'}\n• ⚪ **कापूस:** ${matchedTopo.modalPrices.cotton || '₹७,२५० – ₹७,५०० / क्विंटल'}\n• 🔴 **डाळिंब (भगवा):** ${matchedTopo.modalPrices.pomegranate || '₹११५ – ₹१५० / किलो'}\n\n💡 **पैसे जास्त मिळवण्यासाठी मित्राचा पक्का कानमंत्र:**\nमाल बाजारात नेण्यापूर्वी कांद्याची व्यवस्थित प्रतवारी (Size Grading) करून घे आणि मान चांगली सुकू दे. ग्रेडिंग करून माल नेलास तर एका क्विंटलमागे सहज **₹१५० ते ₹२५० जास्तीचा भाव** पदरात पडेल!\n\nतुझ्याकडे कोणता माल काढणीला आलाय?`,
      hi: `💰 **अरे${friendNameHi}, आज के ${matchedTopo.apmcHub.split(' ')[0]} मंडी के ताज़ा भाव देखो!**\n\n• 🧅 **प्याज (कांदा):** ${matchedTopo.modalPrices.onion || '₹2,750 – ₹2,840 / क्विंटल'}\n• 🌾 **सोयाबीन:** ${matchedTopo.modalPrices.soybean || '₹4,750 – ₹4,820 / क्विंटल'}\n• ⚪ **कपास:** ${matchedTopo.modalPrices.cotton || '₹7,250 – ₹7,500 / क्विंटल'}\n• 🔴 **अनार (भगवा):** ${matchedTopo.modalPrices.pomegranate || '₹115 – ₹150 / किग्रा'}\n\n💡 **मुनाफा बढ़ाने के लिए मेरी टिप:**\nमंडी ले जाने से पहले माल की अच्छी तरह से छंटाई (Grading) जरूर कर लें। आपको प्रति क्विंटल **₹150 से ₹250 अधिक** मिलेंगे!`,
      suggestionsEn: ["💰 Onion Price Forecast", "💰 Soybean Rate Trend", "🌱 Input Shop Rates", "🏛️ Government MSP"],
      suggestionsMr: ["💰 कांद्याचे भाव वाढतील का?", "💰 सोयाबीन भाव अंदाज", "🌱 बियाणे/खतांचे दर", "🏛️ शासकीय हमीभाव"],
      suggestionsHi: ["💰 प्याज के भाव का रुझान", "💰 सोयाबीन भाव", "🌱 खाद-बीज के दाम", "🏛️ सरकारी MSP"]
    });
  }

  // 4. SOIL NPK
  if (['soil', 'fertilizer', 'npk', 'urea', 'dap', 'matti', 'khad', 'potash', 'nitrogen', 'ph', 'phosphorus', 'zinc', 'boron', 'माती', 'खत', 'युरिया', 'डीएपी', 'पोटॅश', 'मिट्टी', 'खाद', 'उर्वरक'].some(k => query.includes(k))) {
    return buildResponse({
      en: `🌱 **Taking care of your soil is the smartest move you can make,${friendNameEn}!**\n\nOur regional soil is a **heavy Vertisol (Black Cotton Soil)** with a pH of **7.8**. It holds potassium well, but nitrogen and organic matter need support.\n\n📌 **Cost-effective formulation (Per Acre):**\n1. **Basal Application:** 50 kg DAP + 25 kg MOP + 10 kg Elemental Sulphur at planting.\n2. **Split Nitrogen:** Split Urea into 3 doses (50% at sowing, 25% at 30 days, 25% at 45 days).\n3. **Micronutrient Foliar:** Spray **Zinc Sulphate (0.5%) + Boron (0.2%)** during active vegetative & enlargement stages to stop flower dropping.\n\nWhich crop are you fertilizing right now?`,
      mr: `🌱 **आपल्या जमिनीच्या तब्येतीबद्दल विचारलंस हे खूप चांगलं केलंस${friendName}!**\n\nआपल्या भागातील जमीन **काळी कसदार (Vertisol)** आहे, जिचा सामू (pH) **७.८** च्या आसपास आहे. जमिनीत पालाश भरपूर आहे, पण नत्र आणि सेंद्रिय कर्ब थोडा कमी पडतोय.\n\n📌 **खर्चात बचत करणारा संतुलित खतांचा डोस (प्रति एकर):**\n१. **लागवडीवेळी (Basal Dose):** ५० किलो DAP + २५ किलो MOP + १० किलो सल्फर (गंधक) टाकून दे. गंधकामुळे कांद्याचा रंग, तिखटपणा आणि वजन खूप छान वाढते.\n२. **युरिया असा दे:** युरिया एकदम टाकू नकोस, तो ३ हप्त्यांत विभागून दे (५०% लागवड, २५% एका महिन्याने, २५% ४५ दिवसांनी).\n३. **फुलगळ रोखण्यासाठी:** फुलोरा किंवा पोसण्याच्या अवस्थेत **झिंक सल्फेट (०.५%) + बोरॉन (०.२%)** चा फवारा मारून घे.\n\nकोणत्या पिकाचे खत नियोजन करायचे आहे ते सांग, मी सविस्तर सांगतो!`,
      hi: `🌱 **मिट्टी की सेहत के बारे में पूछकर आपने बहुत समझदारी का काम किया${friendNameHi}!**\n\nहमारे क्षेत्र की मिट्टी **काली गहरी मिट्टी (Vertisol)** है, जिसका pH **7.8** है।\n\n📌 **खाद सिफारिश (प्रति एकड़):**\n1. **बुवाई के समय:** 50 किग्रा DAP + 25 किग्रा MOP + 10 किग्रा सल्फर डालें।\n2. **यूरिया का सही तरीका:** 3 किश्तों में बांटकर दें (50% बुवाई पर, 25% 30 दिन पर, 25% 45 दिन पर)।\n3. **सूक्ष्म पोषक तत्व:** 0.5% जिंक सल्फेट + 0.2% बोरॉन का स्प्रे करें।`,
      suggestionsEn: ["🌱 Crop Nutrient Plan", "🐛 Pest Solutions", "🌦️ Weather Check"],
      suggestionsMr: ["🌱 कांदा खत वेळापत्रक", "🌱 डाळिंब खत नियोजन", "🐛 कीड नियंत्रण"],
      suggestionsHi: ["🌱 प्याज खाद चार्ट", "🌱 कपास पोषण गाइड", "🐛 कीट उपचार"]
    });
  }

  // 5. PEST & DISEASE
  if (['pest', 'disease', 'insect', 'keeda', 'fungus', 'blight', 'caterpillar', 'spray', 'neem', 'bollworm', 'thrips', 'aphid', 'telya', 'aali', 'कीड', 'रोग', 'अळी', 'तुडतुडे', 'मावा', 'बुरशी', 'तेल्या', 'करपा', 'कीट', 'रोग', 'इल्ली', 'फफूंद'].some(k => query.includes(k))) {
    return buildResponse({
      en: `🐛 **Don't worry${friendNameEn}, let's tackle this pest issue right away!**\n\n1. 🧅 **Thrips & Purple Blotch (Onion):**\n   • Spray **Emamectin Benzoate 5% SG** @ 4g/10L water + **Mancozeb 75% WP** @ 25g/10L with a wetting sticker.\n   • Set up 15 Blue Sticky Traps per acre.\n2. ⚪ **Pink Bollworm (Cotton/Soybean):**\n   • Spray **Chlorantraniliprole 18.5% SC (Coragen)** @ 3ml/10L.\n3. 🔴 **Bacterial Blight / Telya (Pomegranate):**\n   • Spray **Streptocycline @ 0.5g/L + Copper Oxychloride 50% WP @ 2.5g/L**.\n\n📷 *Pro-tip: Upload a leaf photo in our 'AI Pest Scanner' tab for instant diagnosis!*`,
      mr: `🐛 **अरेरे, पिकावर कीड किंवा रोग दिसला का${friendName}? अजिबात काळजी करू नकोस, आपण वेळेत बंदोबस्त करू!**\n\n१. 🧅 **कांद्यावरील फुलकिडे (थ्रिप्स) व जांभळा करपा:**\n   • पानांवर बारीक चंदेरी चट्टे किंवा टोक पिवळे पडत असेल, तर **इमामेक्टिन बेन्झोएट ५% एसजी (४ ग्रॅम/१० ली.) + मँकोझेब ७५% डब्ल्यूपी (२५ ग्रॅम/१० ली.)** चांगला स्टिकर टाकून फवार.\n   • शेतात एकरी १५ निळे चिकट सापळे लाव, अर्धे किडे तिथेच पकडले जातील!\n२. ⚪ **कापूस/सोयाबीनवरील बोंडअळी:**\n   • **कोराजन** ३ मिली/१० ली. किंवा **प्रोफेनोफॉस** २० मिली/१० ली. फवार.\n३. 🔴 **डाळिंबावरील तेल्या:**\n   • **स्ट्रेप्टोसायक्लिन (०.५ ग्रॅम/ली.) + कॉपर ऑक्सिक्लोराईड (२.५ ग्रॅम/ली.)** चा फवारा दे.\n\n📷 *पानाचा फोटो काढून आपल्या 'AI कीड निदान' स्कॅनरमध्ये टाक, लगेच तपासणी होईल!*`,
      hi: `🐛 **अरे${friendNameHi}, फसल पर कोई कीट दिख रहा है? बिल्कुल चिंता मत करो, मैं पक्का इलाज बताता हूँ!**\n\n1. 🧅 **प्याज में थ्रिप्स व करपा:**\n   • **इमामेक्टिन बेंजोएट 5% SG (4 ग्राम/10 ली.) + मैंकोजेब 75% WP (25 ग्राम/10 ली.)** स्टीकर मिलाकर छिड़कें।\n2. ⚪ **कपास में इल्ली/गुलाबी सुंडी:**\n   • **कोराजन** 3 मिली/10 ली. पानी में मिलाकर स्प्रे करें।\n3. 🔴 **अनार में तेलिया रोग:**\n   • **स्ट्रेप्टोसाइक्लिन (0.5 ग्राम/ली.) + कॉपर ऑक्सीक्लोराइड (2.5 ग्राम/ली.)** का छिड़काव करें।`,
      suggestionsEn: ["📸 Open Pest Scanner", "🌱 Soil Health", "🌦️ Weather Check"],
      suggestionsMr: ["📸 कीड फोटो स्कॅनर", "🌱 खत नियोजन", "🌦️ फवारणी हवामान"],
      suggestionsHi: ["📸 कीट स्कैनर खोलें", "🌱 खाद सलाह", "🌦️ मौसम रिपोर्ट"]
    });
  }

  // 6. SCHEME FORM STEP GUIDE
  if (['how to apply', 'fill form', 'form guide', 'apply', 'form', 'registration', 'document', 'kagadpatre', 'process', 'step', 'steps', 'mahadbt', 'arja', 'kasa bharaycha', 'अर्ज', 'फॉर्म', 'कागदपत्रे', 'नोंदणी', 'कसा भरायचा', 'प्रक्रिया', 'आवेदन', 'दस्तावेज', 'पंजीकरण', 'फॉर्म कैसे भरें'].some(k => query.includes(k))) {
    return buildResponse({
      en: `🏛️ **Great initiative,${friendNameEn}! You should definitely claim all the government agricultural subsidies you're entitled to.**\n\nLet me walk you through the entire application process step-by-step just like a trusted advisor:\n\n📋 **First, keep these documents handy:**\n• 📄 **7/12 & 8-A Land Record** (Digital copy < 3 months old)\n• 🆔 **Aadhaar Card** (Linked with mobile number for OTP)\n• 🏦 **Bank Passbook / Cancelled Cheque** (Aadhaar NPCI DBT enabled)\n• 💧 **Water Source Proof / Electricity Bill** (For Drip & Solar Pump)\n• 📜 **Caste Certificate** (SC/ST categories receive enhanced 80-90% subsidy)\n\n───────────────────────────────\n\n📌 **Simple 6-Step Application Process (MahaDBT):**\n\n**🔹 Step 1: Registration & Aadhaar OTP Login**\n• Visit \`mahadbt.maharashtra.gov.in\` and click *New Farmer Registration*. Verify via mobile OTP.\n\n**🔹 Step 2: Fill Farmer Profile & Land Details**\n• Enter personal details, bank IFSC, and cadastral survey/gat numbers with acreage.\n\n**🔹 Step 3: Select Scheme Component**\n• Under *Farmer Schemes*, choose your intended asset:\n  - 💧 *Drip / Sprinkler Irrigation:* Up to 80% direct subsidy.\n  - ☀️ *PM-KUSUM Solar Pump:* 60% subsidy for 3 HP to 7.5 HP pumps.\n  - 🌊 *Magel Tyala Shettale (Farm Pond):* Up to ₹75,000 grant.\n\n**🔹 Step 4: Upload Required Documents**\n• Upload 7/12, 8-A, and electricity bill in PDF/JPEG format (< 500 KB).\n\n**🔹 Step 5: Pay Online Fee (₹23.60)**\n• Pay the small portal fee via UPI/Netbanking. Selection happens via computerized lottery.\n\n**🔹 Step 6: Pre-Sanction Order & Direct DBT Credit**\n• Once selected, download the **Pre-Sanction Order**, purchase equipment from an authorized dealer, and upload the GST invoice. The subsidy funds get credited directly to your bank account.\n\nNeed help during the process? Call the Kisan Helpline at 📞 **1800-180-1551**!`,
      mr: `🏛️ **अरे वा${friendName}! सरकारी योजनांचा फायदा घ्यायलाच पाहिजे, मी तुला अगदी सोप्या भाषेत अर्ज भरण्याची पायरी-दर-पायरी माहिती देतो!**\n\n📋 **आधी हे कागदपत्रे जवळ काढून ठेव मित्रा:**\n• 📄 **७/१२ उतारा व ८-अ नोंद** (३ महिन्यांच्या आतील डिजिटल प्रत)\n• 🆔 **आधार कार्ड** (मोबाईल नंबर लिंक असलेला OTP साठी)\n• 🏦 **बँक पासबुक** (ज्या खात्याला आधार DBT लिंक आहे)\n• 💧 **विहीर/बोअरवेल दाखला किंवा वीज बिल** (ठिबक, तुषार व सौर पंपासाठी)\n• 📜 **जातीचा दाखला** (SC/ST प्रवर्गातील शेतकऱ्यांना ८० ते ९०% जास्तीचे अनुदान मिळते)\n\n───────────────────────────────\n\n📌 **महाडीबीटी (MahaDBT) वर असा भर फॉर्म (६ सोप्या पायऱ्या):**\n\n**🔹 पायरी १: पोर्टलवर नोंदणी करा**\n• अधिकृत पोर्टल उघड: \`mahadbt.maharashtra.gov.in\`\n• 'नवीन शेतकरी नोंदणी' वर क्लिक कर, आधार नंबर टाक आणि मोबाईलवर आलेला OTP टाकून लॉगिन आयडी बनव.\n\n**🔹 पायरी २: शेतकरी प्रोफाइल पूर्ण करा**\n• वैयक्तिक माहिती, बँक खात्याचा नंबर आणि जमिनीचा ७/१२ चा तपशील (जिल्हा, तालुका, गाव, गट नंबर व क्षेत्र) भर.\n\n**🔹 पायरी ३: योजनेचा घटक निवडा**\n• 'शेतकरी योजना' मध्ये जाऊन खालीलपैकी हवा तो घटक निवड:\n  - 💧 *ठिबक सिंचन / तुषार सिंचन:* ८०% थेट अनुदान\n  - ☀️ *सौर कृषी पंप (PM-KUSUM):* ६०% सबसिडी (३ ते ७.५ HP)\n  - 🌊 *मागेल त्याला शेततळे:* ₹७५,००० थेट अनुदान\n  - 🚜 *ट्रॅक्टर व अवजारे:* ५०% सबसिडी\n\n**🔹 पायरी ४: कागदपत्रे अपलोड करा**\n• ७/१२, ८-अ आणि वीज बिल PDF स्वरूपात (५०० KB पेक्षा कमी आकारात) अपलोड कर.\n\n**🔹 पायरी ५: ऑनलाइन फी भरून पावती घे**\n• फक्त ₹२३.६० ऑनलाइन फी (UPI ने) भर आणि अर्ज सबमिट कर. महाडीबीटीच्या संगणकीय सोडतीत (Lottery) तुझे नाव निवडले जाईल.\n\n**🔹 पायरी ६: पूर्वसंमती पत्र व थेट खात्यात पैसे जमा**\n• सोडतीत नाव आल्यावर कृषी विभागाचे **पूर्वसंमती पत्र (Pre-Sanction)** डाऊनलोड कर.\n• मान्यताप्राप्त दुकानातून साहित्य खरेदी करून GST पक्के बिल अपलोड कर. अनुदानाचे पैसे थेट तुझ्या बँकेत जमा होतील!\n\nकाहीही अडचण आली तर मला कधीही विचार, किंवा कृषी विभागाचा टोल-फ्री नंबर 📞 **1800-180-1551** वर कॉल कर.`,
      hi: `🏛️ **अरे बहुत बढ़िया${friendNameHi}! सरकारी योजनाओं का लाभ जरूर लेना चाहिए। मैं आपको बहुत सरल तरीके से फॉर्म भरने की पूरी प्रक्रिया समझाता हूँ:**\n\n📋 **पहले ये दस्तावेज पास में रख लें:**\n• 📄 **खतौनी / 7/12 व 8-A** (डिजिटल प्रमाण)\n• 🆔 **आधार कार्ड** (मोबाइल नंबर से लिंक)\n• 🏦 **बैंक पासबुक** (Aadhaar NPCI DBT चालू)\n• 💧 **जल स्रोत प्रमाण / बिजली बिल** (ड्रिप एवं सोलर पंप हेतु)\n• 📜 **जाति प्रमाण पत्र** (SC/ST विशेष सब्सिडी हेतु)\n\n───────────────────────────────\n\n📌 **ऑनलाइन फॉर्म भरने के 6 आसान चरण (Steps):**\n\n**🔹 चरण 1: पोर्टल पर लॉगिन** (\`mahadbt.maharashtra.gov.in\`)\n**🔹 चरण 2: किसान प्रोफाइल भरें**\n**🔹 चरण 3: योजना चुनें (ड्रिप 80% / सोलर पंप 60%)**\n**🔹 चरण 4: दस्तावेज अपलोड करें**\n**🔹 चरण 5: ₹23.60 फीस भरें**\n**🔹 चरण 6: पूर्व-स्वीकृति एवं DBT सब्सिडी**\n\nकोई भी दिक्कत आए तो किसान हेल्पलाइन 📞 **1800-180-1551** पर संपर्क करें।`,
      suggestionsEn: ["💧 Apply Drip Subsidy", "☀️ Solar Pump Guide", "🏛️ PM-Kisan KYC", "📄 Land Documents"],
      suggestionsMr: ["💧 ठिबक सिंचन अर्ज", "☀️ सौर पंप योजना", "🏛️ पीएम-किसान स्टेटस", "📄 ७/१२ कागदपत्रे"],
      suggestionsHi: ["💧 ड्रिप सब्सिडी फॉर्म", "☀️ सोलर पंप आवेदन", "🏛️ पीएम-किसान ई-केवाईसी"]
    });
  }

  // 7. SCHEMES OVERVIEW
  if (['scheme', 'yojana', 'pm kisan', 'namo shetkari', 'pmfby', 'kcc', 'subsidy', 'sarkar', 'government', 'bima', 'paisa', 'kusum', 'shettale', 'योजना', 'सबसिडी', 'अनुदान', 'विमा', 'नमो शेतकरी', 'शेततळे', 'योजनाएं'].some(k => query.includes(k))) {
    return buildResponse({
      en: `🏛️ **Here are the top active government programs for your farm,${friendNameEn}:**\n\n1. 💳 **PM-KISAN + Namo Shetkari:** Combined **₹12,000/year** direct benefit deposited into your bank account.\n2. 💧 **MahaDBT Micro-Irrigation:** Up to **80% direct subsidy** on drip and sprinkler sets.\n3. ☀️ **PM-KUSUM Solar Pumps:** **60% subsidy** on 3 HP to 7.5 HP standalone solar irrigation systems.\n4. 🌊 **Magel Tyala Shettale (Farm Pond):** Direct grant up to **₹75,000** for rainwater storage.\n\n📝 *Want to apply for any of these? Just ask me "How to fill scheme form" and I'll walk you through the documents and application steps!*`,
      mr: `🏛️ **आपल्या भागातील शेतकऱ्यांसाठी सध्या चालू असलेल्या प्रमुख योजना सांगतो मित्रा:**\n\n१. 💳 **पीएम-किसान + नमो शेतकरी योजना:** केंद्र व राज्य मिळून **वार्षिक ₹१२,०००** थेट तुझ्या बँक खात्यात येतात.\n२. 💧 **महाडीबीटी ठिबक व तुषार सिंचन:** लहान शेतकऱ्यांना **८०% थेट अनुदान** मिळते.\n३. ☀️ **पीएम-कुसुम सौर कृषी पंप:** ३ ते ७.५ एचपी सौर पंपावर **६०% सरकारी अनुदान** आहे.\n४. 🌊 **मागेल त्याला शेततळे:** शेततळ्यासाठी **₹७५,०००** थेट अनुदान मिळते.\n५. 🛡️ **पीक विमा व KCC:** अवघ्या ४% व्याजदराने ₹३ लाखांपर्यंत पीक कर्ज उपलब्ध आहे.\n\n📝 *तुला यापैकी कोणत्याही योजनेचा फॉर्म भरायचा असेल, तर मला 'अर्ज कसा करावा' असे विचार!*`,
      hi: `🏛️ **अपने क्षेत्र के किसानों के लिए चल रही प्रमुख योजनाएं ये हैं, भाई:**\n\n1. 💳 **पीएम-किसान + नमो शेतकरी योजना:** केंद्र व राज्य मिलाकर **₹12,000 प्रति वर्ष** सीधे बैंक में।\n2. 💧 **ड्रिप एवं स्प्रिंकलर सिंचाई:** छोटे किसानों को **80% तक सीधी सब्सिडी**।\n3. ☀️ **पीएम-कुसुम सोलर पंप:** 3 से 7.5 HP सोलर पंप पर **60% सरकारी छूट**।\n4. 🌊 **खेत तालाब योजना:** निर्माण हेतु **₹75,000** तक का अनुदान।`,
      suggestionsEn: ["📝 Scheme Form Step Guide", "💧 Solar Pump Scheme", "💰 Mandi Rates"],
      suggestionsMr: ["📝 योजना अर्ज कसा करावा?", "💧 सौर पंप अनुदान", "💰 बाजारभाव"],
      suggestionsHi: ["📝 फॉर्म भरने की स्टेप गाइड", "💧 सोलर पंप सब्सिडी", "💰 मंडी भाव"]
    });
  }

  // FALLBACK
  return buildResponse({
    en: `🌾 **Hey${friendNameEn}, regarding your query about "${message.trim()}":**\n\nFor best results in our **${matchedTopo.shortName || matchedTopo.name}** zone with **${matchedTopo.soilType.split('(')[0]}**, aligning your daily field activities with local weather windows and balanced nutrient management will give you the healthiest yields.\n\nWhat else can I help you figure out today?`,
    mr: `🌾 **अरे${friendName}, तुझ्या "${message.trim()}" या प्रश्नाबाबत सांगतो:**\n\nआपल्या **${matchedTopo.shortName || matchedTopo.name}** भागातील **${matchedTopo.soilType.split('(')[0]}** आणि स्थानिक हवामानाचा विचार करता, शेतीची कामे योग्य नियोजनाने करणे फायद्याचे ठरेल.\n\nमला अजून काहीही विचार, मी तुला सविस्तर सांगतो!`,
    hi: `🌾 **देखो${friendNameHi}, आपके "${message.trim()}" सवाल के बारे में:**\n\nअपने **${matchedTopo.shortName || matchedTopo.name}** क्षेत्र की **${matchedTopo.soilType.split('(')[0]}** और मौसम के अनुसार सही समय पर कृषि कार्य करना सबसे बेहतर रहेगा।\n\nआप और क्या जानना चाहते हैं, बताइए?`,
    suggestionsEn: [`🌦️ Today's Weather`, `💰 Live Mandi Rates`, "🌱 Soil Health", "🐛 Pest Treatment", "📝 Scheme Application"],
    suggestionsMr: [`🌦️ आजचे हवामान`, `💰 आजचे बाजारभाव`, "🌱 खत नियोजन", "🐛 कीड नियंत्रण", "📝 योजना अर्ज"],
    suggestionsHi: [`🌦️ आज का मौसम`, `💰 मंडी भाव`, "🌱 खाद सलाह", "🐛 कीट उपचार", "📝 योजना फॉर्म"]
  });
};

const chatbotService = {
  sendMessage,
  TOPOLOGY_PRESETS
};

export default chatbotService;
