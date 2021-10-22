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
const { response } = require("express");

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

// SELECT DISTINCT topic FROM resources;


/*********** VIEW RESOURCE ************/
app.get("/resources/:resource_id", (req, res) => {
  res.render("addResource");
});

/*********** EDIT RESOURCE ************/
app.get("/resources/:resource_id/edit", (req, res) => {
  res.render("addResource");
});

/*********** ADD RESOURCE ************/
app.get("/addResource", (req, res) => {
  res.render("addResource");
});

/*********** ADD RESOURCE ************/
app.post("/addNewResource", (req, res) => {
  let query = `INSERT INTO resources (title, description, thumbnail_photo_url, cover_photo_url, topic)
  VALUES ('${req.body.title}', '${req.body.description}', '${req.body.thumbnail_photo_url}', '${req.body.cover_photo_url}', '${req.body.topic}') RETURNING id;`
    console.log(query);
    db.query(query)
      .then(data => {
        res.redirect("resourceList");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


/*********** RESOURCE LIST************/
//use template my resouces

app.get("/resourceList", (req, res) => {
  let query = `SELECT * FROM resources`;
  console.log(query);
  db.query(query)
    .then(data => {
      const resources = data.rows;
      const templateVars = {
        resources
      }
      res.render("resourceList", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

/************My Resources********/
app.get("/myResources", (req, res) => {
  let query = `SELECT * FROM resources WHERE user_id = 1`;
  console.log(query);
  db.query(query)
    .then(data => {
      const resources = data.rows;
      const templateVars = {
        resources
      }
      res.render("myResources", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

/*********** LOGIN ************/
app.get("/login", (req, res) => {
  const templateVars = {
    username: null
  };
  res.render('login', templateVars);
});

app.get("/login/:userId", (req, res) => {
  res.cookie("userId", req.params.userId)
  res.redirect("/")
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

/*********** PROFILE ************/
app.get("/myProfile", (req, res) => {
  let query = (`SELECT * FROM users`);
  console.log(query);
  db.query(query)
    .then(data => {
      const resources = data.rows;
      const templateVars = {
        resources
      }
      res.render("myProfile", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

/*********** PROFILE ************/
app.post("/myProfile", (req, res) => {
  res.render("myProfile");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
