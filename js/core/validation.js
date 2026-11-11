function isEmpty(value) {
  return value.trim() === "";
}

function isValidEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailPattern.test(value.trim());
}

function showFieldError(input, message) {
  const errorBox = document.querySelector("#" + input.id + "-error");
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  input.setAttribute("aria-invalid", "true");
  if (errorBox) {
    errorBox.textContent = message;
  }
}

function clearFieldError(input) {
  const errorBox = document.querySelector("#" + input.id + "-error");
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  input.removeAttribute("aria-invalid");
  if (errorBox) {
    errorBox.textContent = "";
  }
}

function validateField(input, checkFunction) {
  const errorMessage = checkFunction(input.value);
  if (errorMessage) {
    showFieldError(input, errorMessage);
    return false;
  }
  clearFieldError(input);
  return true;
}
