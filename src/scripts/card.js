export const createCard = (data, profileId, handleOpenDelete, handleLikeClick, handleClick) => {
  const template = document.querySelector('#card-template');
  const newCardElement = template.content.querySelector('.card').cloneNode(true);
  const imageElement = newCardElement.querySelector('.card__image');
  const titleElement = newCardElement.querySelector('.card__title');
  const likeButton = newCardElement.querySelector('.card__like-button');
  const deleteButton = newCardElement.querySelector('.card__delete-button');
  const likeCount = newCardElement.querySelector('.card__likes-count');

  imageElement.src = data.link;
  imageElement.alt = data.name;
  titleElement.textContent = data.name;
  likeCount.textContent = data.likes?.length ?? 0;

  // Кнопка удаления 
  if (data.owner?._id && data.owner._id !== profileId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', () => handleOpenDelete(newCardElement, data._id));
  }

  // Состояние лайка
  if (data.likes?.some(curElement => curElement._id === profileId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Обработчик лайка 
  likeButton.addEventListener('click', () => handleLikeClick(likeButton, likeCount, data._id));
  
  // Открытие изображения
  imageElement.addEventListener('click', () => handleClick(imageElement.src, imageElement.alt));
  
  return newCardElement;
};


export const updateLikeUI = (likeButton, likeCount, likesCount) => {
  likeButton.classList.toggle('card__like-button_is-active');
  likeCount.textContent = likesCount;
};

//функция для удаления карточки из DOM
export const removeCardFromDOM = (cardElement) => {
  cardElement.remove();
};