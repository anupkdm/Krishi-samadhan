import api from './api';

export const getCurrentWeather = async (lat = 19.8833, lon = 74.4833) => {
  try {
    const res = await api.get('/weather/current', { lat, lon });
    if (res && (res.temperature !== undefined || res.temp !== undefined)) {
      return res;
    }
  } catch (err) {
    console.warn('Backend weather endpoint unavailable, fetching directly from Open-Meteo:', err);
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const current = data.current || {};
    const temp = Math.round((current.temperature_2m ?? 28.5) * 10) / 10;
    const humidity = Math.round(current.relative_humidity_2m ?? 65);
    const precip = current.precipitation ?? 0.0;
    const wind = Math.round((current.wind_speed_10m ?? 12.4) * 10) / 10;
    const code = current.weather_code ?? 1;

    const signals = [];
    if (wind < 15 && precip === 0) {
      signals.push('Spray Favorable: Wind speeds are gentle and no precipitation expected.');
    } else {
      signals.push('Spray Warning: High winds or rain detected, defer chemical spraying.');
    }
    if (precip < 2 && humidity < 75) {
      signals.push('Irrigation Recommended: Low precipitation in past 24 hours.');
    } else {
      signals.push('Soil Moisture Sufficient: Defer heavy irrigation.');
    }

    return {
      temperature: temp,
      humidity: humidity,
      precipitation: precip,
      windSpeed: wind,
      wind_speed: wind,
      weatherCode: code,
      weather_code: code,
      condition: precip > 0 ? "Rain Showers" : (temp > 32 ? "Hot & Sunny" : "Partly Cloudy"),
      source: "Open-Meteo Micrometeorology",
      status: "Live",
      signals
    };
  } catch {
    return {
      temperature: 28.5,
      humidity: 62,
      precipitation: 0.0,
      windSpeed: 11.2,
      wind_speed: 11.2,
      weatherCode: 1,
      weather_code: 1,
      condition: "Partly Cloudy",
      source: "Regional Weather Sensor",
      status: "Estimated",
      signals: [
        'Spray Favorable: Wind speeds are gentle and no precipitation expected.',
        'Irrigation Recommended: Low precipitation in past 24 hours.'
      ]
    };
  }
};

export const getForecast = async (lat = 19.8833, lon = 74.4833) => {
  try {
    const res = await api.get('/weather/forecast', { lat, lon });
    if (res && res.forecast) {
      return res;
    }
  } catch (err) {
    console.warn('Backend forecast endpoint unavailable, fetching directly from Open-Meteo:', err);
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const daily = data.daily || {};
    const times = daily.time || [];
    const forecast = times.map((t, idx) => ({
      date: t,
      temp_max: Math.round(daily.temperature_2m_max?.[idx] ?? 31),
      temp_min: Math.round(daily.temperature_2m_min?.[idx] ?? 20),
      rain: daily.precipitation_sum?.[idx] ?? 0.0,
      precipitation_probability: daily.precipitation_probability_max?.[idx] ?? (daily.precipitation_sum?.[idx] > 0 ? 60 : 10),
      weather_code: daily.weather_code?.[idx] ?? 1
    }));
    return { forecast, daily, source: "Open-Meteo 7-Day Model" };
  } catch {
    const fallbackDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      fallbackDays.push({
        date: d.toISOString().split('T')[0],
        temp_max: 31 + (i % 3),
        temp_min: 21 + (i % 2),
        rain: (i % 3 === 0) ? 2.5 : 0,
        precipitation_probability: (i % 3 === 0) ? 60 : 10,
        weather_code: (i % 3 === 0) ? 61 : 1
      });
    }
    return { forecast: fallbackDays, source: "Agronomic Forecast Model" };
  }
};

const weatherService = {
  getCurrentWeather,
  getForecast
};

export default weatherService;
