import '../styles/index.css';
import '../vendor/normalize.css';
import '../images/avatar.jpg';

import { openModal, closeModal, setPopupListeners } from './modal.js';
import { createCard, handleLike, handleDelete } from './card.js';
import { initialCards } from './cards.js'; //у меня с import ошибку выводит

// DOM элементы
const placesList = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Форма редактирования профиля
const formEditProfile = document.forms['edit-profile'];
const nameInput = formEditProfile.querySelector('input[name="name"]');
const jobInput = formEditProfile.querySelector('input[name="description"]');

// Обработчик отправки формы профиля
const handleProfileSubmit = (evt) => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editProfilePopup);
};

// Открытие попапа редактирования профиля
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editProfilePopup);
});

formEditProfile.addEventListener('submit', handleProfileSubmit);

// Форма добавления карточки
const formNewCard = document.forms['new-place'];
const placeNameInput = formNewCard.querySelector('input[name="place-name"]');
const placeLinkInput = formNewCard.querySelector('input[name="link"]');

// Функция открытия изображения
const handleImageClick = (imageSrc, imageAlt) => {
  const popupImage = document.querySelector('.popup_type_image');
  const popupImageElement = popupImage.querySelector('.popup__image');
  const popupCaption = popupImage.querySelector('.popup__caption');
  
  popupImageElement.src = imageSrc;
  popupImageElement.alt = imageAlt;
  popupCaption.textContent = imageAlt;
  
  openModal(popupImage);
};

// Обработчик отправки формы добавления карточки
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

// Отображение начальных карточек
initialCards.forEach(cardData => {
  const cardElement = createCard(cardData, handleDelete, handleLike, handleImageClick);
  placesList.appendChild(cardElement);
});

// Настройка попапов (закрытие по оверлею и крестику)
const popups = document.querySelectorAll('.popup');
popups.forEach(popup => {
  setPopupListeners(popup);
});