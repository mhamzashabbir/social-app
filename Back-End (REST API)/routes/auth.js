const express = require('express');
const expValidator = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();



router.put('/signup', 
[
    expValidator.body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, {req}) => {
            return User.findOne({email : value})
            .then(userDoc => {
                if (userDoc){
                    return Promise.reject('Email address already exists.');
                }
            })
        })
        .normalizeEmail(),
    expValidator.body('password')
        .trim()
        .isLength({min: 5}),
    expValidator.body('name')
        .trim()
        .not()
        .isEmpty()
],
authController.signup); // PUT /auth/signup

router.post('/login', authController.login); // POST /auth/login

module.exports = router;