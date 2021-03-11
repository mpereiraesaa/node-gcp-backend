const express = require('express');

const ConfigurationsController = require('./controllers/ConfigurationsController');
const UsersController = require('./controllers/UsersController');
const { adminAccess, userAccess, fileUpload, multer } = require('./middlewares');

const router = express.Router();

router.post('/signup', multer.single('image'), fileUpload, UsersController.register);
router.post('/signin', UsersController.login);
router.get('/profile/:userId(\\d+)', userAccess, UsersController.getUserProfile);
router.get('/profiles', adminAccess, UsersController.getAllUsers);
router.put('/configurations/:configurationId(\\d+)', adminAccess, ConfigurationsController.update);
router.get('/configurations', ConfigurationsController.getAll);

module.exports = router;
