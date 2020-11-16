var express = require('express');
var router = express.Router();
//Mongo User Instance
var User = require('../models/user');
//Express Validator
const {body, validationResult} = require('express-validator');
//Node bcrypt
const bcrypt = require('bcrypt');


//User Signup
router.post('/', [
    body('phone').isLength({min: 10, max: 10})
        .custom(value => {
            return User.findOne({'phone': value}).then(user => {
                if (user) {
                    return Promise.reject('Phone already in use');
                }
            })
        }),
    body('password').isLength({min: 5})
        .custom((value, {req}) => {
            if (value !== req.body.passwordConfirmation) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    User.create({
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, 10)
    }).then(user => res.json(user))
        .catch(error => res.json(error));
});

module.exports = router;
