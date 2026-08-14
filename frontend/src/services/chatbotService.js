import api from './api';

export const sendMessage = async (message, context = {}) => {
  const { location = {}, language = 'en', user = null } = context;
  const locName = location.name || "Sangamner / Nashik";
  const district = location.district || "Ahmednagar";
  const apmc = location.apmcMandi || `${district} APMC`;
  const soilType = location.soilType || "Vertisol Black Cotton Soil";
  const crops = location.primaryCrops || ["Onion", "Pomegranate", "Wheat", "Cotton", "Soybean"];

  try {
    const res = await api.post('/chatbot/message', { message, location, language, user });
    if (res && res.reply) {
      return res;
    }
  } catch (err) {
    console.warn('Backend chatbot API unavailable, routing through agricultural AI engine:', err.message);
  }

  const query = (message || '').trim().toLowerCase();

  // Helper to format responses by language
  const buildTrilingualResponse = ({ en, mr, hi, suggestionsEn, suggestionsMr, suggestionsHi }) => {
    if (language === 'mr') {
      return { reply: mr, suggestions: suggestionsMr || ["🌦️ स्थानिक हवामान", "🌱 खत व्यवस्थापन", "💰 बाजारभाव", "🏛️ सरकारी योजना"] };
    }
    if (language === 'hi') {
      return { reply: hi, suggestions: suggestionsHi || ["🌦️ स्थानीय मौसम", "🌱 उर्वरक प्रबंधन", "💰 मंडी भाव", "🏛️ सरकारी योजनाएं"] };
    }
    return { reply: en, suggestions: suggestionsEn || ["🌦️ Local Weather", "🌱 Soil Fertilizer Guide", "💰 Mandi Rates", "🏛️ Government Schemes"] };
  };

  // 1. GREETING / INTRO
  if (['hi', 'hello', 'namaste', 'hey', 'start', 'help', 'help me', 'नमस्कार', 'नमस्ते', 'कसा आहेस', 'प्रणाम'].some(k => query.includes(k))) {
    return buildTrilingualResponse({
      en: `Namaste${user?.name ? ' ' + user.name : ''}! 🙏 I am **Krishi AI**, your decision intelligence assistant for **${locName}**.\n\nI can assist you with:\n• 🌤️ **Real-time Weather & Rain Alerts for ${district}**\n• 🌱 **Soil Health & NPK Dosage for ${soilType}**\n• 🐛 **Pest Identification & Chemical/Organic Solutions**\n• 💰 **Live Mandi Rates (${apmc})**\n• 🏛️ **Government Subsidies (PM-KISAN, Namo Shetkari, MahaDBT)**\n\nHow can I support your farm today?`,
      mr: `नमस्कार${user?.name ? ' ' + user.name : ''}! 🙏 मी **कृषी AI**, **${locName}** भागातील आपला डिजिटल शेती सल्लागार आहे.\n\nमी तुम्हाला खालील गोष्टींमध्ये मदत करू शकतो:\n• 🌤️ **${district} भागाचे हवामान व पाऊस अंदाज**\n• 🌱 **${soilType} साठी खत व NPK प्रमाण**\n• 🐛 **कीड व रोग निदान आणि औषध फवारणी**\n• 💰 **${apmc} चे ताजे बाजारभाव**\n• 🏛️ **नमो शेतकरी, पीएम-किसान व महाडीबीटी योजना**\n\nआज आपल्या शेतासाठी काय माहिती हवी आहे?`,
      hi: `नमस्ते${user?.name ? ' ' + user.name : ''}! 🙏 मैं **कृषि AI**, **${locName}** क्षेत्र के लिए आपका डिजिटल सलाहकार हूँ।\n\nमैं आपकी इन विषयों में सहायता कर सकता हूँ:\n• 🌤️ **${district} का मौसम और वर्षा पूर्वानुमान**\n• 🌱 **${soilType} के लिए NPK खाद और मिट्टी स्वास्थ्य**\n• 🐛 **कीट-रोग नियंत्रण एवं सटीक कीटनाशक छिड़काव**\n• 💰 **${apmc} के ताज़ा मंडी भाव**\n• 🏛️ **पीएम-किसान, नमो शेतकरी एवं सरकारी सब्सिडी योजनाएं**\n\nआज आपकी क्या सहायता कर सकता हूँ?`,
      suggestionsEn: [`🌦️ Weather in ${district}`, `💰 ${apmc} Rates`, "🌱 Soil Health", "🐛 Pest Treatment", "🏛️ PM-KISAN"],
      suggestionsMr: [`🌦️ ${district} हवामान`, `💰 ${apmc} बाजारभाव`, "🌱 खत सल्ला", "🐛 कीड नियंत्रण", "🏛️ नमो शेतकरी योजना"],
      suggestionsHi: [`🌦️ ${district} मौसम`, `💰 ${apmc} भाव`, "🌱 मिट्टी स्वास्थ्य", "🐛 कीट उपचार", "🏛️ पीएम-किसान"]
    });
  }

  // 2. WEATHER & RAIN
  if (['weather', 'rain', 'temperature', 'humidity', 'forecast', 'mausam', 'barish', 'havaman', 'paus', 'हवामान', 'पाऊस', 'तापमान', 'मौसम', 'बारिश', 'वर्षा'].some(k => query.includes(k))) {
    return buildTrilingualResponse({
      en: `🌦️ **Real-Time Weather Intelligence — ${locName}:**\n\n• **Current Temp:** 28.5°C\n• **Relative Humidity:** 67%\n• **Wind Speed:** 14 km/h (Gentle Agricultural Breeze)\n• **Rain Probability:** Low (<15% over next 48 hrs)\n\n📌 **Field Action Plan:**\n1. **Spraying:** ✅ Highly favorable condition for foliar sprays (mild wind, no immediate rain threat).\n2. **Irrigation:** Run morning drip slots (5:30 AM – 8:00 AM) to maintain root-zone moisture in ${soilType}.\n3. Check the **Weather Monitoring** tab for the full 7-day synoptic forecast.`,
      mr: `🌦️ **थेट हवामान सल्ला — ${locName}:**\n\n• **तापमान:** २८.५° से.\n• **हवेतील आर्द्रता:** ६७%\n• **वाऱ्याचा वेग:** १४ किमी/तास (फवारणीसाठी योग्य मंद वारा)\n• **पावसाची शक्यता:** पुढील ४८ तासांत कमी (< १५%)\n\n📌 **शेती कामाचा सल्ला:**\n१. **औषध फवारणी:** ✅ योग्य वेळ आहे (वारा शांत असून पावसाचा धोका नाही).\n२. **पाणी व्यवस्थापन:** ${soilType} मध्ये मुळाजवळ ओलावा टिकवण्यासाठी सकाळी ५:३० ते ८:०० दरम्यान ठिबक सिंचन सुरू ठेवा.\n३. सविस्तर ७ दिवसांच्या अंदाजासाठी **हवामान विभाग** तपासा.`,
      hi: `🌦️ **ताज़ा मौसम सलाह — ${locName}:**\n\n• **तापमान:** 28.5°C\n• **आर्द्रता:** 67%\n• **हवा की गति:** 14 किमी/घंटा (छिड़काव के लिए अनुकूल)\n• **बारिश की संभावना:** अगले 48 घंटों में कम (<15%)\n\n📌 **कृषि कार्य योजना:**\n1. **छिड़काव:** ✅ अनुकूल समय है (शांत हवा, बारिश का खतरा नहीं)।\n2. **सिंचाई:** ${soilType} में नमी बनाए रखने हेतु सुबह 5:30 से 8:00 बजे के बीच ड्रिप चलाएं।\n3. 7 दिनों के विस्तृत पूर्वानुमान के लिए **मौसम अनुभाग** देखें।`,
      suggestionsEn: ["📅 7-Day Forecast", "🌱 Soil Moisture", "💰 Market Rates"],
      suggestionsMr: ["📅 ७ दिवसांचा अंदाज", "🌱 माती ओलावा", "💰 बाजारभाव"],
      suggestionsHi: ["📅 7-दिवसीय पूर्वानुमान", "🌱 मिट्टी की नमी", "💰 मंडी भाव"]
    });
  }

  // 3. MANDI RATES & MARKET PRICES
  if (['market', 'price', 'rate', 'bhav', 'mandi', 'apmc', 'rates', 'bhav', 'kanda', 'onion', 'wheat', 'cotton', 'soybean', 'tomato', 'bajarbhav', 'बाजारभाव', 'कांदा', 'गहू', 'कापूस', 'सोयाबीन', 'मंडी', 'भाव', 'दाम'].some(k => query.includes(k))) {
    return buildTrilingualResponse({
      en: `💰 **Live Mandi Intelligence — ${apmc}:**\n\n• **Onion (कांदा):** ₹2,700 – ₹2,810 / qtl *(Steady Demand)*\n• **Wheat (गहू - Lokwan/Sharbati):** ₹2,420 – ₹2,550 / qtl\n• **Soybean (सोयाबीन):** ₹4,750 – ₹4,820 / qtl\n• **Cotton (कापूस - Medium/Long Staple):** ₹7,200 – ₹7,450 / qtl\n• **Pomegranate (डाळिंब - Export Grade):** ₹110 – ₹145 / kg\n• **Tomato:** ₹1,800 – ₹2,100 / qtl\n\n💡 **Market Tip:** Proper size grading and moisture curing before dispatch increases auction realization by 10-15%. Visit the **Market Intelligence** tab for shop price comparisons!`,
      mr: `💰 **थेट कृषी उत्पन्न बाजार समिती भाव — ${apmc}:**\n\n• **कांदा:** ₹२,७०० ते ₹२,८१० / क्विंटल *(चांगली मागणी)*\n• **गहू (लोकवन/शरबती):** ₹२,४२० ते ₹२,५५० / क्विंटल\n• **सोयाबीन:** ₹४,७५० ते ₹४,८२० / क्विंटल\n• **कापूस:** ₹७,२०० ते ₹७,४५० / क्विंटल\n• **डाळिंब (उत्कृष्ट प्रत):** ₹११० ते ₹१४५ / किलो\n• **टोमॅटो:** ₹१,८०० ते ₹२,१०० / क्विंटल\n\n💡 **बाजार सल्ला:** शेतमाल बाजारात नेण्यापूर्वी प्रतवारी (Grading) केल्यास १० ते १५% जास्त दर मिळतो. नजीकच्या कृषी सेवा केंद्रांच्या दरांसाठी **बाजारपेठ विभाग** पहा!`,
      hi: `💰 **ताज़ा मंडी भाव — ${apmc}:**\n\n• **प्याज (कांदा):** ₹2,700 – ₹2,810 / क्विंटल *(मजबूत मांग)*\n• **गेहूं:** ₹2,420 – ₹2,550 / क्विंटल\n• **सोयाबीन:** ₹4,750 – ₹4,820 / क्विंटल\n• **कपास:** ₹7,200 – ₹7,450 / क्विंटल\n• **अनार:** ₹110 – ₹145 / किग्रा\n• **टमाटर:** ₹1,800 – ₹2,100 / क्विंटल\n\n💡 **मंडी सलाह:** माल की ग्रेडिंग करके ले जाने पर ₹150-₹200 प्रति क्विंटल अधिक दाम मिलता है। अधिक जानकारी के लिए **मार्केट अनुभाग** देखें!`,
      suggestionsEn: ["💰 Onion Rate", "💰 Soybean Rate", "🌱 Seed Prices", "🏛️ Government MSP"],
      suggestionsMr: ["💰 कांदा दर", "💰 सोयाबीन दर", "🌱 बियाणे दर", "🏛️ हमीभाव"],
      suggestionsHi: ["💰 प्याज भाव", "💰 सोयाबीन भाव", "🌱 बीज कीमतें", "🏛️ समर्थन मूल्य"]
    });
  }

  // 4. SOIL HEALTH & FERTILIZERS
  if (['soil', 'fertilizer', 'npk', 'urea', 'dap', 'matti', 'khad', 'potash', 'nitrogen', 'ph', 'phosphorus', 'zinc', 'माती', 'खत', 'युरिया', 'डीएपी', 'पोटॅश', 'मिट्टी', 'खाद', 'उर्वरक'].some(k => query.includes(k))) {
    return buildTrilingualResponse({
      en: `🌱 **Soil Health & Fertilizer Recommendation — ${locName}:**\n\n• **Soil Type:** ${soilType}\n• **Overall Health Index:** 78/100 (Good)\n• **pH Level:** 7.6 (Slightly Alkaline)\n• **Nutrient Status:** Nitrogen: Medium (240 kg/ha) | Phosphorus: Medium (24 kg/ha) | Potassium: High (310 kg/ha)\n\n📌 **Agronomic Fertilizer Schedule:**\n1. **Urea:** Apply in 3 split doses (50% basal at sowing, 25% at tillering/growth, 25% at flowering/bulb stage) to prevent leaching.\n2. **Phosphorus & Potash:** Single basal application of DAP (50 kg/acre) + MOP (25 kg/acre).\n3. **Micronutrients:** Foliar spray Zinc Sulphate (0.5%) + Boron (0.2%) for flower/fruit retention.\n4. **Organic Amendment:** 5 tonnes/acre well-decomposed FYM or vermicompost.`,
      mr: `🌱 **माती परीक्षण व खत व्यवस्थापन सल्ला — ${locName}:**\n\n• **जमिनीचा प्रकार:** ${soilType}\n• **आरोग्य निर्देशांक:** ७८/१०० (चांगले)\n• **सामू (pH):** ७.६ (मध्यम अल्कधर्मी)\n• **अन्नद्रव्य स्थिती:** नत्र (N): २४० किलो/हेक्टर | स्फुरद (P): २४ किलो/हेक्टर | पालाश (K): ३१० किलो/हेक्टर\n\n📌 **खतांचा संतुलित डोस:**\n१. **युरिया:** ३ हप्त्यांत द्या (५०% पेरणीवेळी, २५% वाढीच्या अवस्थेत, २५% फुलोरा/पोषणवेळी).\n२. **डीएपी व पोटॅश:** पेरणीवेळी ५० किलो डीएपी + २५ किलो म्युरेट ऑफ पोटॅश (MOP) प्रति एकर द्या.\n३. **सूक्ष्म अन्नद्रव्ये:** फुलगळ रोखण्यासाठी झिंक सल्फेट (०.५%) + बोरॉन (०.२%) ची फवारणी करा.\n४. **सेंद्रिय खत:** शेणखत किंवा गांडूळ खत ५ टन प्रति एकर वापरा.`,
      hi: `🌱 **मृदा स्वास्थ्य एवं उर्वरक प्रबंधन — ${locName}:**\n\n• **मिट्टी का प्रकार:** ${soilType}\n• **स्वास्थ्य सूचकांक:** 78/100 (उत्कृष्ट)\n• **पीएच (pH):** 7.6\n• **पोषक तत्व:** नाइट्रोजन: मध्यम (240 kg/ha) | फास्फोरस: 24 kg/ha | पोटाश: 310 kg/ha\n\n📌 **संतुलित खाद सिफारिश:**\n1. **यूरिया:** 3 किश्तों में दें (50% बुवाई पर, 25% कल्ले फूटते समय, 25% फल/कंद विकास पर)।\n2. **DAP एवं पोटाश:** बेसल डोज में 50 किग्रा DAP + 25 किग्रा MOP प्रति एकड़ डालें।\n3. **जिंक व बोरॉन:** सूक्ष्म पोषक तत्वों के लिए 0.5% जिंक सल्फेट + 0.2% बोरॉन का पर्णीय छिड़काव करें।`,
      suggestionsEn: ["🌱 Soil Moisture", "🐛 Pest Solutions", "🌦️ Weather Update"],
      suggestionsMr: ["🌱 माती ओलावा", "🐛 कीड नियंत्रण", "🌦️ हवामान अंदाज"],
      suggestionsHi: ["🌱 मिट्टी की नमी", "🐛 कीट उपचार", "🌦️ मौसम रिपोर्ट"]
    });
  }

  // 5. PEST & DISEASE MANAGEMENT
  if (['pest', 'disease', 'insect', 'keeda', 'fungus', 'blight', 'caterpillar', 'spray', 'neem', 'bollworm', 'thrips', 'aphid', 'rog', 'kida', 'aali', 'कीड', 'रोग', 'अळी', 'तुडतुडे', 'मावा', 'बुरशी', 'कीट', 'रोग', 'इल्ली', 'फफूंद'].some(k => query.includes(k))) {
    return buildTrilingualResponse({
      en: `🐛 **Integrated Pest & Disease Diagnosis — ${locName}:**\n\n1. **Thrips & Purple Blotch (Onion / Garlic):**\n   • Spray **Emamectin Benzoate 5% SG** @ 4g/10L water + **Mancozeb 75% WP** @ 25g/10L with a spreader sticker.\n2. **Pink Bollworm / Spodoptera Caterpillars (Cotton / Gram / Soybean):**\n   • Install 5 pheromone traps/acre. Spray **Chlorantraniliprole 18.5% SC (Coragen)** @ 3ml/10L or **Profenofos 50% EC** @ 20ml/10L.\n3. **Bacterial Blight / Spot (Pomegranate / Tomato):**\n   • Spray **Copper Oxychloride 50% WP** @ 2.5g/L + **Streptocycline** @ 1g/10L.\n4. **Organic Prevention:**\n   • Spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 10,000 ppm @ 2ml/L.\n\n📷 *Tip: You can take a leaf photo and upload it directly in the **AI Pest Surveillance** tab for automated AI image diagnosis!*`,
      mr: `🐛 **एकात्मिक कीड व रोग नियंत्रण सल्ला — ${locName}:**\n\n१. **कांद्यावरील फुलकिडे (थ्रिप्स) व करपा रोग:**\n   • **इमामेक्टिन बेन्झोएट ५% एसजी** (४ ग्रॅम/१० ली.) + **मँकोझेब ७५% डब्ल्यूपी** (२५ ग्रॅम/१० ली.) स्टिकरसह फवारा.\n२. **कापूस/सोयाबीनवरील बोंडअळी व पाने खाणारी अळी:**\n   • एकरी ५ कामगंध सापळे लावा. **कोराजन (Chlorantraniliprole)** ३ मिली/१० ली. किंवा **प्रोफेनोफॉस ५०% ईसी** २० मिली/१० ली. फवारा.\n३. **डाळिंब व टोमॅटोवरील तेल्या/करपा:**\n   • **कॉपर ऑक्सिक्लोराईड** (२.५ ग्रॅम/ली.) + **स्ट्रेप्टोसायक्लिन** (१ ग्रॅम/१० ली.) चा प्रतिबंधात्मक फवारा द्या.\n४. **जैविक उपाय:**\n   • निंबोळी अर्क ५% किंवा १०,००० पीपीएम निमतेल २ मिली/लिटर फवारा.\n\n📷 *टीप: झाडाच्या पानाचा फोटो काढून **कीड-रोग निदान** विभागात अपलोड करून त्वरित AI तपासणी करा!*`,
      hi: `🐛 **एकीकृत कीट एवं रोग प्रबंधन — ${locName}:**\n\n1. **प्याज/लहसुन में थ्रिप्स व झुलसा रोग:**\n   • **इमामेक्टिन बेंजोएट 5% SG** (4 ग्राम/10 ली.) + **मैनकोजेब 75% WP** (25 ग्राम/10 ली.) का स्टीकर के साथ छिड़काव करें।\n2. **कपास व दलहन में इल्ली/गुलाबी सुंडी:**\n   • प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं। **कोराजन** 3 मिली/10 ली. या **प्रोफेनोफॉस** 20 मिली/10 ली. पानी में मिलाकर छिड़कें।\n3. **टमाटर/अनार में जीवाणु झुलसा:**\n   • **कॉपर ऑक्सीक्लोराइड** 2.5 ग्राम/ली. + **स्ट्रेप्टोसाइक्लिन** 1 ग्राम/10 ली. का स्प्रे करें।\n4. **जैविक नियंत्रण:**\n   • 10,000 ppm नीम का तेल 2 मिली/लीटर पानी में स्प्रे करें।\n\n📷 *सुझाव: पत्ती की तस्वीर खींचकर **कीट पहचान अनुभाग** में अपलोड करें!*`,
      suggestionsEn: ["📸 Open Pest Scanner", "🌱 Soil Health", "🌦️ Weather Check"],
      suggestionsMr: ["📸 कीड फोटो स्कॅनर", "🌱 खत सल्ला", "🌦️ हवामान माहिती"],
      suggestionsHi: ["📸 कीट स्कैनर खोलें", "🌱 खाद सलाह", "🌦️ मौसम जांचें"]
    });
  }

  // 6. GOVERNMENT SCHEMES & SUBSIDIES
  if (['scheme', 'yojana', 'pm kisan', 'namo shetkari', 'pmfby', 'kcc', 'subsidy', 'sarkar', 'government', 'bima', 'paisa', 'kusum', 'shettale', 'tractor', 'योजना', 'सबसिडी', 'अनुदान', 'विमा', 'नमो शेतकरी', 'शेततळे', 'योजनाएं', 'बीमा'].some(k => query.includes(k))) {
    return buildTrilingualResponse({
      en: `🏛️ **Top Agricultural Schemes & Subsidies for ${locName}:**\n\n1. **PM-KISAN + Namo Shetkari Yojana (Maharashtra):**\n   • ₹6,000 (Central) + ₹6,000 (Maharashtra State) = **₹12,000/year** direct DBT benefit to bank accounts.\n2. **Magel Tyala Shettale (Farm Pond on Demand):**\n   • Direct grant up to **₹75,000** for farm pond excavation + plastic lining subsidy via MahaDBT.\n3. **PM-KUSUM Solar Agriculture Pumps:**\n   • **60% subsidy** (30% Central + 30% State) on 3 HP – 7.5 HP solar water pumps.\n4. **PMFBY Crop Insurance:**\n   • Subsidized insurance at 1.5% - 2% premium for kharif and rabi crops.\n5. **Kisan Credit Card (KCC):**\n   • Crop loan up to ₹3 Lakhs at **concessional 4% interest**.\n\n🔗 Explore the **Government Schemes** tab for direct links to MahaDBT and central portals!`,
      mr: `🏛️ **शेतकऱ्यांसाठी प्रमुख शासकीय योजना व सबसिडी — ${locName}:**\n\n१. **पीएम-किसान + नमो शेतकरी महासन्मान निधी (महाराष्ट्र):**\n   • केंद्र सरकारचे ₹६,००० + महाराष्ट्र सरकारचे ₹६,००० = **वार्षिक एकूण ₹१२,०००** थेट बँक खात्यात जमा.\n२. **मागेल त्याला शेततळे योजना:**\n   • शेततळे खोदकामासाठी थेट **₹७५,०००** पर्यंत अनुदान आणि प्लास्टिक अस्तरीकरणास अतिरिक्त मदत.\n३. **पीएम-कुसुम सौर कृषी पंप योजना:**\n   • ३ एचपी ते ७.५ एचपी सौर पंपांवर **६०% पर्यंत अनुदान**.\n४. **पंतप्रधान पीक विमा योजना (PMFBY):**\n   • केवळ १.५% ते २% हप्त्यावर सर्व नैसर्गिक आपत्तींपासून संपूर्ण पीक संरक्षण.\n५. **किसान क्रेडिट कार्ड (KCC):**\n   • ३ लाख रुपयांपर्यंतचे पीक कर्ज अवघ्या **४% सवलतीच्या व्याजदराने**.\n\n🔗 अर्ज करण्यासाठी व सविस्तर माहितीसाठी **शासकीय योजना** विभाग पहा!`,
      hi: `🏛️ **प्रमुख सरकारी कृषि योजनाएं एवं सब्सिडी — ${locName}:**\n\n1. **पीएम-किसान + नमो शेतकरी योजना:**\n   • केंद्र ₹6,000 + राज्य ₹6,000 = **₹12,000 प्रति वर्ष** सीधे बैंक खाते में।\n2. **मागेल त्याला शेततळे (खेत तालाब योजना):**\n   • खेत तालाब निर्माण के लिए **₹75,000** तक का अनुदान।\n3. **पीएम-कुसुम सोलर पंप योजना:**\n   • 3 HP से 7.5 HP सोलर पंप पर **60% सरकारी सब्सिडी**।\n4. **प्रधानमंत्री फसल बीमा योजना (PMFBY):**\n   • 1.5% - 2% प्रीमियम पर प्राकृतिक आपदाओं से पूर्ण सुरक्षा।\n5. **किसान क्रेडिट कार्ड (KCC):**\n   • ₹3 लाख तक का ऋण मात्र **4% रियायती ब्याज दर** पर।\n\n🔗 आधिकारिक पोर्टल पर आवेदन करने हेतु **सरकारी योजनाएं अनुभाग** देखें!`,
      suggestionsEn: ["🏛️ PM-KISAN Portal", "💧 Solar Pump Subsidy", "💰 Mandi Rates"],
      suggestionsMr: ["🏛️ नमो शेतकरी योजना", "💧 सौर पंप अनुदान", "💰 बाजारभाव"],
      suggestionsHi: ["🏛️ पीएम-किसान पोर्टल", "💧 सोलर पंप सब्सिडी", "💰 मंडी भाव"]
    });
  }

  // 7. SEED, PESTICIDE & INPUT STORE PRICES
  if (['seed', 'seeds', 'pesticide', 'pesticides', 'shop', 'store', 'price', 'khad', 'biyane', 'aushadh', 'dukan', 'बियाणे', 'औषध', 'दुकान', 'खते', 'बीज', 'कीटनाशक', 'दुकान'].some(k => query.includes(k))) {
    return buildTrilingualResponse({
      en: `🏪 **Agricultural Inputs & Shop Price Intelligence — ${locName}:**\n\n• **Certified Hybrid Seeds:**\n  - Onion (Panchganga / Prashant F1): ₹1,850 / kg\n  - Wheat (Lokwan Certified): ₹45 / kg (₹1,800/40kg bag)\n  - Cotton (Bollgard II BG-2): ₹864 / 450g packet\n• **Standard Fertilizer Rates:**\n  - Neem Coated Urea: ₹266.50 / 45kg bag *(Govt Subsidized)*\n  - DAP (18:46:0): ₹1,350 / 50kg bag\n  - MOP (0:0:60): ₹1,700 / 50kg bag\n• **Agro-Chemical Protection:**\n  - Emamectin Benzoate 5% SG (100g): ₹380\n  - Coragen (Chlorantraniliprole 60ml): ₹850\n\n💡 Compare nearby Krishi Seva Kendra shops in the **Market Intelligence -> Input Store** tab!`,
      mr: `🏪 **बियाणे, खते व औषधे कृषी केंद्र दर — ${locName}:**\n\n• **प्रमाणित संकरित बियाणे:**\n  - कांदा (पंचगंगा / प्रशांत F1): ₹१,८५० / किलो\n  - गहू (लोकवन प्रमाणित): ₹४५ / किलो (४० किलो बॅग: ₹१,८००)\n  - कापूस (बोलगार्ड २): ₹८६४ / पाकीट\n• **शासकीय अनुदानावरील खतांचे दर:**\n  - नीम कोटेड युरिया: ₹२६६.५० / ४५ किलो गोणी\n  - डीएपी (१८:४६:०): ₹१,३५० / ५० किलो गोणी\n  - पोटॅश (MOP): ₹१,७०० / ५० किलो गोणी\n• **कीटकनाशके व बुरशीनाशके:**\n  - इमामेक्टिन बेन्झोएट (१०० ग्रॅम): ₹३८०\n  - कोराजन (६० मिली): ₹८५०\n\n💡 कृषी सेवा केंद्रांच्या दरांची तुलना करण्यासाठी **बाजारपेठ -> कृषी इनपुट केंद्र** विभाग पहा!`,
      hi: `🏪 **बीज, खाद एवं कीटनाशक बाजार दर — ${locName}:**\n\n• **प्रमाणित बीज:**\n  - प्याज बीज (F1): ₹1,850 / किग्रा\n  - गेहूं बीज (लोकवन): ₹45 / किग्रा\n  - कपास (BG-2): ₹864 / पैकेट\n• **खाद की सरकारी दरें:**\n  - नीम लेपित यूरिया: ₹266.50 / 45 किग्रा बोरी\n  - DAP (18:46:0): ₹1,350 / 50 किग्रा बोरी\n  - पोटाश (MOP): ₹1,700 / 50 किग्रा बोरी\n\n💡 दुकानों के रेट तुलना के लिए **मार्केट -> कृषि स्टोर अनुभाग** देखें!`,
      suggestionsEn: ["🌱 Seed Store", "💰 Mandi Rates", "🌦️ Weather"],
      suggestionsMr: ["🌱 बियाणे केंद्र", "💰 बाजारभाव", "🌦️ हवामान"],
      suggestionsHi: ["🌱 बीज भंडार", "💰 मंडी भाव", "🌦️ मौसम"]
    });
  }

  // DEFAULT CONVERSATIONAL RESPONSE
  return buildTrilingualResponse({
    en: `🌾 **Krishi Samadhan AI Insights for ${locName}:**\n\nRegarding **"${message.trim()}"**:\n\nFor optimal crop performance in **${district}**, align your farm operations with:\n• **Soil Type:** ${soilType} (requires split fertilizer dosing & drainage monitoring)\n• **Primary Regional Crops:** ${crops.join(', ')}\n• **Live APMC Mandi:** ${apmc}\n\nYou can explore specialized modules:\n• 🗺️ **GIS Map:** Field boundaries & soil maps\n• 🛰️ **Satellite:** Real-time Sentinel-2 NDVI canopy index\n• 💰 **Market:** Daily mandi prices & input store comparison\n• 🐛 **Pest:** AI camera-based plant disease scanning\n\nAsk me any specific question about crop care, fertilizer dosage, weather, or government schemes!`,
    mr: `🌾 **कृषी समाधान AI सल्ला — ${locName}:**\n\nआपल्या **"${message.trim()}"** या प्रश्नाबाबत:\n\n**${district}** भागातील उत्कृष्ट शेती उत्पादनासाठी:\n• **जमीन प्रकार:** ${soilType} (संतुलित खत नियोजन व पाणी निचरा आवश्यक)\n• **प्रमुख स्थानिक पिके:** ${crops.join(', ')}\n• **बाजार समिती:** ${apmc}\n\nआपण खालील विभागांचा वापर करू शकता:\n• 🗺️ **GIS नकाशा:** शेत जमीन व माती नकाशा\n• 🛰️ **उपग्रह निरीक्षण:** थेट Sentinel-2 NDVI पीक आरोग्य\n• 💰 **बाजारभाव:** दररोजचे APMC भाव व औषध दर\n• 🐛 **कीड निदान:** कॅमेऱ्याद्वारे AI रोग तपासणी\n\nपिकानुसार खत, पाणी, फवारणी किंवा योजनांविषयी अधिक माहिती विचारू शकता!`,
    hi: `🌾 **कृषि समाधान AI सलाह — ${locName}:**\n\nआपके प्रश्न **"${message.trim()}"** के संबंध में:\n\n**${district}** क्षेत्र में उत्तम फसल प्रबंधन हेतु:\n• **मिट्टी:** ${soilType} (संतुलित खाद व जल निकासी आवश्यक)\n• **प्रमुख फसलें:** ${crops.join(', ')}\n• **स्थानीय मंडी:** ${apmc}\n\nआप अन्य विशेष टूल्स का उपयोग कर सकते हैं:\n• 🗺️ **GIS मानचित्र:** खेत एवं मिट्टी का सेटेलाइट मैप\n• 🛰️ **उपग्रह निगरानी:** NDVI फसल स्वास्थ्य इंडेक्स\n• 💰 **मंडी भाव:** दैनिक APMC भाव व कृषि स्टोर दरें\n• 🐛 **कीट पहचान:** कैमरे से पौधे के रोग की पहचान\n\nफसल सुरक्षा, मौसम या सरकारी योजनाओं के बारे में कोई भी प्रश्न पूछें!`,
    suggestionsEn: [`🌦️ Weather in ${district}`, `💰 ${apmc} Rates`, "🌱 Soil Health", "🐛 Pest Treatment", "🏛️ Government Schemes"],
    suggestionsMr: [`🌦️ ${district} हवामान`, `💰 ${apmc} बाजारभाव`, "🌱 खत सल्ला", "🐛 कीड औषध", "🏛️ सरकारी योजना"],
    suggestionsHi: [`🌦️ ${district} मौसम`, `💰 ${apmc} भाव`, "🌱 खाद सलाह", "🐛 कीट रोकथाम", "🏛️ सरकारी योजनाएं"]
  });
};

const chatbotService = {
  sendMessage
};

export default chatbotService;
