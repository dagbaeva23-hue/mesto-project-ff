export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const hideError = (formElement, inputElement, config) => {
  inputElement.classList.remove(config.inputErrorClass);
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
};

const showError = (formElement, inputElement, config) => {
  inputElement.classList.add(config.inputErrorClass);
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = inputElement.validationMessage;
    errorElement.classList.add(config.errorClass);
  }
};

const checkInputValidity = (formElement, inputElement, config) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }
  if (!inputElement.validity.valid) {
    showError(formElement, inputElement, config);
  } else {
    hideError(formElement, inputElement, config);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some(inputElement => !inputElement.validity.valid);
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (!buttonElement) return;
  
  if (buttonElement.disabled) return;
  
  const isInvalid = hasInvalidInput(inputList);
  if (isInvalid) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

const setEventListeners = (formElement, inputList, buttonElement, config) => {
  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

export const clearValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  
  inputList.forEach(inputElement => {
    hideError(formElement, inputElement, config);
    inputElement.setCustomValidity('');
  });
  
  if (buttonElement) {
    toggleButtonState(inputList, buttonElement, config);
  }
};

export const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach(formElement => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
    
    if (buttonElement) {
      buttonElement.disabled = true;
      buttonElement.classList.add(config.inactiveButtonClass);
    }
    
    setEventListeners(formElement, inputList, buttonElement, config);
  });
};