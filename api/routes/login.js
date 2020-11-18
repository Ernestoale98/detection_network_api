var express = require('express');
var router = express.Router();


module.exports = function (passport) {
    router.post('/', passport.authenticate('login'), function (req, res) {
        res.json(req.user);
    });
    return router;
}
