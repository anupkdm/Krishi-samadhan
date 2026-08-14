import React, { useState, useEffect, useRef } from 'react';
import chatbotService from '../services/chatbotService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Chatbot() {
  const { t, language } = useLanguage();
  const { user, activeLocation } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API for voice recognition if available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Initial greeting
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
      const response = await chatbotService.sendMessage(query, {
        location: activeLocation,
        language,
        user
      });

      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: response.reply,
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
          ? "⚠️ दिलगीर आहोत, माहिती मिळवताना अडचण आली. कृपया पुन्हा प्रयत्न करा."
          : language === 'hi'
          ? "⚠️ क्षमा करें, जानकारी प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।"
          : "⚠️ Sorry, I encountered an issue retrieving that information. Please try again.",
        suggestions: [t('sugWeather'), t('sugSoil')],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      alert(language === 'mr' ? 'आपल्या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही.' : 'Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (msgId, text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner voice
    const cleanText = text.replace(/[*#_•\n]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    setIsSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeakingId(null);
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
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '1px' }}
              />
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>{t('chatTitle')}</span>
                  <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.25)', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
                    {activeLocation.district}
                  </span>
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
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
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
                <div className="message-bubble" style={{ position: 'relative' }}>
                  {msg.sender === 'bot' ? formatBotMessage(msg.text) : msg.text}

                  {/* Audio Speech Readout Button on Bot Messages */}
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => handleSpeak(msg.id, msg.text)}
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        background: 'rgba(0,0,0,0.04)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem'
                      }}
                      title="Listen to response (Audio Readout)"
                    >
                      {isSpeakingId === msg.id ? '⏹️' : '🔊'}
                    </button>
                  )}
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

          {/* Input Form with Voice Support */}
          <div className="chatbot-input-area" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem' }}>
            <button
              onClick={handleToggleVoice}
              style={{
                background: isListening ? '#ef4444' : 'var(--primary-50)',
                border: '1px solid ' + (isListening ? '#dc2626' : 'var(--primary-200)'),
                color: isListening ? '#ffffff' : 'var(--primary-800)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              title={isListening ? "Listening... Speak now!" : "Voice Input (Speak your question)"}
            >
              {isListening ? '🔴' : '🎙️'}
            </button>

            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder={isListening ? (language === 'mr' ? "मी ऐकत आहे, बोला..." : language === 'hi' ? "मैं सुन रहा हूँ, बोलिए..." : "Listening, speak now...") : t('chatPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ flex: 1 }}
            />

            <button
              className="chatbot-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              style={{ flexShrink: 0 }}
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
