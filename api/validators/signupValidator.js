const {body, validationResult} = require('express-validator');
//Mongo User Instance
var User = require('../../models/user');

const signupValidationRules = () => {
    return [
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
    ];
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    return next();
}

module.exports = {
    signupValidationRules,
    validate
}