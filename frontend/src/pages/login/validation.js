// Client-side validation for the login and register forms.
// Keep these rules in sync with backend/app/models/user.rb:
// the backend validates again, the frontend only gives faster feedback.
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
export const PASSWORD_MIN = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns { fieldName: 'message' } for every invalid field; {} when all is fine.
export function validateLogin({ username, password }) {
  const errors = {};
  if (!username.trim()) errors.username = 'Please enter your username.';
  if (!password) errors.password = 'Please enter your password.';
  return errors;
}

export function validateRegister({
  username,
  email,
  password,
  passwordConfirmation,
}) {
  const errors = {};
  const name = username.trim();

  if (!name) {
    errors.username = 'Please choose a username.';
  } else if (name.length < USERNAME_MIN || name.length > USERNAME_MAX) {
    errors.username = `Username must be ${USERNAME_MIN}–${USERNAME_MAX} characters.`;
  } else if (!USERNAME_PATTERN.test(name)) {
    errors.username = 'Use only letters, numbers and _.';
  }

  if (!email.trim()) {
    errors.email = 'Please enter your email.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'This email address does not look right.';
  }

  if (!password) {
    errors.password = 'Please choose a password.';
  } else if (password.length < PASSWORD_MIN) {
    errors.password = `Password must be at least ${PASSWORD_MIN} characters.`;
  }

  if (!passwordConfirmation) {
    errors.passwordConfirmation = 'Please repeat your password.';
  } else if (passwordConfirmation !== password) {
    errors.passwordConfirmation = 'Passwords do not match.';
  }

  return errors;
}

// The backend names fields in snake_case; the form uses camelCase.
// Turns { password_confirmation: ['...'] } into { passwordConfirmation: '...' }.
export function serverFieldErrors(fields = {}) {
  const errors = {};
  for (const [key, messages] of Object.entries(fields)) {
    const field = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    errors[field] = Array.isArray(messages) ? messages[0] : String(messages);
  }
  return errors;
}
