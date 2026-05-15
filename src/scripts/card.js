// Создание карточки
const createCard = (cardData, deleteCallback, likeCallback, imageCallback) => {
  const template = document.querySelector('#card-template');
  const cardElement = template.content.querySelector('.card').cloneNode(true);
  
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  
 //Лайк
  if (likeCallback) {
    likeButton.addEventListener('click', () => likeCallback(likeButton));
  }
  
  // Удаление
  if (deleteCallback) {
    deleteButton.addEventListener('click', () => deleteCallback(cardElement));
  }
  
  // Открытие изображения
  if (imageCallback) {
    cardImage.addEventListener('click', () => imageCallback(cardData.link, cardData.name));
  }
  
  return cardElement;
};

// Функция лайка (просто переключает класс)
const likeCard = (likeButton) => {
  likeButton.classList.toggle('card__like-button_is-active');
};

// Экспорт
export { createCard, likeCard };