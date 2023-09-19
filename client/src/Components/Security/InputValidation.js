import sanitizeHtml from 'sanitize-html';

// First Name Validation
export const sanitize = function (str) {
  return sanitizeHtml (str, {
    allowedTags: [], // No tags allowed
    allowedAttributes: {}, // No attributes allowed
  });
};

export const validateFirstName = function (str) {
  const firstNameValue = sanitize (str.value);
  const validFirstName=/^[A-Za-z]+$/;
  if (validFirstName !== '' && !validFirstName.test (firstNameValue)) {
    // alert ('First Name must be only string without white spaces');
    return false;
  } else {
    return true;
  }
};

export const validateLastName = function (str) {
  const lastNameValue = sanitize (str.value);
  const validLastName = /^[A-Za-z]+$/;
  if (lastNameValue === '') {
    // alert ('Last Name is required');
    return false;
  } else if (!validLastName.test (lastNameValue)) {
    // alert ('Last Name must be only string without white spaces');
    return false;
  } else {
    return true;
  }
};


export function validatePhoneNumber (str) {
  const re = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/im;
  if (re.test (sanitize (str.value))) {
    return true;
  } else {
    // alert ('Invalid phone number');
    return false;
  }
}

export function validateEmail (str) {
  const emailValue = sanitize (str.value);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailValue === '') {
    // alert ('Email is required');
    return false;
  } else if (!validEmail.test (emailValue)) {
    // alert ('Invalid email format');
    return false;
  } else {
    return true;
  }
}

export function validatePassword (str) {
  const passwordValue = sanitize (str.value);
  const validPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (passwordValue === '') {
    // alert ('Password is required');
    return false;
  } else if (!validPassword.test (passwordValue)) {
    // alert ('Password must contain minimum eight characters, at least one letter and one number');
    return false;
  } else {
    return true;
  }
}

export function validatePasswordConfirmation (password, confirmPassword) {
  const passwordValue = sanitize (password.value);
  const confirmPasswordValue = sanitize (confirmPassword.value);
  if (passwordValue !== confirmPasswordValue) {
    // alert ('Passwords do not match');
    return false;
  } else {
    return true;
  }
}
