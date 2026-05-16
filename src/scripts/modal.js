module.exports = { openModal, closeModal };


// Функция открытия попапа
function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

// Функция закрытия попапа
function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

// Закрытие по Escape
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Закрытие по клику на оверлей или крестик
function handleOverlayClose(evt) {
  if (evt.target === evt.currentTarget || evt.target.classList.contains('popup__close')) {
    closeModal(evt.currentTarget);
  }
}

// Добавление слушателей на попап
function setPopupListeners(popup) {
  popup.addEventListener('click', handleOverlayClose);
}

module.exports = { openModal, closeModal, setPopupListeners };