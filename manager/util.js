'use strict';

function authenticate(username, password) {
  if (username === 'user' && password === 'passwd') {
    return "userId";
  }
  return 'NULL';
}

module.exports = Object.freeze({
  authenticate,
});