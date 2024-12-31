const email_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailIsValid = (email) => {
  return email_pattern.test(email);
};

/**
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {boolean}
 */
export const passwordMatches = (password, confirmPassword) => {
  return confirmPassword === password;
};

export const phoneIsValid = (phone) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/; // Updated regex to allow + symbol and between 10 to 15 digits
  return phoneRegex.test(phone);
};
