import api from './api';

export const getInputs = (category, locality, search) => {
  const params = {};
  if (category) params.category = category;
  if (locality && locality !== 'All') params.locality = locality;
  if (search) params.search = search;

  return api.get('/input-stores', params);
};

const inputStoreService = {
  getInputs
};

export default inputStoreService;
