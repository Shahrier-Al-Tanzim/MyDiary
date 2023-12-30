
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else
  res.status(401).send("<h1>You are not logged in</h1> <br> <a href='/'>Go to home</a>");
};

const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/dashboard");
};

module.exports = {
  isLoggedIn,
  isNotLoggedIn,
};
