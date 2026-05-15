require('../styles/index.css');
require('../vendor/normalize.css');
require('../images/avatar.jpg');

const { openModal, closeModal } = require('./modal.js');
const { initialCards } = require('./cards.js');

const avatarImage = require('../images/avatar.jpg');

const profileImage = document.querySelector('.profile__image');
if (profileImage) {
  profileImage.style.backgroundImage = `url(${avatarImage})`;
  profileImage.style.backgroundSize = 'cover';
  profileImage.style.backgroundPosition = 'center';
  profileImage.style.width = '120px';
  profileImage.style.height = '120px';
  profileImage.style.borderRadius = '50%';
}

// Функция создания карточки
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
  
  if (likeCallback) {
    likeButton.addEventListener('click', () => likeCallback(likeButton));
  }
  
  if (deleteCallback) {
    deleteButton.addEventListener('click', () => deleteCallback(cardElement));
  }
  
  if (imageCallback) {
    cardImage.addEventListener('click', () => imageCallback(cardData.link, cardData.name));
  }
  
  return cardElement;
};

const handleLike = (button) => {
  button.classList.toggle('card__like-button_is-active');
};

const handleDelete = (cardElement) => {
  cardElement.remove();
};

const handleImageClick = (imageSrc, imageAlt) => {
  const popupImage = document.querySelector('.popup_type_image');
  const popupImageElement = popupImage.querySelector('.popup__image');
  const popupCaption = popupImage.querySelector('.popup__caption');
  
  popupImageElement.src = imageSrc;
  popupImageElement.alt = imageAlt;
  popupCaption.textContent = imageAlt;
  
  openModal(popupImage);
};

const placesList = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const formEditProfile = document.forms['edit-profile'];
const nameInput = formEditProfile.querySelector('input[name="name"]');
const jobInput = formEditProfile.querySelector('input[name="description"]');

const handleProfileSubmit = (evt) => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editProfilePopup);
};

formEditProfile.addEventListener('submit', handleProfileSubmit);

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editProfilePopup);
});

const formNewCard = document.forms['new-place'];
const placeNameInput = formNewCard.querySelector('input[name="place-name"]');
const placeLinkInput = formNewCard.querySelector('input[name="link"]');

const handleNewCardSubmit = (evt) => {
  evt.preventDefault();
  
  const newCard = {
    name: placeNameInput.value,
    link: placeLinkInput.value
  };
  
  const cardElement = createCard(newCard, handleDelete, handleLike, handleImageClick);
  placesList.prepend(cardElement);
  
  formNewCard.reset();
  closeModal(addCardPopup);
};

formNewCard.addEventListener('submit', handleNewCardSubmit);

addCardButton.addEventListener('click', () => {
  openModal(addCardPopup);
});

initialCards.forEach(cardData => {
  const cardElement = createCard(cardData, handleDelete, handleLike, handleImageClick);
  placesList.appendChild(cardElement);
});

const popups = document.querySelectorAll('.popup');
popups.forEach(popup => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup || evt.target.classList.contains('popup__close')) {
      closeModal(popup);
    }
  });
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
});

