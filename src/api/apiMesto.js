import axios from "axios";

const apiMesto = axios.create({
  baseURL: 'https://nomoreparties.co/v1/higher-front-back-dev_cohort_01',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'e331375d-4ab0-428d-8f48-d5a835c55949'
  }
});

apiMesto.interceptors.response.use(
  response => response.data,
  error => {
    const { status, data } = error.response || {};
    console.log('API Error:', status, data);
    return Promise.reject({ success: false, error: data, status });
  }
);

export const apiMestoEndpoints = {
  // Получение профиля пользователя
  getProfile: async () => {
    const response = await apiMesto.get('/users/me');
    return response;
  },

  // Получение всех карточек
  getCards: async () => {
    const response = await apiMesto.get('/cards');
    return response;
  },

  // Обновление профиля
  updateProfile: async (name, about) => {
    const response = await apiMesto.patch('/users/me', { name, about });
    return response;
  },

  // Добавление новой карточки
  addNewCard: async (name, link) => {
    const response = await apiMesto.post('/cards', { name, link });
    return response;
  },

  // Удаление карточки по ID
  deleteCard: async (cardId) => {
    const response = await apiMesto.delete(`/cards/${cardId}`);
    return response;
  },

  // Поставить лайк
  likeCard: async (cardId) => {
    const response = await apiMesto.put(`/cards/likes/${cardId}`);
    return response;
  },

  // Снять лайк
  unlikeCard: async (cardId) => {
    const response = await apiMesto.delete(`/cards/likes/${cardId}`);
    return response;
  },

  // Обновление аватара
  updateAvatar: async (avatar) => {
    const response = await apiMesto.patch('/users/me/avatar', { avatar });
    return response;
  }
};