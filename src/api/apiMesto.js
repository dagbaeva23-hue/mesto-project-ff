const axios = require("axios");

const apiMesto = axios.create({
  baseURL: 'https://nomoreparties.co/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'e331375d-4ab0-428d-8f48-d5a835c55949'
  }
})

apiMesto.interceptors.response.use(
  response => {
    return response.data  
  },
  error => {
    const { status, data } = error.response || {};
    console.log('API Error:', status, data);
    return Promise.reject({
      success: false,
      error: data,
      status
    });
  }
);

const apiMestoEndpoints = {
  getProfile: async () => {
    const response = await apiMesto.get('/higher-front-back-dev_cohort_01/users/me');
    return response
  },

  getCards: async () => {
    const response = await apiMesto.get('/higher-front-back-dev_cohort_01/cards')
    return response
  },

  updateProfile: async (name, about) => {
    const response = await apiMesto.patch('/higher-front-back-dev_cohort_01/users/me', { name, about });
    return response
  },

  addNewCard: async (name, link) => {
    const response = await apiMesto.post('/higher-front-back-dev_cohort_01/cards', { name, link });
    return response
  },

  deleteCard: async (cardId) => {
    const response = await apiMesto.delete(`/higher-front-back-dev_cohort_01/cards/${cardId}`);
    return response
  },

  likeCard: async (cardId) => {
    const response = await apiMesto.put(`/higher-front-back-dev_cohort_01/cards/likes/${cardId}`)
    return response
  },

  unlikeCard: async (cardId) => {
    const response = await apiMesto.delete(`/higher-front-back-dev_cohort_01/cards/likes/${cardId}`)
    return response
  },

  updateAvatar: async (avatar) => {
    const response = await apiMesto.patch('/higher-front-back-dev_cohort_01/users/me/avatar', { avatar })
    return response
  }
}

module.exports = { apiMestoEndpoints };