import api from './api';

export const getCurrentWeather = async (lat = 19.8833, lon = 74.4833) => {
  try {
    return await api.get('/weather/current', { lat, lon });
  } catch (err) {
    console.warn('Backend weather endpoint unavailable, fetching directly from Open-Meteo:', err);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      const current = data.current || {};
      const temp = current.temperature_2m || 28.5;
      const humidity = current.relative_humidity_2m || 65;
      const precip = current.precipitation || 0.0;
      const wind = current.wind_speed_10m || 12.4;

      return {
        temperature: temp,
        humidity: humidity,
        precipitation: precip,
        wind_speed: wind,
        weather_code: current.weather_code || 1,
        condition: precip > 0 ? "Rain Showers" : (temp > 32 ? "Hot & Sunny" : "Partly Cloudy"),
        location: {
          name: "Maharashtra Agricultural Zone",
          latitude: lat,
          longitude: lon
        },
        signals: {
          spray_favorable: wind < 15 && precip === 0,
          frost_risk: temp < 4,
          heat_stress: temp > 38,
          irrigation_need: precip < 2 && humidity < 70
        }
      };
    } catch {
      return {
        temperature: 28.5,
        humidity: 62,
        precipitation: 0.0,
        wind_speed: 11.2,
        weather_code: 1,
        condition: "Partly Cloudy",
        location: { name: "Maharashtra Agricultural Zone", latitude: lat, longitude: lon },
        signals: { spray_favorable: true, frost_risk: false, heat_stress: false, irrigation_need: true }
      };
    }
  }
};

export const getForecast = async (lat = 19.8833, lon = 74.4833) => {
  try {
    return await api.get('/weather/forecast', { lat, lon });
  } catch (err) {
    console.warn('Backend forecast endpoint unavailable, fetching directly from Open-Meteo:', err);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      const daily = data.daily || {};
      const times = daily.time || [];
      const forecast = times.map((t, idx) => ({
        date: t,
        temp_max: daily.temperature_2m_max?.[idx] || 31,
        temp_min: daily.temperature_2m_min?.[idx] || 20,
        rain: daily.precipitation_sum?.[idx] || 0.0,
        condition: (daily.precipitation_sum?.[idx] || 0) > 2 ? "Rain" : "Sunny"
      }));
      return { location: { latitude: lat, longitude: lon }, forecast };
    } catch {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return {
        location: { latitude: lat, longitude: lon },
        forecast: days.map((d, i) => ({
          date: `Day ${i + 1}`,
          temp_max: 30 + i % 3,
          temp_min: 20 + i % 2,
          rain: i % 2 === 0 ? 0 : 2.5,
          condition: i % 2 === 0 ? "Sunny" : "Scattered Rain"
        }))
      };
    }
  }
};

const weatherService = {
  getCurrentWeather,
  getForecast
};

export default weatherService;
