import api from './api';

export const getCurrentWeather = (lat, lon) => api.get('/weather/current', { lat, lon });
export const getForecast = (lat, lon) => api.get('/weather/forecast', { lat, lon });

const weatherService = {
  getCurrentWeather,
  getForecast
};

export default weatherService;
