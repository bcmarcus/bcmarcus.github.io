import sanitizeHtml from 'sanitize-html';

// First Name Validation
export const sanitize = function (str) {
  return sanitizeHtml (str, {
    allowedTags: [], // No tags allowed
    allowedAttributes: {}, // No attributes allowed
  });
};

export const alwaysValid = function (str) {
  return true;
};

export const validateFirstName = function (str) {
  const firstNameValue = sanitize (str);
  const validFirstName=/^[A-Za-z]+$/;
  console.log (firstNameValue);
  if (firstNameValue !== '' && !validFirstName.test (firstNameValue)) {
    // alert ('First Name must be only string without white spaces');
    return false;
  } else {
    return true;
  }
};

export const validateLastName = function (str) {
  const lastNameValue = sanitize (str);
  const validLastName = /^[A-Za-z]+$/;
  if (lastNameValue !== '' && !validLastName.test (lastNameValue)) {
    // alert ('Last Name must be only string without white spaces');
    return false;
  } else {
    return true;
  }
};

export const validatePhoneNumber = function (str) {
  console.log (str);
  const re = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/im;
  if (str !== '' && !re.test (sanitize (str))) {
    return false;
  } else {
    // alert ('Invalid phone number');
    return true;
  }
};

export const validatePhoneNumberAgreements = function (phone, call, text, terms) {
  if (!phone) {
    return true;
  }

  if (!call && !text && !terms) {
    return false;
  }

  if ((text && !terms) || (!terms && text)) {
    return false;
  }

  return true;
};

export const validateEmail = function (str) {
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
};

export const validatePassword = function (str) {
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
};

export const validatePasswordConfirmation = function (password, confirmPassword) {
  const passwordValue = sanitize (password.value);
  const confirmPasswordValue = sanitize (confirmPassword.value);
  if (passwordValue !== confirmPasswordValue) {
    // alert ('Passwords do not match');
    return false;
  } else {
    return true;
  }
};

export const validateStreetAddress = function (str) {
  const streetAddressValue = sanitize (str);
  const validStreetAddress = /^[A-Za-z0-9\s\.,\-]+$/;
  if (streetAddressValue !== '' && !validStreetAddress.test (streetAddressValue)) {
    return false;
  } else {
    return true;
  }
};

export const validateApartmentNumber = function (str) {
  const apartmentNumberValue = sanitize (str);
  const validApartmentNumber = /^[A-Za-z0-9\s\-]+$/;
  if (apartmentNumberValue !== '' && !validApartmentNumber.test (apartmentNumberValue)) {
    return false;
  } else {
    return true;
  }
};

export const validateCity = function (str) {
  const cityValue = sanitize (str);
  const validCity = /^[A-Za-z\s]+$/;
  if (cityValue !== '' && !validCity.test (cityValue)) {
    return false;
  } else {
    return true;
  }
};

export const validateState = function (str) {
  const stateValue = sanitize (str);
  const validState = /^[A-Za-z\s]+$/;
  if (stateValue !== '' && !validState.test (stateValue)) {
    return false;
  } else {
    return true;
  }
};

export const validateZipCode = function (str) {
  const zipCodeValue = sanitize (str);
  const validZipCode = /^[0-9]+$/;
  if (zipCodeValue !== '' && !validZipCode.test (zipCodeValue)) {
    return false;
  } else {
    return true;
  }
};

export const validateCountry = function (str) {
  const countryValue = sanitize (str);
  const validCountry = /^[A-Za-z\s]+$/;
  if (countryValue !== '' && !validCountry.test (countryValue)) {
    return false;
  } else {
    return true;
  }
};

export const validateAll = function (formData) {
  const errors = [];

  // Validate firstName
  if (!validateFirstName (formData.get ('firstName'))) {
    errors.push ('First Name is invalid');
  }

  // Validate lastName
  if (!validateLastName (formData.get ('lastName'))) {
    errors.push ('Last Name is invalid');
  }

  // Validate phone
  if (!validatePhoneNumber (formData.get ('phone'))) {
    errors.push ('Phone number is invalid');
  }

  // Validate street-address
  if (!validateStreetAddress (formData.get ('street-address'))) {
    errors.push ('Street Address is invalid');
  }

  // Validate apartment
  if (!validateApartmentNumber (formData.get ('apartment'))) {
    errors.push ('Apartment number is invalid');
  }

  // Validate city
  if (!validateCity (formData.get ('city'))) {
    errors.push ('City is invalid');
  }

  // Validate state
  if (!validateState (formData.get ('state'))) {
    errors.push ('State is invalid');
  }

  // Validate postal-code
  if (!validateZipCode (formData.get ('postal-code'))) {
    errors.push ('Postal code is invalid');
  }

  // Validate country
  if (!validateCountry (formData.get ('country'))) {
    errors.push ('Country is invalid');
  }

  // If there are any errors, return them
  if (errors.length > 0) {
    return errors;
  }

  // If there are no errors, return a success message
  return;
};
