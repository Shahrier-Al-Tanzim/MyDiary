const express = require('express');
const passport = require('./config/passort');
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // parse the body of HTTP request
// connecting to the database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });


const app = express();

// use bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret', // Add a secret string for session encryption
    resave: false,
    saveUninitialized: false,
    // Add any other necessary configurations
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.set("view engine", "ejs");
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
app.use(userRoutes);
app.use(authRoutes);



module.exports = app;