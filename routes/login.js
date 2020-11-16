var express = require('express');
var router = express.Router();


module.exports = function (passport) {
    router.post('/', passport.authenticate('login', {
        failureRedirect: '/error',
        failureFlash: true
    }), function (req, res) {
        res.json({user: req.user});
    });

    return router;
}