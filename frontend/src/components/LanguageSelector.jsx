import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector({ variant = 'default' }) {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'English', native: 'English', icon: '🇬🇧' },
    { code: 'mr', label: 'Marathi', native: 'मराठी', icon: '🇮🇳' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी', icon: '🇮🇳' }
  ];

  return (
    <div className={`language-selector-wrap ${variant}`} aria-label="Select Language">
      <select
        className="language-select-input"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label="Language selection dropdown"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.icon} {lang.native} ({lang.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
}
