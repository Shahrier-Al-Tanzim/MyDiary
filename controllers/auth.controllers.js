const passport = require("passport");

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

module.exports = {
  getScope,
  getCallback,
  getLogout,
  getFailure
};