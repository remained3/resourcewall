const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
app.set('view engine', 'ejs');
const app = express();
app.use(cookieParser());
const { findUserByEmail } = require("./helperFunctions");
const { generateRandomString } = require("./helperFunctions");
const { authenticateUser } = require("./helperFunctions");
const { createUser } = require("./helperFunctions");

/////////////////           REGISTER GET          /////////////////
//displays registration page
app.get("/register", (req, res) => {
  const templateVars = {
    username: null
  };
  res.render("urls_register", templateVars);
});

/////////////////             LOGIN GET           /////////////////
//displays login page
app.get("/login", (req, res) => {
  const templateVars = {
    username: null
  };
  res.render('urls_login', templateVars);
});

/////////////////             LOGIN  POST          /////////////////
// login action after authentication passes or fails
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = authenticateUser(users, email, password);
  if (username.user) {
    req.session.user_id = username.user.id;
    return res.redirect("/urls");
  }
  res.status(400).send('Incorrect password or email');
});

/////////////////             LOGOUT  POST         /////////////////
//logout by closing users data and redirecting to index
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

/////////////////           REGISTER POST         /////////////////
//action when registering. Compares with user database to ensure no duplicates
app.post("/register", (req, res) => {
  const email = req.body.email;
  if (!email || !req.body.password) {
    return res.status(400).send('Missing information');
  }
  const userFound = findUserByEmail(email, users);
  if (userFound) {
    res.status(400).send('User already exists');
  }
  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(req.body.password, salt);
  const userId = createUser(email, password, users);
  req.session.user_id = userId;
  res.redirect('/urls');
});
