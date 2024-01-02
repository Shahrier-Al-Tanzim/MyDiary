const router = require('express').Router();
const userController = require('../controllers/user.controllers');
const {isLoggedIn} = require('../middlewares/auth.middlewares');
const {uploadImage, uploadAudioFiles} = require('../middlewares/image.middlewares');

router.get("/welcome", isLoggedIn, userController.getWelcome);
router.get("/", userController.getDashboard);
router.post("/welcome", uploadImage.array('filesFieldName'), userController.postMemory);
router.post("/welcome/update", uploadImage.array('images'), userController.updateMemory);
router.get("/welcome/delete/:id", userController.deleteMemory);
router.post("/welcome/post-audio", uploadAudioFiles.single('audio'), userController.postAudio);
module.exports = router;