require('../styles/index.css');
const { createCard, likeCard } = require('./card.js');
const { openModal, closeModal } = require('./modal.js');
const avatarImage = require('../images/avatar.jpg');
const { apiMestoEndpoints } = require('../api/apiMesto.js');
const { clearValidation, enableValidation } = require('./validation.js');
const { toggleButtonClass } = require('./utils.js');

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
let configTarget = {
  currentCardElement: null,
  currentCardId: null
};

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

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitbuttonElementSelector: '.popup__button',
  inactivebuttonElementClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

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

const handleSubmitAvatar = async (evt) => {
  evt.preventDefault();
  toggleButtonClass(buttonSubmitAvatar, true, 'Сохранение...', validationSettings);
  try {
    const data = await apiMestoEndpoints.updateAvatar(inputUrlAvatar.value);
    profileAvatar.style.backgroundImage = `url(${data.avatar})`;
    closeModal(popupEditAvatar);
  } catch (err) {
    console.error('Ошибка обновления аватара:', err);
  } finally {
    toggleButtonClass(buttonSubmitAvatar, false, 'Сохранить', validationSettings);
  }
};

const handleOpenAvatarPopup = () => {
  openModal(popupEditAvatar);
  clearValidation(popupEditAvatar, validationSettings);
};

const handleOpenDeletePopup = (cardElement, cardId) => {
  openModal(popupDelete);
  clearValidation(popupDelete, validationSettings);
  configTarget.currentCardId = cardId;
  configTarget.currentCardElement = cardElement;
};

const removeCard = async (buttonElementDelete, popupDelete, configTarget) => {
  toggleButtonClass(buttonElementDelete, true, 'Удаление...', validationSettings);
  try {
    await apiMestoEndpoints.deleteCard(configTarget.currentCardId);
    configTarget.currentCardElement.remove();
    closeModal(popupDelete);
  } catch (err) {
    console.error('Ошибка удаления:', err);
  } finally {
    toggleButtonClass(buttonElementDelete, false, 'Удалить', validationSettings);
  }
};

const handleClickCard = (imageSrc, imageAlt) => {
  openModal(popupTypeImage);
  popupImage.src = imageSrc;
  popupImage.alt = imageAlt;
  popupCaption.textContent = imageAlt;
};

const handleOpenPopupTypeNewCard = () => {
  openModal(popupTypeNewCard);
  clearValidation(popupTypeNewCard, validationSettings);
};

const handleOpenPopupEdit = () => {
  openModal(popupTypeEdit);
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(popupTypeEdit, validationSettings);
};

const handleEditFormSubmit = async (evt) => {
  evt.preventDefault();
  toggleButtonClass(buttonSumbitEdit, true, 'Сохранение...', validationSettings);
  try {
    const data = await apiMestoEndpoints.updateProfile(nameInput.value, descriptionInput.value);
    profileName.textContent = data.name;
    profileDescription.textContent = data.about;
    closeModal(popupTypeEdit);
  } catch (err) {
    console.error('Ошибка обновления профиля:', err);
  } finally {
    toggleButtonClass(buttonSumbitEdit, false, 'Сохранить', validationSettings);
  }
};

const handleCardCreateFormSubmit = async (evt) => {
  evt.preventDefault();
  toggleButtonClass(buttonSubmitCreate, true, 'Сохранение...', validationSettings);
  try {
    const newCard = await apiMestoEndpoints.addNewCard(placeInput.value, urlInput.value);
    const cardElement = createCard(newCard, profileId, handleOpenDeletePopup, likeCard, handleClickCard);
    list.prepend(cardElement);
    formCardCreate.reset();
    closeModal(popupTypeNewCard);
  } catch (err) {
    console.error('Ошибка добавления карточки:', err);
  } finally {
    toggleButtonClass(buttonSubmitCreate, false, 'Сохранить', validationSettings);
  }
};

const init = async () => {
  startLoadingContent();
  try {
    const [profile, cards] = await Promise.all([apiMestoEndpoints.getProfile(), apiMestoEndpoints.getCards()]);
    profileName.textContent = profile.name;
    profileDescription.textContent = profile.about;
    profileId = profile._id;
    profileAvatar.style.backgroundImage = `url(${profile.avatar})`;
    profileAvatar.style.backgroundSize = 'cover';
    profileAvatar.style.backgroundPosition = 'center';

    cards.forEach(cardData => {
      const card = createCard(cardData, profileId, handleOpenDeletePopup, likeCard, handleClickCard);
      list.append(card);
    });
  } catch (err) {
    console.error('Ошибка загрузки начальных данных:', err);
  } finally {
    endLoadingContent();
  }

  enableValidation(validationSettings);

  popups.forEach(popup => popup.classList.add('popup_is-animated'));

  addCardButton.addEventListener('click', handleOpenPopupTypeNewCard);
  buttonEdit.addEventListener('click', handleOpenPopupEdit);
  formElementEdit.addEventListener('submit', handleEditFormSubmit);
  formCardCreate.addEventListener('submit', handleCardCreateFormSubmit);
  buttonDelete.addEventListener('click', () => removeCard(buttonDelete, popupDelete, configTarget));
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