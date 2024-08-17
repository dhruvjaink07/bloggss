const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const isAuthenticated = require('./../middleware/auth');


router.post('/register', userController.register);

router.post('/login',userController.login,userController.login);

router.get('/',isAuthenticated,userController.getProfile);

router.post('/forgotPassword', userController.forgotPassword);
module.exports = router;