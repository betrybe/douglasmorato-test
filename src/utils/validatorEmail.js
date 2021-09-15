module.exports = function isValidEmail(email) {
  const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
  return !!email && typeof email === 'string' && email.match(emailRegex);
};
