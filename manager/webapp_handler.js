'use strict';

const Util = require('./util');

function authenticateUser(protocol, username, password) {
  const id = Util.authenticate(username, password);
  if (id !== 'NULL') {
    protocol.send({
      type: 0,
      content: {
        id: id,
      },
    });
  } else {
    protocol.send({
      type: 1,
      content: {},
    });
  }
}

module.exports = Object.freeze({
  authenticateUser,
});