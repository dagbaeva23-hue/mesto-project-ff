function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscape);
  popup.addEventListener('click', handleOverlay);
}

function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscape);
  popup.removeEventListener('click', handleOverlay);
}

function handleEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

function handleOverlay(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

module.exports = { openModal, closeModal }