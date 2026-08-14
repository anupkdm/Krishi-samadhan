import api from './api';

export const getSchemes = (searchOrParams, categoryParam) => {
  let search = '';
  let category = '';

  if (typeof searchOrParams === 'object' && searchOrParams !== null) {
    search = searchOrParams.search || searchOrParams.search_query || '';
    category = searchOrParams.category || '';
  } else {
    search = searchOrParams || '';
    category = categoryParam || '';
  }

  const params = {};
  if (search) params.search = search;
  if (category && category !== 'All') params.category = category;

  return api.get('/schemes', params);
};

export const getSchemeById = (id) => api.get(`/schemes/${id}`);

const schemesService = {
  getSchemes,
  getSchemeById
};

export default schemesService;
