var express = require('express');
var router = express.Router();
//User service
var UserService = require('../services/UserService');
//Signup validation rules
const {signupValidationRules, validate} = require('../api/validators/signupValidator');


//User Signup
router.post('/',
    signupValidationRules(),
    validate,
    async (req, res, next) => {
        const user = await UserService.signup(req.body.phone, req.body.password);
        //Login user
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.json(user);
        });
    });


module.exports = router;
