document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const emailInput = document.getElementById("email");
  const submitButton = document.getElementById("submitButton");

  let hasSubmitted = false;

  // DRY helper for showing errors only after submit
  function showFieldError(fieldId, message) {
    if (hasSubmitted) {
      showError(fieldId, message);
      const field = document.getElementById(fieldId);
      if (field) field.style.borderColor = "#e74c3c";
    }
  }

  // DRY helper for showing valid state
  function showFieldValid(fieldId) {
    if (hasSubmitted) {
      const field = document.getElementById(fieldId);
      if (field) field.style.borderColor = "#27ae60";
    }
  }

  // Show error message
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    // Remove all existing error messages in the parent
    const allErrors = Array.from(
      field.parentNode.querySelectorAll(".error-message")
    );
    allErrors.forEach((err) => err.remove());
    // Only add error if not already present
    let errorDiv = field.parentNode.querySelector(".error-message");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      errorDiv.style.color = "#e74c3c";
      errorDiv.style.fontSize = "12px";
      errorDiv.style.marginTop = "5px";
      field.parentNode.appendChild(errorDiv);
    }
    field.style.borderColor = "#e74c3c";
  }

  // Clear all errors for the entire form
  function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((error) => error.remove());
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.style.borderColor = "#e1e5e9";
    });
  }

  // Form validation function
  function validateForm() {
    const fullName = document.getElementById("fullName").value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const terms = document.getElementById("terms").checked;

    // Clear previous error messages
    clearErrors();

    let isValid = true;

    // Validate full name
    if (fullName.length < 2) {
      showFieldError(
        "fullName",
        "Full name must be at least 2 characters long"
      );
      isValid = false;
    } else {
      showFieldValid("fullName");
    }

    // Validate email
    if (!validateEmail()) {
      isValid = false;
    } else {
      showFieldValid("email");
    }

    // Validate password
    if (password.length < 8) {
      showFieldError("password", "Password must be at least 8 characters long");
      isValid = false;
    } else {
      showFieldValid("password");
    }

    // Validate password confirmation
    if (!validatePasswordMatch()) {
      isValid = false;
    } else if (confirmPassword) {
      showFieldValid("confirmPassword");
    }

    // Validate terms
    if (!terms) {
      showFieldError("terms", "You must agree to the Terms and Conditions");
      isValid = false;
    }

    return isValid;
  }

  // Email validation (uses DRY error helper)
  function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^"]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFieldError("email", "Please enter a valid email address");
      return false;
    }
    return true;
  }

  // Password match validation (uses DRY error helper)
  function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    if (confirmPassword && password !== confirmPassword) {
      showFieldError("confirmPassword", "Passwords do not match");
      return false;
    }
    return true;
  }

  // Handle form submit
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    hasSubmitted = true;
    validateForm();
  });

  // Disable confirm password unless password is valid (8+ chars)
  passwordInput.addEventListener("input", function () {
    if (passwordInput.value.length < 8) {
      confirmPasswordInput.value = "";
      confirmPasswordInput.disabled = true;
      confirmPasswordInput.style.borderColor = "#e1e5e9";
    } else {
      confirmPasswordInput.disabled = false;
    }
  });

  // On page load, ensure confirm password is disabled if password is not valid
  if (!passwordInput.value || passwordInput.value.length < 8) {
    confirmPasswordInput.disabled = true;
    confirmPasswordInput.style.borderColor = "#e1e5e9";
  }
});
