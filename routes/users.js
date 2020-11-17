var express = require('express');
var router = express.Router();
var authMiddleware = require('../api/middlewares/authMiddleware');
//User service
var UserService = require('../services/UserService');

/* GET auth user. */
router.get('/',
    authMiddleware,
    async (req, res) => {
        const user = await UserService.findById(req.user.id);
        res.json(user);
    });

module.exports = router;
