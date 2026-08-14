import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SourceBadge from '../components/SourceBadge';
import MetricCard from '../components/MetricCard';
import weatherService from '../services/weatherService';
import DEFAULT_LOCATION from '../config/locations';

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = DEFAULT_LOCATION.latitude || DEFAULT_LOCATION.lat || 19.8833;
      const lon = DEFAULT_LOCATION.longitude || DEFAULT_LOCATION.lon || 74.4833;

      const [current, forecastRes] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon),
        weatherService.getForecast(lat, lon).catch(() => null)
      ]);

      setCurrentWeather(current);
      setForecastData(forecastRes?.forecast || null);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to fetch weather telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️ Clear Sky';
    if (code >= 1 && code <= 3) return '🌤️ Partly Cloudy';
    if (code >= 45 && code <= 48) return '🌫️ Foggy';
    if (code >= 51 && code <= 55) return '🌦️ Drizzle';
    if (code >= 61 && code <= 65) return '🌧️ Rain';
    if (code >= 71 && code <= 77) return '🌨️ Snow';
    if (code >= 80 && code <= 82) return '🌧️ Rain Showers';
    if (code >= 95 && code <= 99) return '⛈️ Thunderstorm';
    return '🌤️ Partly Cloudy';
  };

  const getWeatherIconOnly = (code) => {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '🌤️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '🌤️';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Fetching live meteorological data from Open-Meteo..." />
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

  // Parse 7-day forecast daily arrays if present
  const forecastDays = [];
  if (forecastData && forecastData.time) {
    for (let i = 0; i < forecastData.time.length; i++) {
      forecastDays.push({
        date: forecastData.time[i],
        maxTemp: forecastData.temperature_2m_max?.[i] ?? '--',
        minTemp: forecastData.temperature_2m_min?.[i] ?? '--',
        precipProb: forecastData.precipitation_probability_max?.[i] ?? 0,
        weatherCode: forecastData.weather_code?.[i] ?? 1
      });
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Weather Monitoring</h1>
            <p>Real-time micrometeorology and 7-day agricultural forecasts for <strong>{DEFAULT_LOCATION.name}</strong></p>
          </div>
          <SourceBadge source="Open-Meteo WMO Station" status="Live" />
        </div>
      </div>

      {/* Main Conditions Hero */}
      <div className="weather-hero-card">
        <div>
          <div style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-200)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Current Ambient Conditions
          </div>
          <div className="weather-hero-temp">
            {currentWeather?.temperature ?? 24}°C
          </div>
          <div className="weather-hero-condition">
            {getWeatherEmoji(currentWeather?.weather_code ?? 1)}
          </div>
          <div style={{ color: 'var(--primary-200)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Station Lat: {DEFAULT_LOCATION.latitude}°N | Lon: {DEFAULT_LOCATION.longitude}°E
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-200)' }}>Relative Humidity</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{currentWeather?.humidity ?? 80}%</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-200)' }}>Wind Velocity</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{currentWeather?.wind_speed ?? 12} km/h</div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <MetricCard title="Precipitation" value={currentWeather?.precipitation ?? 0} unit="mm" icon="🌧️" subtitle="Accumulated Last Hour" />
        <MetricCard title="Relative Humidity" value={currentWeather?.humidity ?? 85} unit="%" icon="💧" subtitle="Dew point threshold normal" />
        <MetricCard title="Wind Speed" value={currentWeather?.wind_speed ?? 12} unit="km/h" icon="💨" subtitle="Gentle Agricultural Breeze" />
        <MetricCard title="Weather Code" value={`WMO ${currentWeather?.weather_code ?? 3}`} icon="📡" subtitle="Standard Synoptic Code" />
      </div>

      {/* 7-Day Agricultural Forecast */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
          📅 7-Day Agricultural Synoptic Forecast
        </h2>

        {forecastDays.length > 0 ? (
          <div className="forecast-grid">
            {forecastDays.map((day, idx) => (
              <div key={idx} className="forecast-card">
                <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                </div>
                <div style={{ fontSize: '2rem', margin: '0.4rem 0' }}>
                  {getWeatherIconOnly(day.weatherCode)}
                </div>
                <div style={{ fontWeight: '800', color: 'var(--primary-900)', fontSize: '1.05rem' }}>
                  {day.maxTemp}°
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {day.minTemp}°
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: day.precipProb > 40 ? 'var(--primary-600)' : 'var(--text-muted)', marginTop: '0.4rem' }}>
                  💧 {day.precipProb}% rain
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            7-Day forecast sync in progress...
          </div>
        )}
      </div>

      {/* Agricultural Weather Signals */}
      {currentWeather?.signals && currentWeather.signals.length > 0 && (
        <div className="card" style={{ borderLeft: '5px solid var(--warning)' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span>
            <span>Automated Agricultural Weather Signals</span>
          </h2>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentWeather.signals.map((signal, idx) => (
              <li key={idx} style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                {signal}
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Weather;
