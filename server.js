// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
/******* Helper Functions *******/
const { findUserByEmail } = require("./helperFunction");
const { generateRandomString } = require("./helperFunction");
const { authenticateUser } = require("./helperFunction");
const { createUser } = require("./helperFunction");
// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const likesRoutes = require("./routes/likes");
const ratesRoutes = require("./routes/rates");
const commentsRoutes = require("./routes/comments");
const resourcesRoutes = require("./routes/resources");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/likes", likesRoutes(db));
app.use("/api/rates", ratesRoutes(db));
app.use("/api/comments", commentsRoutes(db));
app.use("/api/resources", resourcesRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

const users = usersRoutes(db);

app.get("/", (req, res) => {
  res.render("index");
});

/*********** ADD RESOURCE ************/
app.get("/addResource", (req, res) => {
  res.render("/addResource");
});

/*********** RESOURCE LIST************/

app.get("/resourceList", (req, res) => {
  res.render("resourceList");
});

/*********** LOGIN ************/
app.get("/login", (req, res) => {
  const templateVars = {
    username: null
  };
  res.render('login', templateVars);
});

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
/*********** LOGOUT ************/
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("index");
});

/*********** REGISTER ************/
app.get("/register", (req, res) => {  const templateVars = {
  username: null
};
res.render("register", templateVars);
});

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
  res.redirect('index');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
