const bcrypt = require('bcryptjs');

//////////////////           HELPER FUNCTIONS        /////////////////
const findUserByEmail = function(email, users) {
  for (let userId in users) {
    const user = users[userId];
    if (email === user.email) {
      return user;
    }
  }
  return false;
};

//generating a string
const generateRandomString = function() {
  let randomString = Math.random().toString(36).substring(6);
  return randomString;
};

//authentication of user by email and password
const authenticateUser = (users, email, password) => {
  for (const elem in users) {
    let currUser = users[elem];
    if (currUser.email === email) {
      if (bcrypt.compareSync(password, currUser.password)) {
        return {user: currUser, error: null};
      }
      return {user: null, error: 'incorrect password'};
    }
  }
  return {user: null, error: 'incorrect email'};
};

//generate a user id as a random string
const createUser = function(email, password, users) {
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email,
    password
  };
  return userId;
};

module.exports = { findUserByEmail };
module.exports = { generateRandomString };
module.exports = { authenticateUser };
module.exports = { createUser };
