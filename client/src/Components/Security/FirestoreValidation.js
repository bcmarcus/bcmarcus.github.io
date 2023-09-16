// First Name Validation
const sanitize=function () {

};

const validateFirstName=function () {
  const firstNameValue=firstName.value.trim ();
  const validFirstName=/^[A-Za-z]+$/;
  if (firstNameValue=='') {
    alert ('First Name is required');
    return false;
  } else if (!validFirstName.test (firstNameValue)) {
    alert ('First Name must be only string without white spaces');
    return false;
  } else {
    return true;
  }
};

const validateLastName= function () {
  const lastNameValue=lastName.value.trim ();
  const validLastName=/^[A-Za-z]+$/;
  if (lastNameValue=='') {
    alert ('Last Name is required');
    return false;
  } else if (!validLastName.test (lastNameValue)) {
    alert ('Last Name must be only string without white spaces');
    return false;
  } else {
    return true;
  }
};


function validatePhoneNumber (input_str) {
  const re = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/im;
  if (re.test (input_str)) {
    return true;
  } else {
    alert ('Invalid phone number');
    return false;
  }
}

// const phoneNumber = document.getElementById ('phoneNumber');
// phoneNumber.oninput = function () {
//   validatePhoneNumber (phoneNumber.value);
// };


export const exports = {
  sanitize,
  validateFirstName,
  validateLastName,
  // validateEmail,
  validatePhoneNumber,
};
