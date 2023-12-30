const router = require('express').Router();
const userController = require('../controllers/user.controllers');
const {isLoggedIn} = require('../middlewares/auth.middlewares');
const {uploadImage} = require('../middlewares/image.middlewares');

router.get("/welcome", isLoggedIn, userController.getWelcome);
router.get("/", userController.getDashboard);
router.post("/welcome", uploadImage.array('images'), userController.postMemory);
router.post("/welcome/update", userController.updateMemory);
router.get("/welcome/delete/:id", userController.deleteMemory);

module.exports = router;