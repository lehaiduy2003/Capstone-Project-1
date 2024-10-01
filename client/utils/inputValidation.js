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
