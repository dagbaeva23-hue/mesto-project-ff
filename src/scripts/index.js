import '../styles/index.css';
import '../vendor/normalize.css';

import { createCard, updateLikeState, removeCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import { apiMestoEndpoints } from '../api/apiMesto.js';
import { clearValidation, enableValidation } from './validation.js';
import { toggleButtonClass } from './utils.js';

// DOM элементы
const list = document.querySelector('.places__list');
const profileAvatar = document.querySelector('.profile__image');
const popups = document.querySelectorAll('.popup');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const buttonsCloseModal = document.querySelectorAll('.popup__close');
const addCardButton = document.querySelector('.profile__add-button');
const loadingContent = document.querySelector('.content__loading');
const content = document.querySelector('.content');
const buttonEdit = document.querySelector('.profile__edit-button');

let profileId = null;
const configTarget = {
  currentCardElement: null,
  currentCardId: null
};

// Попапы
const popupTypeEdit = document.querySelector('.popup_type_edit');
const formElementEdit = document.forms['edit-profile'];
const nameInput = formElementEdit.elements.name;
const descriptionInput = formElementEdit.elements.description;
const buttonSumbitEdit = formElementEdit.elements.button;

const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

const popupTypeNewCard = document.querySelector('.popup_type_new-card');
const formCardCreate = document.forms['new-place'];
const placeInput = formCardCreate.elements['place-name'];
const urlInput = formCardCreate.elements.link;
const buttonSubmitCreate = formCardCreate.elements.button;

const popupDelete = document.querySelector('.popup_type_delete');
const buttonDelete = popupDelete.querySelector('.popup__button');

const popupEditAvatar = document.querySelector('.popup_type_edit_avatar');
const formEditAvatar = document.forms['edit-avatar'];
const inputUrlAvatar = formEditAvatar.elements.link;
const buttonSubmitAvatar = formEditAvatar.elements.button;

// Настройки валидации
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Загрузка контента
const startLoadingContent = () => {
  if (loadingContent && content) {
    loadingContent.classList.add('active');
    content.classList.remove('active');
  }
};

const endLoadingContent = () => {
  if (loadingContent && content) {
    loadingContent.classList.remove('active');
    content.classList.add('active');
  }
};

// Обработчик лайка
const handleLike = async (likeButton, likeCount, cardId) => {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  
  try {
    let response;
    if (isLiked) {
      response = await apiMestoEndpoints.unlikeCard(cardId);
    } else {
      response = await apiMestoEndpoints.likeCard(cardId);
    }
    
    // Обновляем интерфейс, используя чистую функцию из card.js
    updateLikeState(likeButton, likeCount, response.likes.length);
  } catch (err) {
    console.error('Ошибка при лайке:', err);
  }
};

// Обработчик удаления
const handleDeleteCard = async (cardElement, cardId) => {
  try {
    await apiMestoEndpoints.deleteCard(cardId);
    removeCard(cardElement);
    closeModal(popupDelete);
  } catch (err) {
    console.error('Ошибка удаления:', err);
  }
};

// Открытие попапа удаления
const handleOpenDeletePopup = (cardElement, cardId) => {
  configTarget.currentCardElement = cardElement;
  configTarget.currentCardId = cardId;
  openModal(popupDelete);
};

// Подтверждение удаления
const handleConfirmDelete = () => {
  handleDeleteCard(configTarget.currentCardElement, configTarget.currentCardId);
};

// Обновление аватара
const handleSubmitAvatar = async (evt) => {
  evt.preventDefault();
  toggleButtonClass(buttonSubmitAvatar, true, 'Сохранение...', validationSettings);
  try {
    const data = await apiMestoEndpoints.updateAvatar(inputUrlAvatar.value);
    profileAvatar.style.backgroundImage = `url(${data.avatar})`;
    closeModal(popupEditAvatar);
    formEditAvatar.reset();
  } catch (err) {
    console.log('Не удалось обновить аватар:', err);
  } finally {
    toggleButtonClass(buttonSubmitAvatar, false, 'Сохранить', validationSettings);
  }
};

const handleOpenAvatarPopup = () => {
  openModal(popupEditAvatar);
  clearValidation(popupEditAvatar, validationSettings);
};

// Открытие изображения
const handleClickCard = (imageSrc, imageAlt) => {
  openModal(popupTypeImage);
  popupImage.src = imageSrc;
  popupImage.alt = imageAlt;
  popupCaption.textContent = imageAlt;
};

// Открытие попапа добавления карточки
const handleOpenPopupTypeNewCard = () => {
  openModal(popupTypeNewCard);
  clearValidation(popupTypeNewCard, validationSettings);
};

// Открытие попапа редактирования профиля
const handleOpenPopupEdit = () => {
  openModal(popupTypeEdit);
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(popupTypeEdit, validationSettings);
};

// Редактирование профиля
const handleEditFormSubmit = async (evt) => {
  evt.preventDefault();
  toggleButtonClass(buttonSumbitEdit, true, 'Сохранение...', validationSettings);
  try {
    const data = await apiMestoEndpoints.updateProfile(nameInput.value, descriptionInput.value);
    profileName.textContent = data.name;
    profileDescription.textContent = data.about;
    closeModal(popupTypeEdit);
  } catch (err) {
    console.log('Ошибка обновления профиля:', err);
  } finally {
    toggleButtonClass(buttonSumbitEdit, false, 'Сохранить', validationSettings);
  }
};

// Добавление новой карточки
const handleCardCreateFormSubmit = async (evt) => {
  evt.preventDefault();
  toggleButtonClass(buttonSubmitCreate, true, 'Сохранение...', validationSettings);
  try {
    const newCardData = await apiMestoEndpoints.addNewCard(placeInput.value, urlInput.value);
    const card = createCard(
      newCardData,
      profileId,
      handleOpenDeletePopup,
      handleLike,
      handleClickCard
    );
    list.prepend(card);
    formCardCreate.reset();
    closeModal(popupTypeNewCard);
  } catch (err) {
    console.log('Ошибка добавления карточки:', err);
  } finally {
    toggleButtonClass(buttonSubmitCreate, false, 'Сохранить', validationSettings);
  }
};

// Инициализация
const init = async () => {
  startLoadingContent();
  try {
    const [profile, cards] = await Promise.all([
      apiMestoEndpoints.getProfile(),
      apiMestoEndpoints.getCards()
    ]);
    
    profileAvatar.style.backgroundImage = `url(${profile.avatar})`;
    profileName.textContent = profile.name;
    profileDescription.textContent = profile.about;
    profileId = profile._id;

    popups.forEach(popup => popup.classList.add('popup_is-animated'));

    cards.forEach(cardData => {
      const card = createCard(
        cardData,
        profileId,
        handleOpenDeletePopup,
        handleLike,
        handleClickCard
      );
      list.append(card);
    });
  } catch (err) {
    console.error('Ошибка загрузки начальных данных:', err);
  } finally {
    endLoadingContent();
  }

  enableValidation(validationSettings);

  addCardButton.addEventListener('click', handleOpenPopupTypeNewCard);
  buttonEdit.addEventListener('click', handleOpenPopupEdit);
  formElementEdit.addEventListener('submit', handleEditFormSubmit);
  formCardCreate.addEventListener('submit', handleCardCreateFormSubmit);
  buttonDelete.addEventListener('click', handleConfirmDelete);
  profileAvatar.addEventListener('click', handleOpenAvatarPopup);
  formEditAvatar.addEventListener('submit', handleSubmitAvatar);

  buttonsCloseModal.forEach(button => {
    button.addEventListener('click', () => {
      const modal = document.querySelector('.popup_is-opened');
      if (modal) closeModal(modal);
    });
  });
};

init();