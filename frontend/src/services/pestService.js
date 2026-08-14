import api from './api';

export const analyzePest = (imageFile, crop) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (crop) formData.append('crop', crop);
  return api.post('/pest/analyze', formData, true);
};

const pestService = {
  analyzePest
};

export default pestService;
