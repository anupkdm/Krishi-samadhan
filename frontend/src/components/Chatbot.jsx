import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import chatbotService, { TOPOLOGY_PRESETS } from '../services/chatbotService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const DEFAULT_TOPOLOGY = {
  id: "sangamner",
  name: "Sangamner / Ahmednagar (Pravara River Basin)",
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
};

const safePresets = (Array.isArray(TOPOLOGY_PRESETS) && TOPOLOGY_PRESETS.length > 0)
  ? TOPOLOGY_PRESETS
  : [DEFAULT_TOPOLOGY];

export default function Chatbot() {
  const { t, language } = useLanguage();
  const { user, activeLocation } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showCallout, setShowCallout] = useState(true);
  const [selectedTopology, setSelectedTopology] = useState(safePresets[0]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API for voice recognition safely
  useEffect(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            setInput(transcript);
            handleSend(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    } catch (e) {
      console.warn('Speech recognition not available:', e);
    }
  }, [language]);

  // Sync activeLocation with preset safely
  useEffect(() => {
    if (activeLocation?.name) {
      const matched = safePresets.find(p =>
        activeLocation.name.toLowerCase().includes(p.id) ||
        (activeLocation.district && activeLocation.district.toLowerCase().includes(p.id))
      );
      if (matched) setSelectedTopology(matched);
    }
  }, [activeLocation]);

  // Initial greeting
  useEffect(() => {
    const curTopo = selectedTopology || DEFAULT_TOPOLOGY;
    const regionName = curTopo.name || 'Sangamner / Ahmednagar';
    const apmcName = (curTopo.apmcHub || 'Sangamner APMC').split(' ')[0];

    setMessages([
      {
        id: 'init-lang-' + language,
        sender: 'bot',
        text: language === 'mr'
          ? `🌿 **राम राम${user?.name ? ' ' + user.name : ' मित्रा'}! कसा आहेस?** 🙏\n\nमी तुझा शेती मित्र **कृषी AI**. आपल्या **${regionName}** भागातील शेती, औषध खरेदी लिंक्स, शेती यंत्रे आणि बाजारभावांची सर्व पक्की माहिती माझ्याकडे आहे.\n\nतुला कोणत्याही औषधाचे दर (सस्ती vs प्रीमियम), ऑनलाईन खरेदी लिंक्स, स्थानिक दुकाने किंवा शेतीसाठी लागणाऱ्या आधुनिक यंत्रांविषयी विचारायचे असेल तर हक्काने विचार मित्रा!`
          : language === 'hi'
          ? `🌿 **राम राम${user?.name ? ' ' + user.name : ' भाई'}! कैसे हो आप?** 🙏\n\nमैं आपका अपना डिजिटल कृषि मित्र **कृषि AI**। अपने **${regionName}** क्षेत्र के लिए कीटनाशक दवाओं की खरीद लिंक, किफायती बनाम प्रीमियम उत्पाद, कृषि मशीनरी और मौसम की पूरी जानकारी उपलब्ध है।`
          : `🌿 **Hey${user?.name ? ' ' + user.name : ' my friend'}! How are you doing today?** 🙏\n\nI'm **Krishi AI**, your dedicated agronomic companion calibrated for **${regionName}**. Ask me about pest products, buying links (Affordable vs Premium), local store directories, and required farm machinery!`,
        suggestions: [
          language === 'mr' ? "🛒 औषध खरेदी लिंक्स व दुकाने" : "🛒 Pest Medicine Buy Links",
          language === 'mr' ? "🚜 आवश्यक शेती यंत्रे व स्प्रेअर" : "🚜 Required Farm Machinery",
          language === 'mr' ? `💰 ${apmcName} भाव` : `💰 ${apmcName} Rates`,
          language === 'mr' ? `🌦️ ${regionName.split('/')[0]} हवामान` : `🌦️ Weather in ${regionName.split('/')[0]}`,
          language === 'mr' ? "📝 योजना अर्ज कसा करावा?" : "📝 Scheme Form Guide"
        ],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language, selectedTopology, user?.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowCallout(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(language === 'mr' ? 'आपल्या ब्राऊझरमध्ये व्हॉइस इनपुट उपलब्ध नाही.' : 'Voice input not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition start error:', err);
      }
    }
  };

  const speakMessage = (id, text) => {
    if (!('speechSynthesis' in window)) return;

    if (activeSpeechId === id) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for cleaner audio narration
    const cleanText = text
      .replace(/(\*\*|\*|#|_|\[.*?\]\(.*?\)|`)/g, '')
      .replace(/(http[s]?:\/\/[^\s]+)/g, '')
      .replace(/[•\-+]/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setActiveSpeechId(null);
    utterance.onerror = () => setActiveSpeechId(null);

    setActiveSpeechId(id);
    window.speechSynthesis.speak(utterance);
  };

  const copyMessage = (id, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSend = async (userQuery) => {
    const query = userQuery || input.trim();
    if (!query) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatbotService.sendMessage(query, {
        location: activeLocation,
        language,
        user
      });

      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: response.reply || response.message || query,
        suggestions: response.suggestions || [t('sugWeather'), t('sugSoil'), t('sugMandi')],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error('Chatbot request error:', err);
      const errorMsg = {
        id: 'bot-err-' + Date.now(),
        sender: 'bot',
        text: language === 'mr'
          ? "⚠️ माहिती मिळवताना अडचण आली. कृपया पुन्हा प्रयत्न करा."
          : "⚠️ Error processing request. Please retry.",
        suggestions: ["🛒 औषध खरेदी लिंक्स", "🚜 आवश्यक शेती यंत्रे"],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse markdown line into formatted components including markdown links [Title](url)
  const renderFormattedLine = (line) => {
    const linkRegex = /\[(.*?)\]\((https?:\/\/.*?)\)/g;
    if (linkRegex.test(line)) {
      const parts = [];
      let lastIndex = 0;
      let match;
      const re = /\[(.*?)\]\((https?:\/\/.*?)\)/g;

      while ((match = re.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        const title = match[1];
        const url = match[2];
        parts.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link-chip"
          >
            <span>🛒</span> {title} ↗
          </a>
        );
        lastIndex = re.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }
      return <span>{parts}</span>;
    }

    return line;
  };

  // Helper to render formatted text with action shortcuts safely
  const renderMessageContent = (rawText) => {
    const text = String(rawText || '');
    const lines = text.split('\n');
    return (
      <div>
        {lines.map((line, idx) => {
          if (!line || !line.trim()) return <div key={idx} style={{ height: '6px' }} />;

          const isBullet = line.startsWith('•') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.') || line.startsWith('१.') || line.startsWith('२.') || line.startsWith('३.');
          const isHeading = line.startsWith('###') || line.startsWith('##') || line.startsWith('**') || line.startsWith('🌟') || line.startsWith('💰') || line.startsWith('🌿') || line.startsWith('🚜') || line.startsWith('🏬');

          return (
            <div
              key={idx}
              style={{
                marginBottom: '3px',
                paddingLeft: isBullet ? '0.5rem' : '0',
                fontWeight: isHeading ? '700' : 'normal',
                color: line.startsWith('### 🌟') ? '#7e22ce' : line.startsWith('### 💰') ? '#15803d' : line.startsWith('### 🌿') ? '#047857' : 'inherit'
              }}
            >
              {renderFormattedLine(line)}
            </div>
          );
        })}

        {/* Action Shortcuts Bar */}
        <div className="chat-shortcut-bar">
          {(text.includes('Buy') || text.includes('Product') || text.includes('खरेदी') || text.includes('औषध') || text.includes('दवा') || text.includes('Coragen') || text.includes('Ampligo')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/market'); }}
              className="chat-shortcut-chip store"
            >
              🛒 {language === 'mr' ? 'खते व औषध दुकाने' : 'Input Store Prices'}
            </button>
          )}
          {(text.includes('Machinery') || text.includes('Sprayer') || text.includes('यंत्र') || text.includes('ड्रोन') || text.includes('स्प्रेअर') || text.includes('Pest') || text.includes('कीड')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/pest'); }}
              className="chat-shortcut-chip pest"
            >
              📸 {language === 'mr' ? 'कीड निदान व यंत्रे' : 'AI Pest Diagnosis & Tech'}
            </button>
          )}
          {(text.includes('Mandi') || text.includes('बाजारभाव') || text.includes('भाव') || text.includes('APMC')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/market'); }}
              className="chat-shortcut-chip mandi"
            >
              💰 {language === 'mr' ? 'बाजारभाव तपासा' : 'Check APMC Mandi'}
            </button>
          )}
          {(text.includes('Weather') || text.includes('हवामान') || text.includes('मौसम')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/weather'); }}
              className="chat-shortcut-chip weather"
            >
              🌤️ {language === 'mr' ? 'हवामान अंदाज' : 'Live Weather Radar'}
            </button>
          )}
          <a
            href="tel:18001801551"
            className="chat-shortcut-chip helpline"
            title="Toll-Free Kisan Call Center"
          >
            📞 {language === 'mr' ? 'किसान कॉल सेंटर (१८००-१८०-१५५१)' : 'Kisan Helpline (1800-180-1551)'}
          </a>
        </div>
      </div>
    );
  };

  const curTopo = selectedTopology || DEFAULT_TOPOLOGY;

  return (
    <div className="chatbot-wrapper">
      {/* FLOATING PROMPT CALLOUT PILL (Visible when chat is closed) */}
      {!isOpen && showCallout && (
        <div
          className="chatbot-pill-callout"
          onClick={() => { setIsOpen(true); setShowCallout(false); setHasUnread(false); }}
        >
          <span className="chatbot-pill-dot" />
          <span className="chatbot-pill-text">
            {language === 'mr' ? '🌿 कृषी AI • विचारा काहीही!' : language === 'hi' ? '🌾 कृषि AI • पूछें कुछ भी!' : '✨ Krishi AI • Ask Anything!'}
          </span>
          <span style={{ fontSize: '0.85rem' }}>💬</span>
        </div>
      )}

      {/* CHATBOT WINDOW */}
      {isOpen && (
        <div className={`chatbot-window ${isExpanded ? 'expanded' : ''}`}>
          {/* HEADER */}
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="chatbot-avatar-container">
                <span>🌱</span>
                <span className="chatbot-status-indicator" />
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: '0.96rem', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>{t('chatTitle')}</span>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.22)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '6px',
                    color: '#bbf7d0'
                  }}>
                    GenAI 2.0
                  </span>
                </div>
                <div style={{ fontSize: '0.73rem', color: '#bbf7d0', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '1px' }}>
                  <span>Multilingual Agronomic Friend</span> &bull; <span style={{ color: '#86efac' }}>Live</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {/* Topology Dropdown Selector */}
              <select
                value={curTopo.id || 'sangamner'}
                onChange={(e) => {
                  const target = safePresets.find(p => p.id === e.target.value);
                  if (target) setSelectedTopology(target);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  padding: '0.3rem 0.5rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                title="Select Active Farm Topology"
              >
                {safePresets.map(p => (
                  <option key={p.id} value={p.id} style={{ color: '#0f172a' }}>
                    📍 {(p.id || '').toUpperCase()}
                  </option>
                ))}
              </select>

              {/* Expand / Minimize Toggle */}
              <button
                className="chatbot-header-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse View" : "Expand Window"}
              >
                {isExpanded ? '⤓' : '⤢'}
              </button>

              {/* Clear Chat */}
              <button
                className="chatbot-header-btn"
                onClick={() => setMessages([])}
                title="Clear Chat History"
              >
                🗑️
              </button>

              {/* Close Button */}
              <button
                className="chatbot-header-btn"
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ACTIVE TOPOLOGY CONTEXT STRIP */}
          <div className="chatbot-context-strip">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#16a34a' }}>●</span>
              <span><strong>📍 {(curTopo.name || 'Sangamner').split('(')[0]}</strong></span>
              <span>&bull;</span>
              <span style={{ color: '#4b5563' }}>{(curTopo.soilType || 'Vertisol').split('(')[0]}</span>
            </div>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '1px 8px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 700, flexShrink: 0 }}>
              {(curTopo.apmcHub || 'Sangamner APMC').split(' ')[0]} Mandi
            </span>
          </div>

          {/* MESSAGES LIST */}
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                color: '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}>
                  🌱
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                  {language === 'mr' ? 'कृषी AI कडे शेतीचे काहीही विचारा' : 'Ask Krishi AI Anything about Farming'}
                </div>
                <p style={{ fontSize: '0.82rem', maxWidth: '300px', lineHeight: 1.4 }}>
                  {language === 'mr'
                    ? 'औषध खरेदी लिंक्स, बाजारभाव, फवारणी यंत्रे किंवा खतांचे प्रमाण जाणून घ्या.'
                    : 'Get pesticide purchasing links, APMC mandi rates, drone sprayers, and fertilizer calculators.'}
                </p>

                <div className="chatbot-suggestions-tray" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                  <button className="chatbot-suggestion-pill" onClick={() => handleSend("🛒 कांदा औषध खरेदी लिंक्स व दुकाने")}>
                    🧅 औषध खरेदी लिंक्स
                  </button>
                  <button className="chatbot-suggestion-pill" onClick={() => handleSend("💰 आजचे बाजारभाव व तेजी-मंदी")}>
                    💰 आजचे बाजारभाव
                  </button>
                  <button className="chatbot-suggestion-pill" onClick={() => handleSend("🚜 आवश्यक शेती यंत्रे व स्प्रेअर")}>
                    🚜 आधुनिक यंत्रे
                  </button>
                  <button className="chatbot-suggestion-pill" onClick={() => handleSend("🌦️ हवामान व फवारणी सल्ला")}>
                    🌦️ हवामान अंदाज
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="chat-message-bubble">
                  {msg.sender === 'bot' ? renderMessageContent(msg.text) : msg.text}
                </div>

                <div className="chat-message-meta">
                  <span style={{ fontSize: '0.68rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.85)' : '#94a3b8' }}>
                    {msg.time} {msg.sender === 'user' && '✓'}
                  </span>

                  {msg.sender === 'bot' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {/* Copy button */}
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="chat-action-btn"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ Copied</span>
                        ) : (
                          <span>📋 Copy</span>
                        )}
                      </button>

                      {/* Text to speech voice button */}
                      <button
                        onClick={() => speakMessage(msg.id, msg.text)}
                        className={`chat-action-btn ${activeSpeechId === msg.id ? 'active-audio' : ''}`}
                        title="Listen to audio narration"
                      >
                        {activeSpeechId === msg.id ? (
                          <>
                            <div className="sound-wave">
                              <span className="sound-wave-bar" />
                              <span className="sound-wave-bar" />
                              <span className="sound-wave-bar" />
                            </div>
                            <span>Stop</span>
                          </>
                        ) : (
                          <span>🔊 Listen</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggestions Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="chatbot-suggestions-tray">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        className="chatbot-suggestion-pill"
                        onClick={() => handleSend(sug)}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-message bot">
                <div className="chat-typing-bubble">
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                  <span style={{ fontSize: '0.76rem', color: '#64748b', marginLeft: '4px', fontWeight: 600 }}>
                    {language === 'mr' ? 'कृषी AI विचार करत आहे...' : 'Krishi AI is analyzing...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT DOCK */}
          <div className="chatbot-input-container">
            <form className="chatbot-input-form-inner" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
              {/* Mic Speech Button */}
              <button
                type="button"
                className={`chatbot-mic-action ${isListening ? 'active-listening' : ''}`}
                onClick={toggleListening}
                title={isListening ? "Listening... Speak now" : "Click to Speak in Marathi / Hindi / English"}
              >
                {isListening ? '🔴' : '🎙️'}
              </button>

              <input
                ref={inputRef}
                type="text"
                className="chatbot-text-input"
                placeholder={
                  language === 'mr'
                    ? 'औषध खरेदी, यंत्रे, खते, बाजारभाव विचारा...'
                    : language === 'hi'
                    ? 'दवा खरीद लिंक, मंडी भाव, मशीनरी पूछें...'
                    : 'Ask about medicine buy links, mandi rates, machinery...'
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />

              <button
                type="submit"
                className="chatbot-send-action"
                disabled={loading || !input.trim()}
                title="Send Message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON */}
      <button
        className="chatbot-trigger"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowCallout(false);
          setHasUnread(false);
        }}
        title="Open Krishi AI Decision Assistant"
        aria-label="Open Krishi AI Decision Assistant"
      >
        <span className="chatbot-trigger-ring" />
        {isOpen ? (
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>✕</span>
        ) : (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
            <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
            <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
          </svg>
        )}
        {hasUnread && !isOpen && <span className="chatbot-trigger-badge">1</span>}
      </button>
    </div>
  );
}
