const passport = require("passport");
const bcrypt = require("bcrypt");
const getScope = passport.authenticate("google", {
  scope: ["email", "profile"]}
);

const getCallback = passport.authenticate("google", {
  successRedirect: "/welcome",
  failureRedirect: "/auth/google/failure",
  successFlash: true,
  failureFlash: true
});

const getLogout = (req, res) => {
  req.logout(err => console.error(err));
  res.redirect("/");
};

const getFailure = (req, res) => {
  res.send("USER NOT FOUND!!! Go to dashboard and try again <a href=\"/\">frontPage</a>");
};

const getLogin = (req, res) => {
  res.render("login");
};

const initialize = require("../config/local.passport");
initialize(passport);
 
const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

const getRegister = (req, res) => {
  res.render("register");
};

const User = require("../models/user.model");

const postRegister = async (req, res, next) => {
  const {  email, password } = req.body;
  const name= req.body.username

    console.log(name)
    console.log(email)
    console.log(password)

  const errors=[]
  if (!name || !email || !password ) {
    errors.push("All fields are required!");
  }

  if (errors.length > 0) {
    res.status(400).json({ error: errors });
  } else {
    //Create New User
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push("User already exists with this email!");
        res.status(400).json({ error: errors });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            errors.push(err);
            res.status(400).json({ error: errors });
          } else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                errors.push(err);
                res.status(400).json({ error: errors });
              } else {
                const newUser = new User({
                  name,
                  email,
                  password: hash,
                });
                newUser
                  .save()
                  .then(() => {
                    res.redirect("/login");
                  })
                  .catch(() => {
                    errors.push("Please try again");
                    res.status(400).json({ error: errors });
                  });
              }
            });
          }
        });
      }
    });
  }
};
module.exports = {
  getScope,
  getCallback,
  getLogout,
  getFailure,
  getLogin,
  postLogin,
  getRegister,
  postRegister
};