export const toggleButtonClass = (buttonElement, isDisabled, text, config) => {
  
  buttonElement.disabled = isDisabled;
  buttonElement.textContent = text;
  
  buttonElement.classList.toggle(config.submitbuttonElementSelector, !isDisabled);
  buttonElement.classList.toggle(config.inactivebuttonElementClass, isDisabled);
};