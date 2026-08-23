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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState(null);
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
    const majorCrop = (curTopo.majorCrops && curTopo.majorCrops[0]) || 'Onion';
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
  }, [language, selectedTopology]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
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
      .replace(/[•\-\+]/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setActiveSpeechId(null);
    utterance.onerror = () => setActiveSpeechId(null);

    setActiveSpeechId(id);
    window.speechSynthesis.speak(utterance);
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
    // Check if line contains markdown links: [Title](url)
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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              border: '1px solid #bae6fd',
              borderRadius: '6px',
              padding: '1px 6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              margin: '0 2px'
            }}
          >
            🛒 {title} ↗
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

        {/* Action Shortcuts */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
          {(text.includes('Buy') || text.includes('Product') || text.includes('खरेदी') || text.includes('औषध') || text.includes('दवा') || text.includes('Coragen') || text.includes('Ampligo')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/market'); }}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px', color: '#16a34a', borderColor: '#86efac' }}
            >
              🛒 Open Input Store Prices
            </button>
          )}
          {(text.includes('Machinery') || text.includes('Sprayer') || text.includes('यंत्र') || text.includes('ड्रोन') || text.includes('स्प्रेअर') || text.includes('Pest') || text.includes('कीड')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/pest'); }}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px', color: '#9333ea', borderColor: '#d8b4fe' }}
            >
              📸 AI Pest Diagnosis & Tech
            </button>
          )}
          {(text.includes('Mandi') || text.includes('बाजारभाव') || text.includes('भाव') || text.includes('APMC')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/market'); }}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px' }}
            >
              💰 Check APMC Mandi
            </button>
          )}
          {(text.includes('Weather') || text.includes('हवामान') || text.includes('मौसम')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/weather'); }}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px' }}
            >
              🌤️ View Weather Page
            </button>
          )}
          <a
            href="tel:18001801551"
            className="btn btn-sm btn-outline"
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px', textDecoration: 'none', color: '#166534' }}
            title="Toll-Free Kisan Call Center"
          >
            📞 Kisan Helpline (1800-180-1551)
          </a>
        </div>
      </div>
    );
  };

  const curTopo = selectedTopology || DEFAULT_TOPOLOGY;

  return (
    <div className="chatbot-wrapper">
      {/* CHATBOT WINDOW */}
      {isOpen && (
        <div className="chatbot-window" style={{ width: '430px', height: '590px' }}>
          {/* HEADER */}
          <div className="chatbot-header" style={{ padding: '0.8rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ fontSize: '1.4rem' }}>🌾</span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    border: '1.5px solid #ffffff'
                  }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.1 }}>
                  {t('chatTitle')}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#bbf7d0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>Agronomic Intelligence</span> &bull; <span>Live</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {/* Topology Dropdown Selector */}
              <select
                value={curTopo.id || 'sangamner'}
                onChange={(e) => {
                  const target = safePresets.find(p => p.id === e.target.value);
                  if (target) setSelectedTopology(target);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  borderRadius: '12px',
                  padding: '0.2rem 0.4rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                title="Select Active Farm Topology"
              >
                {safePresets.map(p => (
                  <option key={p.id} value={p.id} style={{ color: '#000' }}>
                    📍 {(p.id || '').toUpperCase()}
                  </option>
                ))}
              </select>

              <button
                className="chatbot-header-btn"
                onClick={() => setMessages([])}
                title="Clear Chat History"
              >
                🗑️
              </button>

              <button
                className="chatbot-header-btn"
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ACTIVE TOPOLOGY STATUS STRIP */}
          <div style={{
            background: '#f0fdf4',
            borderBottom: '1px solid #dcfce7',
            padding: '0.35rem 0.75rem',
            fontSize: '0.72rem',
            color: 'var(--primary-900)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>📍 {(curTopo.name || 'Sangamner').split('(')[0]}</strong> &bull; {(curTopo.soilType || 'Vertisol').split('(')[0]}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--primary-700)', fontWeight: 700 }}>
              {(curTopo.apmcHub || 'Sangamner APMC').split(' ')[0]} APMC
            </span>
          </div>

          {/* MESSAGES LIST */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.sender === 'bot' ? renderMessageContent(msg.text) : msg.text}
                </div>

                <div style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'space-between', alignItems: 'center', marginTop: '2px', padding: '0 4px' }}>
                  <span className="message-time">{msg.time}</span>

                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => speakMessage(msg.id, msg.text)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '0.76rem',
                        cursor: 'pointer',
                        color: activeSpeechId === msg.id ? '#dc2626' : 'var(--primary-700)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                      title="Listen to response voice"
                    >
                      {activeSpeechId === msg.id ? '⏹️ Stop' : '🔊 Listen'}
                    </button>
                  )}
                </div>

                {/* Suggestions Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="chatbot-suggestions" style={{ marginTop: '0.45rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        className="suggestion-chip"
                        onClick={() => handleSend(sug)}
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', borderRadius: '12px' }}
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
                <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <span className="loading-spinner" style={{ width: '14px', height: '14px' }} />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <form className="chatbot-input-form" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <button
              type="button"
              className={`chatbot-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              title={isListening ? "Listening..." : "Click to Speak in Marathi / Hindi / English"}
              style={{
                backgroundColor: isListening ? '#fee2e2' : 'transparent',
                color: isListening ? '#dc2626' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '0 0.5rem'
              }}
            >
              {isListening ? '🔴' : '🎙️'}
            </button>

            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder={language === 'mr' ? 'औषध खरेदी, यंत्रे, खते, बाजारभाव विचारा...' : 'Ask about pest buying links, machinery, prices...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              className="btn btn-primary chatbot-send-btn"
              disabled={loading || !input.trim()}
              style={{ padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)' }}
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON */}
      <button
        className="chatbot-trigger"
        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
        title="Open Krishi AI Assistant"
      >
        <span style={{ fontSize: '1.4rem' }}>💬</span>
        {hasUnread && <span className="chatbot-badge">1</span>}
      </button>
    </div>
  );
}
