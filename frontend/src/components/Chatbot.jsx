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
    const topoDesc = curTopo.topography || 'Western Ghats rain-shadow plateau';
    const soilDesc = curTopo.soilType || 'Vertisol Black Cotton Soil';
    const majorCrop = (curTopo.majorCrops && curTopo.majorCrops[0]) || 'Onion';
    const apmcName = (curTopo.apmcHub || 'Sangamner APMC').split(' ')[0];

    setMessages([
      {
        id: 'init-lang-' + language,
        sender: 'bot',
        text: language === 'mr'
          ? `🌿 **राम राम${user?.name ? ' ' + user.name : ' मित्रा'}! कसा आहेस?** 🙏\n\nमी तुझा शेती मित्र **कृषी AI**. आपल्या **${regionName}** भागातील शेती, काळी जमीन आणि हवामानाची सर्व पक्की माहिती माझ्याकडे आहे.\n\nतुला हवामान, खतांचा डोस, कीड-रोग उपाय, आजचे बाजारभाव किंवा सरकारी योजनेचा फॉर्म कसा भरावा याविषयी काहीही विचारायचे असेल तर हक्काने विचार मित्रा. सांग, आज शेतात काय काम चालू आहे?`
          : language === 'hi'
          ? `🌿 **राम राम${user?.name ? ' ' + user.name : ' भाई'}! कैसे हो आप?** 🙏\n\nमैं आपका अपना डिजिटल कृषि मित्र **कृषि AI**। अपने **${regionName}** क्षेत्र की काली मिट्टी, फसलों और मौसम के बारे में जो भी सलाह चाहिए, मैं बिल्कुल एक दोस्त की तरह मदद करूँगा।\n\nबताइए, आज खेत में किस विषय पर मदद चाहिए?`
          : `🌿 **Hey${user?.name ? ' ' + user.name : ' my friend'}! How are you doing today?** 🙏\n\nI'm **Krishi AI**, your friendly farming companion calibrated for **${regionName}**. Ask me anything about your field—weather windows, fertilizer dosages, pest treatments, live APMC rates, or subsidy form filling. What's on your mind today?`,
        suggestions: [
          language === 'mr' ? "📝 योजना अर्ज कसा करावा?" : "📝 Scheme Form Step Guide",
          language === 'mr' ? `🌦️ ${regionName.split('/')[0]} हवामान` : `🌦️ Weather in ${regionName.split('/')[0]}`,
          language === 'mr' ? `🌱 ${majorCrop} खत सल्ला` : `🌱 ${majorCrop} Fertilizer`,
          language === 'mr' ? `💰 ${apmcName} भाव` : `💰 ${apmcName} Rates`,
          language === 'mr' ? "🐛 कीड नियंत्रण उपाय" : "🐛 Pest Treatment"
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
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(language === 'mr' ? 'आपल्या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही.' : 'Voice recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      }
    }
  };

  const speakMessage = (msgId, text) => {
    if (!('speechSynthesis' in window)) return;

    try {
      if (activeSpeechId === msgId) {
        window.speechSynthesis.cancel();
        setActiveSpeechId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = (text || '').replace(/[*#•_]/g, '').replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;

      utterance.onend = () => setActiveSpeechId(null);
      utterance.onerror = () => setActiveSpeechId(null);

      setActiveSpeechId(msgId);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setActiveSpeechId(null);
    }
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || input || '').trim();
    if (!query || loading) return;

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
      const curTopo = selectedTopology || DEFAULT_TOPOLOGY;
      const response = await chatbotService.sendMessage(query, {
        location: {
          ...activeLocation,
          name: curTopo.name,
          soilType: curTopo.soilType,
          apmcMandi: curTopo.apmcHub
        },
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
        suggestions: [t('sugWeather'), t('sugSoil')],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
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
          
          return (
            <div
              key={idx}
              style={{
                marginBottom: '3px',
                paddingLeft: isBullet ? '0.5rem' : '0',
                fontWeight: line.startsWith('**') || line.startsWith('🌿') || line.startsWith('🌦️') || line.startsWith('💰') || line.startsWith('🌱') || line.startsWith('🐛') || line.startsWith('🏛️') || line.startsWith('💧') ? '700' : 'normal'
              }}
            >
              {line}
            </div>
          );
        })}

        {/* Action Shortcuts */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
          {(text.includes('Weather') || text.includes('हवामान') || text.includes('मौसम')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/weather'); }}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px' }}
            >
              🌤️ View Weather Page
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
          {(text.includes('Soil') || text.includes('NPK') || text.includes('माती') || text.includes('खत')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/soil'); }}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px' }}
            >
              🌱 Soil Health Profile
            </button>
          )}
          {(text.includes('Pest') || text.includes('कीड') || text.includes('रोग') || text.includes('Thrips')) && (
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/pest'); }}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px' }}
            >
              📸 AI Pest Scanner
            </button>
          )}
          {(text.includes('Scheme') || text.includes('योजना') || text.includes('MahaDBT') || text.includes('PM-KISAN') || text.includes('अर्ज') || text.includes('फॉर्म')) && (
            <>
              <button
                onClick={() => { setIsOpen(false); navigate('/dashboard/schemes'); }}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px' }}
              >
                🏛️ View Schemes Page
              </button>
              <a
                href="https://mahadbt.maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '12px', textDecoration: 'none', color: '#15803d', borderColor: '#86efac' }}
              >
                🌐 MahaDBT Official Portal
              </a>
            </>
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
        <div className="chatbot-window" style={{ width: '420px', height: '580px' }}>
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
                  <span>Topology-Grounded AI</span> &bull; <span>Live</span>
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
                  <div className="chat-suggestions">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        className="chat-suggestion-chip"
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
                <div className="message-bubble typing-bubble">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="chatbot-input-area">
            {/* Voice Input Mic Button */}
            <button
              onClick={toggleVoiceInput}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: isListening ? '#ef4444' : 'var(--primary-50)',
                color: isListening ? '#ffffff' : 'var(--primary-700)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.05rem',
                transition: 'all 0.2s ease',
                boxShadow: isListening ? '0 0 10px rgba(239, 68, 68, 0.6)' : 'none'
              }}
              title={isListening ? "Listening... Click to stop" : "Click to speak in Marathi / Hindi / English"}
            >
              {isListening ? '🎙️' : '🎤'}
            </button>

            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder={
                isListening
                  ? (language === 'mr' ? 'ऐकत आहे... बोला' : 'Listening... Speak now')
                  : (language === 'mr' ? 'शेती, हवामान किंवा भावाविषयी विचारा...' : t('chatPlaceholder'))
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />

            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{ borderRadius: 'var(--radius-pill)', padding: '0.45rem 0.85rem' }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* LAUNCHER BUTTON */}
      <button
        className={`chatbot-launcher-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Krishi AI Assistant"
      >
        {isOpen ? (
          <span style={{ fontSize: '1.25rem' }}>✕</span>
        ) : (
          <>
            <span style={{ fontSize: '1.35rem' }}>💬</span>
            <span>{t('chatLauncher')}</span>
            {hasUnread && <span className="chatbot-badge">1</span>}
          </>
        )}
      </button>
    </div>
  );
}
