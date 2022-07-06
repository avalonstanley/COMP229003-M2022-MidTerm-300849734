let express = require('express');
let router = express.Router();
let usersController = require('../controllers/user');
let passport = require('passport');

// Routes for sign-up
router.get('/signup', usersController.renderSignup);//render
router.post('/signup', usersController.signup);//process

// Routes for sign-in
router.get('/signin', usersController.renderSignin);//render
router.post('/signin', usersController.signin);//process

// Route for sign-out
router.get('/signout', usersController.signout);//render

module.exports = router;
