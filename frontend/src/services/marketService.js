import api from './api';

export const getPrices = (params) => api.get('/market/prices', params);
export const comparePrices = (params) => api.get('/market/compare', params);
export const getTrends = (params) => api.get('/market/trends', params);

const marketService = {
  getPrices,
  comparePrices,
  getTrends
};

export default marketService;
