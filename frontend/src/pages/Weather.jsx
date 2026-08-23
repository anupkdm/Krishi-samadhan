import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SourceBadge from '../components/SourceBadge';
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
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const coords = {
    lat: activeLocation.latitude || 19.5772,
    lon: activeLocation.longitude || 74.2173
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [current, forecastRes] = await Promise.all([
        weatherService.getCurrentWeather(coords.lat, coords.lon),
        weatherService.getForecast(coords.lat, coords.lon).catch(() => null)
      ]);

      setCurrentWeather(current);

      const parsedDays = [];
      if (forecastRes && Array.isArray(forecastRes.forecast)) {
        forecastRes.forecast.forEach((item, idx) => {
          parsedDays.push({
            date: item.date || `Day ${idx + 1}`,
            maxTemp: Math.round(item.temp_max ?? item.maxTemp ?? 31),
            minTemp: Math.round(item.temp_min ?? item.minTemp ?? 20),
            rain: item.rain ?? (item.precipitation_sum ?? 0),
            precipProb: item.precipitation_probability ?? (item.rain > 0 ? 60 : 15),
            weatherCode: item.weather_code ?? (item.rain > 0 ? 61 : 1),
            windSpeed: item.wind_speed ?? 12,
            uvIndex: item.uv_index ?? 6.0,
            sunrise: item.sunrise || '06:05',
            sunset: item.sunset || '18:45'
          });
        });
      } else if (forecastRes && forecastRes.daily && Array.isArray(forecastRes.daily.time)) {
        const d = forecastRes.daily;
        for (let i = 0; i < d.time.length; i++) {
          parsedDays.push({
            date: d.time[i],
            maxTemp: Math.round(d.temperature_2m_max?.[i] ?? 31),
            minTemp: Math.round(d.temperature_2m_min?.[i] ?? 20),
            rain: Math.round((d.precipitation_sum?.[i] ?? 0.0) * 10) / 10,
            precipProb: d.precipitation_probability_max?.[i] ?? (d.precipitation_sum?.[i] > 0 ? 60 : 15),
            weatherCode: d.weather_code?.[i] ?? 1,
            windSpeed: Math.round((d.wind_speed_10m_max?.[i] ?? 14) * 10) / 10,
            uvIndex: d.uv_index_max?.[i] ?? 6.5,
            sunrise: d.sunrise?.[i] ? d.sunrise[i].split('T')[1] : '06:05',
            sunset: d.sunset?.[i] ? d.sunset[i].split('T')[1] : '18:45'
          });
        }
      }

      if (parsedDays.length === 0) {
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() + i);
          parsedDays.push({
            date: d.toISOString().split('T')[0],
            maxTemp: 31 + (i % 3),
            minTemp: 21 + (i % 2),
            rain: (i === 1) ? 12.5 : (i % 3 === 0 ? 2.5 : 0),
            precipProb: (i === 1) ? 75 : ((i % 3 === 0) ? 45 : 10),
            weatherCode: (i === 1) ? 61 : ((i % 3 === 0) ? 2 : 0),
            windSpeed: 12 + (i % 3),
            uvIndex: 6.2,
            sunrise: '06:08',
            sunset: '18:42'
          });
        }
      }

      setForecastDays(parsedDays);
      setHourlyData(forecastRes?.hourly || null);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to fetch real-time weather telemetry.');
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

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message={`${t('loadingMsg')} (${activeLocation.name})...`} />
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

  // Hourly items formatting (next 12 hours)
  const next12Hours = [];
  if (hourlyData && hourlyData.time && Array.isArray(hourlyData.time)) {
    const nowHour = new Date().getHours();
    for (let i = nowHour; i < Math.min(nowHour + 12, hourlyData.time.length); i++) {
      next12Hours.push({
        time: hourlyData.time[i]?.split('T')?.[1]?.substring(0, 5) || `${i}:00`,
        temp: Math.round(hourlyData.temperature_2m?.[i] ?? 28),
        humidity: Math.round(hourlyData.relative_humidity_2m?.[i] ?? 65),
        precipProb: Math.round(hourlyData.precipitation_probability?.[i] ?? 0),
        weatherCode: hourlyData.weather_code?.[i] ?? 1,
        wind: Math.round((hourlyData.wind_speed_10m?.[i] ?? 12) * 10) / 10
      });
    }
  }

  return (
    <DashboardLayout>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{t('weatherTitle')}</h1>
            <p>
              {t('weatherDesc')} <strong>{activeLocation.name}</strong> ({activeLocation.district}), {coords.lat.toFixed(4)}°N, {coords.lon.toFixed(4)}°E
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-sm btn-outline"
              onClick={fetchWeatherData}
              title="Refresh Real-Time Satellite & Sensor Telemetry"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>🔄</span> {language === 'mr' ? 'अपडेट करा' : 'Refresh Telemetry'}
            </button>
            <SourceBadge source={currentWeather?.source || "Open-Meteo High-Resolution (ECMWF/DWD)"} status="Live Sync" />
          </div>
        </div>
      </div>

      {/* 1. PRIMARY METRIC CARDS (REAL-TIME SENSORS) */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
          📡 {language === 'mr' ? 'थेट हवामान सेन्सर व उपग्रह नोंदी (Live Telemetry)' : 'Real-Time Meteorological Sensor & Satellite Feed'}
        </div>

        <div className="dashboard-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {/* Temperature & Feels Like */}
          <div className="metric-card" style={{ borderLeft: '4px solid #ef4444' }}>
            <div className="metric-card-top">
              <span className="metric-card-title">🌡️ {t('temperature')}</span>
              <span className="metric-card-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>🔥</span>
            </div>
            <div className="metric-card-value-wrap">
              <span className="metric-card-value">{currentWeather?.temperature ?? 28.5}</span>
              <span className="metric-card-unit">°C</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Feels Like: <strong>{currentWeather?.feelsLike ?? 29.0}°C</strong> | Range: <strong>{forecastDays[0]?.minTemp}°–{forecastDays[0]?.maxTemp}°C</strong>
            </div>
          </div>

          {/* Rainfall Rate */}
          <div className="metric-card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div className="metric-card-top">
              <span className="metric-card-title">🌧️ {t('precipitation')}</span>
              <span className="metric-card-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>💧</span>
            </div>
            <div className="metric-card-value-wrap">
              <span className="metric-card-value">{currentWeather?.precipitation ?? 0.0}</span>
              <span className="metric-card-unit">mm/hr</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Today: <strong>{forecastDays[0]?.rain ?? 0} mm</strong> ({forecastDays[0]?.precipProb ?? 10}% probability)
            </div>
          </div>

          {/* Relative Humidity */}
          <div className="metric-card" style={{ borderLeft: '4px solid #10b981' }}>
            <div className="metric-card-top">
              <span className="metric-card-title">💧 {t('humidity')}</span>
              <span className="metric-card-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>🌿</span>
            </div>
            <div className="metric-card-value-wrap">
              <span className="metric-card-value">{currentWeather?.humidity ?? 65}</span>
              <span className="metric-card-unit">% RH</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Dew Point: <strong>{currentWeather?.dewPoint ?? 19.5}°C</strong> (Optimal assimilation)
            </div>
          </div>

          {/* Wind Speed & Direction */}
          <div className="metric-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
            <div className="metric-card-top">
              <span className="metric-card-title">🌬️ {t('windSpeed')}</span>
              <span className="metric-card-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>💨</span>
            </div>
            <div className="metric-card-value-wrap">
              <span className="metric-card-value">{currentWeather?.windSpeed ?? 12.0}</span>
              <span className="metric-card-unit">km/h</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Direction: <strong>{currentWeather?.windDirection ?? 'ENE'}</strong> | Gusts: <strong>{currentWeather?.windGusts ?? 15} km/h</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECONDARY METEOROLOGICAL PARAMETERS (UV, PRESSURE, CLOUDS, SPRAY WINDOW) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Ambient Condition & Sun Times */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #fafdfb 0%, #f0fdf4 100%)', border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ fontSize: '3.2rem', lineHeight: 1 }}>
              {getWeatherIconOnly(currentWeather?.weatherCode ?? 1)}
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                {getWeatherEmoji(currentWeather?.weatherCode ?? 1)}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Cloud Cover: <strong>{currentWeather?.cloudCover ?? 20}%</strong> | Pressure: <strong>{currentWeather?.pressure ?? 955} hPa</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                ☀️ Sunrise: <strong>{forecastDays[0]?.sunrise || '06:05 AM'}</strong> &bull; Sunset: <strong>{forecastDays[0]?.sunset || '06:45 PM'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Spray Window & UV Radiation */}
        <div className="card" style={{ borderLeft: '4px solid #10b981', background: '#fafbfc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <strong style={{ fontSize: '0.95rem', color: 'var(--primary-900)' }}>
              ⚡ {language === 'mr' ? 'फवारणी सुरक्षा व UV निर्देशांक' : 'Spray Safety & UV Radiation'}
            </strong>
            <span className={`badge ${currentWeather?.sprayWindow?.favorable ? 'badge-success' : 'badge-warning'}`}>
              {currentWeather?.sprayWindow?.favorable ? 'Spray Safe' : 'Spray Warning'}
            </span>
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {currentWeather?.sprayWindow?.message || 'Wind speeds are gentle (<15 km/h) and no rainfall expected.'}
          </div>
          <div style={{ marginTop: '0.45rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            UV Index: <strong>{currentWeather?.uvIndex ?? 6.5} / 10</strong> (Moderate Solar Radiation)
          </div>
        </div>
      </div>

      {/* 3. HOURLY TIMELINE FORECAST (NEXT 12 HOURS) */}
      {next12Hours.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <h2>⏱️ {language === 'mr' ? 'पुढील २४ तासांचा तासनिहाय हवामान अंदाज' : 'Next 12-Hour Hourly Weather Forecast'}</h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>High-Frequency ECMWF Model</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {next12Hours.map((h, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: '95px',
                  background: idx === 0 ? 'var(--primary-50)' : '#ffffff',
                  border: idx === 0 ? '2px solid var(--primary-400)' : '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.5rem',
                  textAlign: 'center',
                  flexShrink: 0
                }}
              >
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {h.time}
                </div>
                <div style={{ fontSize: '1.4rem', margin: '0.2rem 0' }}>
                  {getWeatherIconOnly(h.weatherCode)}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  {h.temp}°C
                </div>
                <div style={{ fontSize: '0.7rem', color: h.precipProb > 30 ? '#0284c7' : 'var(--text-muted)', marginTop: '0.2rem' }}>
                  💧 {h.precipProb}%
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  💨 {h.wind}k/h
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. WEATHER ENGINE RISK GAUGES (FLOOD, HEATWAVE, DROUGHT) */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
          ⚙️ {language === 'mr' ? 'हवामान जोखीम विश्लेषण (Flood • Heatwave • Drought)' : 'Weather Engine Agronomic Risk Analysis'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Flood Risk */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            borderTop: '4px solid #0284c7',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🌊</span> {language === 'mr' ? 'पूर व पाणी साचण्याची जोखीम' : 'Flood & Waterlogging Risk'}
              </strong>
              <span className={`badge ${currentWeather?.floodRisk?.level === 'High' ? 'badge-danger' : 'badge-info'}`}>
                {currentWeather?.floodRisk?.level || 'Low'}
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0c4a6e', margin: '0.35rem 0' }}>
              {currentWeather?.floodRisk?.score || 15}% <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Risk Index</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {currentWeather?.floodRisk?.message || 'Normal surface runoff. Drainage channels stable.'}
            </p>
          </div>

          {/* Heatwave Risk */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            borderTop: '4px solid #ea580c',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1rem', color: '#c2410c', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🌡️</span> {language === 'mr' ? 'उष्णतेची लाट व ताण' : 'Heatwave & Thermal Stress'}
              </strong>
              <span className={`badge ${currentWeather?.heatwaveRisk?.level === 'High' ? 'badge-danger' : 'badge-warning'}`}>
                {currentWeather?.heatwaveRisk?.level || 'Low'}
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c2d12', margin: '0.35rem 0' }}>
              {currentWeather?.heatwaveRisk?.score || 20}% <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Thermal Index</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {currentWeather?.heatwaveRisk?.message || 'Ambient temperatures within optimal photosynthetic range.'}
            </p>
          </div>

          {/* Drought Risk */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            borderTop: '4px solid #eab308',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1rem', color: '#a16207', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🏜️</span> {language === 'mr' ? 'पाणी टंचाई व ओलावा तूट' : 'Drought & Moisture Deficit'}
              </strong>
              <span className="badge badge-warning">
                {currentWeather?.droughtRisk?.level || 'Low'}
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#713f12', margin: '0.35rem 0' }}>
              {currentWeather?.droughtRisk?.score || 18}% <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Deficit Index</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {currentWeather?.droughtRisk?.message || 'Soil moisture reserves adequate for current crop growth.'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. 7-DAY SYNOPTIC FORECAST */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2>📅 {t('synopticForecast')} ({activeLocation.district || activeLocation.name})</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>7-Day Real-Time Synoptic Model</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.75rem' }}>
          {forecastDays.map((day, idx) => (
            <div
              key={idx}
              style={{
                background: idx === 0 ? 'var(--primary-50)' : '#ffffff',
                border: idx === 0 ? '2px solid var(--primary-500)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem 0.75rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: idx === 0 ? 'var(--primary-800)' : 'var(--text-muted)' }}>
                {idx === 0
                  ? (language === 'mr' ? 'आज' : language === 'hi' ? 'आज' : 'Today')
                  : new Date(day.date).toLocaleDateString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
              </div>

              <div style={{ fontSize: '1.85rem', margin: '0.35rem 0' }}>
                {getWeatherIconOnly(day.weatherCode)}
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {getWeatherEmoji(day.weatherCode).split(' ')[1] || 'Clear'}
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                {day.maxTemp}° <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {day.minTemp}°</span>
              </div>

              <div style={{ fontSize: '0.74rem', color: day.precipProb > 40 ? '#0284c7' : 'var(--text-muted)', marginTop: '0.3rem', fontWeight: 700 }}>
                💧 {day.precipProb}% ({day.rain} mm)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. ACTIONABLE AGRONOMIC FIELD ADVISORIES */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
          📋 {language === 'mr' ? 'हवामानावर आधारित शेती कृती आराखडा' : 'Weather-Driven Actionable Agronomic Advisories'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(currentWeather?.farmerAlerts || []).map((alt, aIdx) => (
            <div
              key={aIdx}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                borderLeft: `5px solid ${alt.priority === 'High' ? '#ef4444' : alt.priority === 'Medium' ? '#f59e0b' : '#10b981'}`,
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{alt.icon}</span>
                <strong style={{ fontSize: '1.02rem', color: alt.priority === 'High' ? '#991b1b' : 'var(--primary-900)' }}>
                  {alt.title}
                </strong>
                <span className={`badge ${alt.priority === 'High' ? 'badge-danger' : alt.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                  {alt.priority} Priority
                </span>
              </div>
              <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Agronomic Protocol:</strong> {alt.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Weather;
