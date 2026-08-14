import api from './api';

export const getSoilData = (lat, lon) => api.get('/soil/data', { lat, lon });
export const getSoilHealth = (lat, lon) => api.get('/soil/data', { lat, lon });

const soilService = {
  getSoilData,
  getSoilHealth
};

export default soilService;
