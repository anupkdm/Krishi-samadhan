import api from './api';

export const getAdvisories = (lat, lon) => api.get('/advisory', { lat, lon });
export const generateAdvisories = (lat, lon) => api.post('/advisory/generate', { lat, lon });

const advisoryService = {
  getAdvisories,
  generateAdvisories
};

export default advisoryService;
