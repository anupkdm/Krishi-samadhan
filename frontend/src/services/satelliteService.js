import api from './api';

export const getSatelliteData = (lat, lon) => api.get('/satellite/data', { lat, lon });

const satelliteService = {
  getSatelliteData
};

export default satelliteService;
