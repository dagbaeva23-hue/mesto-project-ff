const { apiMestoEndpoints } = require("../api/apiMesto");

const createCard = (data, profileId, handleOpenDelete, likeCallback, handleClick) => {
  const template = document.querySelector('#card-template');
  const newCardElement = template.content.querySelector('.card').cloneNode(true);
  const imageElement = newCardElement.querySelector('.card__image');
  const titleElement = newCardElement.querySelector('.card__title');
  const likeButton = newCardElement.querySelector('.card__like-button');
  const deleteButton = newCardElement.querySelector('.card__delete-button');
  const likeCount = newCardElement.querySelector('.card__likes-count')

  imageElement.src = data.link;
  imageElement.alt = data.name;
  titleElement.textContent = data.name;
  likeCount.textContent = data.likes?.length ?? 0

  if (data.owner?._id && data.owner._id !== profileId) {
    deleteButton.style.display = 'none'
  } else {
    deleteButton.addEventListener('click', (event) => handleOpenDelete(event.target.closest('.card'), data._id))
  }
 
  if (data.likes?.some(curElement => curElement._id === profileId)) {
    likeButton.classList.add('card__like-button_is-active')
  }

  likeButton.addEventListener('click', (event) => likeCallback(event, data._id, likeCount))
  imageElement.addEventListener('click', () => handleClick(imageElement.src, imageElement.alt))
  return newCardElement;
}

const likeCard = async (event, cardId, likeCountElement) => {
  const isLiked = event.target.classList.contains('card__like-button_is-active');
  try {
    let response;
    if (isLiked) {
      response = await apiMestoEndpoints.unlikeCard(cardId);
    } else {
      response = await apiMestoEndpoints.likeCard(cardId);
    }
    
   
    if (response && response.data && response.data.likes) {
      event.target.classList.toggle('card__like-button_is-active');
      likeCountElement.textContent = response.data.likes.length;
    } else if (response && response.likes) {
    
      event.target.classList.toggle('card__like-button_is-active');
      likeCountElement.textContent = response.likes.length;
    } else {
      console.error('Неожиданный формат ответа:', response);
    }
  } catch (err) {
    console.error('Ошибка при лайке:', err);
  }
}

module.exports = { createCard, likeCard }