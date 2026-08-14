import api from './api';

export const sendMessage = (message, location = {}) => {
  return api.post('/chatbot/message', { message, location });
};

const chatbotService = {
  sendMessage
};

export default chatbotService;
