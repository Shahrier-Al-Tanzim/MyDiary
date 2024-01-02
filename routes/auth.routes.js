const router = require("express").Router();
const userAuthController = require('../controllers/auth.controllers');

router.get("/auth/google", userAuthController.getScope);
router.get("/logout", userAuthController.getLogout);
router.get("/google/callback", userAuthController.getCallback);
router.get("/google/failure", userAuthController.getFailure);

router.get("/login", userAuthController.getLogin);
router.post("/login", userAuthController.postLogin);
router.get("/register", userAuthController.getRegister);
router.post("/register", userAuthController.postRegister);

router.get('/forgotpassword', userAuthController.getForgotPass);
router.post('/forgotpassword', userAuthController.forgotpassword);
router.get('/passreset', userAuthController.getPassReset);
router.post('/passreset', userAuthController.passreset);

module.exports = router;
