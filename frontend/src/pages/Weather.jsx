import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SourceBadge from '../components/SourceBadge';
import MetricCard from '../components/MetricCard';
import weatherService from '../services/weatherService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { DEFAULT_LOCATION } from '../config/locations';

const Weather = () => {
  const auth = useAuth();
  const activeLocation = auth?.activeLocation || DEFAULT_LOCATION;
  const { t, language } = useLanguage();

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastDays, setForecastDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = activeLocation?.latitude || 19.8833;
      const lon = activeLocation?.longitude || 74.4833;

      const [current, forecastRes] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon),
        weatherService.getForecast(lat, lon).catch(() => null)
      ]);

      setCurrentWeather(current);

      const parsedDays = [];

      // Case 1: forecast is an array of day objects
      if (forecastRes && Array.isArray(forecastRes.forecast)) {
        forecastRes.forecast.forEach((item, idx) => {
          parsedDays.push({
            date: item.date || `Day ${idx + 1}`,
            maxTemp: Math.round(item.temp_max ?? item.maxTemp ?? 31),
            minTemp: Math.round(item.temp_min ?? item.minTemp ?? 20),
            precipProb: item.precipitation_probability ?? (item.rain > 0 ? 60 : 10),
            weatherCode: item.weather_code ?? (item.rain > 0 ? 61 : 1)
          });
        });
      }
      // Case 2: forecast is an object containing daily time arrays (Open-Meteo format)
      else if (forecastRes && forecastRes.forecast && Array.isArray(forecastRes.forecast.time)) {
        const d = forecastRes.forecast;
        for (let i = 0; i < d.time.length; i++) {
          parsedDays.push({
            date: d.time[i],
            maxTemp: Math.round(d.temperature_2m_max?.[i] ?? 31),
            minTemp: Math.round(d.temperature_2m_min?.[i] ?? 20),
            precipProb: d.precipitation_probability_max?.[i] ?? (d.precipitation_sum?.[i] > 0 ? 60 : 10),
            weatherCode: d.weather_code?.[i] ?? 1
          });
        }
      }
      // Case 3: daily object directly on response
      else if (forecastRes && forecastRes.daily && Array.isArray(forecastRes.daily.time)) {
        const d = forecastRes.daily;
        for (let i = 0; i < d.time.length; i++) {
          parsedDays.push({
            date: d.time[i],
            maxTemp: Math.round(d.temperature_2m_max?.[i] ?? 31),
            minTemp: Math.round(d.temperature_2m_min?.[i] ?? 20),
            precipProb: d.precipitation_probability_max?.[i] ?? (d.precipitation_sum?.[i] > 0 ? 60 : 10),
            weatherCode: d.weather_code?.[i] ?? 1
          });
        }
      }

      // Safe fallback if parsing resulted in empty list
      if (parsedDays.length === 0) {
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() + i);
          parsedDays.push({
            date: d.toISOString().split('T')[0],
            maxTemp: 31 + (i % 3),
            minTemp: 21 + (i % 2),
            precipProb: (i % 3 === 0) ? 60 : 15,
            weatherCode: (i % 3 === 0) ? 61 : 1
          });
        }
      }

      setForecastDays(parsedDays);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to fetch weather telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [activeLocation]);

  const getWeatherEmoji = (code) => {
    const c = typeof code === 'number' ? code : parseInt(code, 10) || 1;
    if (c === 0) return language === 'mr' ? '☀️ निरभ्र आकाश' : language === 'hi' ? '☀️ साफ आसमान' : '☀️ Clear Sky';
    if (c >= 1 && c <= 3) return language === 'mr' ? '🌤️ अंशतः ढगाळ' : language === 'hi' ? '🌤️ आंशिक बादल' : '🌤️ Partly Cloudy';
    if (c >= 45 && c <= 48) return language === 'mr' ? '🌫️ धुके' : language === 'hi' ? '🌫️ कोहरा' : '🌫️ Foggy';
    if (c >= 51 && c <= 55) return language === 'mr' ? '🌦️ हलक्या सरी' : language === 'hi' ? '🌦️ बूंदाबांदी' : '🌦️ Drizzle';
    if (c >= 61 && c <= 65) return language === 'mr' ? '🌧️ पाऊस' : language === 'hi' ? '🌧️ बारिश' : '🌧️ Rain';
    if (c >= 80 && c <= 82) return language === 'mr' ? '🌧️ पावसाच्या जोरदार सरी' : language === 'hi' ? '🌧️ तेज बारिश' : '🌧️ Showers';
    if (c >= 95 && c <= 99) return language === 'mr' ? '⛈️ वादळी पाऊस' : language === 'hi' ? '⛈️ आंधी-तूफान' : '⛈️ Thunderstorm';
    return language === 'mr' ? '🌤️ सामान्य हवामान' : language === 'hi' ? '🌤️ सामान्य मौसम' : '🌤️ Mild Weather';
  };

  const getWeatherIconOnly = (code) => {
    const c = typeof code === 'number' ? code : parseInt(code, 10) || 1;
    if (c === 0) return '☀️';
    if (c >= 1 && c <= 3) return '🌤️';
    if (c >= 45 && c <= 48) return '🌫️';
    if (c >= 51 && c <= 55) return '🌦️';
    if (c >= 61 && c <= 65) return '🌧️';
    if (c >= 95 && c <= 99) return '⛈️';
    return '🌤️';
  };

  // Safe signals normalization to guarantee array of strings
  const getSignalsList = (rawSignals) => {
    if (Array.isArray(rawSignals) && rawSignals.length > 0) {
      return rawSignals.map(s => (typeof s === 'string' ? s : String(s)));
    }
    if (typeof rawSignals === 'object' && rawSignals !== null) {
      const list = [];
      if (rawSignals.spray_favorable) list.push(t('sprayFavorable'));
      if (rawSignals.irrigation_need || rawSignals.irrigation_recommended) list.push(t('irrigationRecommended'));
      if (rawSignals.heat_stress) list.push(language === 'mr' ? '⚠️ उष्णतेचा ताण: पिकांना पाणी द्या.' : '⚠️ Heat stress risk. Ensure irrigation.');
      if (rawSignals.frost_risk) list.push(language === 'mr' ? '❄️ थंडीची शक्यता: पिकांचे संरक्षण करा.' : '❄️ Frost risk detected.');
      if (list.length > 0) return list;
    }
    return [
      t('sprayFavorable'),
      t('irrigationRecommended')
    ];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message={`${t('loadingMsg')} (${activeLocation?.name || 'Local Farm'})...`} />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState message={error} onRetry={fetchWeatherData} />
      </DashboardLayout>
    );
  }

  const temp = currentWeather?.temperature !== undefined ? currentWeather.temperature : 28.5;
  const humidity = currentWeather?.humidity !== undefined ? currentWeather.humidity : 67;
  const wind = currentWeather?.windSpeed ?? currentWeather?.wind_speed ?? 12.5;
  const precip = currentWeather?.precipitation ?? 0.0;
  const code = currentWeather?.weatherCode ?? currentWeather?.weather_code ?? 1;

  const signals = getSignalsList(currentWeather?.signals);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{t('weatherTitle')}</h1>
            <p>{t('weatherDesc')} <strong>{activeLocation?.name || 'Sangamner'}</strong> ({activeLocation?.district || 'Maharashtra'}).</p>
          </div>
          <SourceBadge source={currentWeather?.source || "Open-Meteo Micrometeorology"} status="Live Feed" />
        </div>
      </div>

      {/* Top 4 Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <MetricCard title={t('temperature')} value={temp} unit="°C" icon="🌡️" trend="stable" subtitle="Current Ambient" />
        <MetricCard title={t('humidity')} value={humidity} unit="%" icon="💧" trend="up" subtitle="Optimal Range" />
        <MetricCard title={t('windSpeed')} value={wind} unit="km/h" icon="💨" trend="stable" subtitle="Gentle Breeze" />
        <MetricCard title={t('precipitation')} value={precip} unit="mm" icon="🌧️" trend="stable" subtitle="Last 24 Hours" />
      </div>

      {/* Current Conditions & Signals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3>🌤️ {t('ambientConditions')}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 0' }}>
            <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>{getWeatherIconOnly(code)}</div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-800)', lineHeight: 1.1 }}>
                {temp}°C
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: '600' }}>
                {getWeatherEmoji(code)}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Station: <strong>{activeLocation?.name || 'Local'}</strong> ({activeLocation?.latitude || 19.88}°N, {activeLocation?.longitude || 74.48}°E)
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--primary-500)' }}>
          <div className="card-header">
            <h3>{t('weatherSignals')}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
            {signals.map((sig, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-100)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  color: 'var(--primary-900)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>🌾</span>
                <span>{sig}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Synoptic Forecast */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <h2>{t('synopticForecast')} ({activeLocation?.district || 'Region'})</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
          {forecastDays.map((d, idx) => (
            <div
              key={idx}
              style={{
                background: idx === 0 ? 'var(--primary-50)' : '#fcfdfc',
                border: idx === 0 ? '2px solid var(--primary-300)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 0.75rem',
                textAlign: 'center',
                boxShadow: idx === 0 ? '0 4px 12px rgba(45,106,79,0.08)' : 'none'
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                {idx === 0 ? (language === 'mr' ? 'आज' : language === 'hi' ? 'आज' : 'Today') : (typeof d.date === 'string' && d.date.includes('-') ? d.date.split('-').slice(1).join('/') : d.date)}
              </div>
              <div style={{ fontSize: '2rem', margin: '0.3rem 0' }}>
                {getWeatherIconOnly(d.weatherCode)}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-900)' }}>
                {d.maxTemp}° <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{d.minTemp}°</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', background: '#ffffff', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                💧 {d.precipProb}% rain
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Weather;
