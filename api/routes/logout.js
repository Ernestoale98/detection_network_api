var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    req.logout();
    res.status(200).send('Logout Success');
});

module.exports = router;
