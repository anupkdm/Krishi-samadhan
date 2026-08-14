import React, { useState, useEffect, useRef } from 'react';
import chatbotService from '../services/chatbotService';
import DEFAULT_LOCATION from '../config/locations';
import { useLanguage } from '../context/LanguageContext';

export default function Chatbot() {
  const { t, language } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize or update initial greeting when language changes
  useEffect(() => {
    setMessages([
      {
        id: 'init-lang-' + language,
        sender: 'bot',
        text: t('chatGreeting'),
        suggestions: [t('sugWeather'), t('sugSoil'), t('sugPest'), t('sugMandi'), t('sugSchemes')],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language]);

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

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
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
      const lat = DEFAULT_LOCATION.latitude || DEFAULT_LOCATION.lat || 19.8833;
      const lon = DEFAULT_LOCATION.longitude || DEFAULT_LOCATION.lon || 74.4833;
      const response = await chatbotService.sendMessage(query, { lat, lon, language });

      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: response.reply || (language === 'mr' ? "सध्या ही माहिती उपलब्ध होऊ शकली नाही. कृपया पुन्हा प्रयत्न करा." : language === 'hi' ? "यह जानकारी वर्तमान में उपलब्ध नहीं है। कृपया पुनः प्रयास करें।" : "I couldn't process that request right now. Please try again."),
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
        text: language === 'mr' ? "⚠️ सर्व्हरशी संपर्क साधताना अडचण आली. कृपया बॅकएंड चालू असल्याची खात्री करा." : language === 'hi' ? "⚠️ सर्वर से कनेक्ट करने में समस्या आई। कृपया सुनिश्चित करें कि बैकएंड चालू है।" : "⚠️ Sorry, I had trouble connecting to the advisory server. Please ensure the backend is running.",
        suggestions: [t('sugWeather'), t('sugSoil')],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'init-reset-' + Date.now(),
        sender: 'bot',
        text: t('chatGreeting'),
        suggestions: [t('sugWeather'), t('sugSoil'), t('sugPest'), t('sugMandi'), t('sugSchemes')],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const formatBotMessage = (text) => {
    return text.split('\n').map((line, idx) => {
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');

      return (
        <span
          key={idx}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
          style={{ display: 'block', minHeight: line === '' ? '0.5rem' : 'auto' }}
        />
      );
    });
  };

  return (
    <div className="chatbot-wrapper" aria-label="AI Farm Assistant">
      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <img
                src="/logo.png"
                alt="Krishi AI"
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '1px' }}
              />
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff', lineHeight: 1.2 }}>
                  {t('chatTitle')}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="status-dot-online"></span>
                  <span>{t('chatSubtitle')}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                className="chatbot-header-btn"
                onClick={handleClear}
                title="Clear Chat"
                aria-label="Clear Chat"
              >
                🔄
              </button>
              <button
                className="chatbot-header-btn"
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                aria-label="Minimize Chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.sender === 'bot' ? formatBotMessage(msg.text) : msg.text}
                </div>
                <span className="message-time">{msg.time}</span>

                {/* Suggestions attached to bot message */}
                {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="chat-suggestions">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        className="chat-suggestion-chip"
                        onClick={() => handleSend(sug)}
                        disabled={loading}
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
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder={t('chatPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="chatbot-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              ➔
            </button>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        className={`chatbot-launcher-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Chatbot"
      >
        {isOpen ? (
          <span style={{ fontSize: '1.4rem' }}>✕</span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src="/logo.png"
              alt="AI"
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'contain' }}
            />
            <span className="launcher-text">{t('chatLauncher')}</span>
          </div>
        )}

        {hasUnread && !isOpen && <span className="chatbot-badge">1</span>}
      </button>
    </div>
  );
}
