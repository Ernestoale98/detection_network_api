//Mongo User Instance
var User = require('../models/user');
//Node bcrypt
const bcrypt = require('bcrypt');
//LocalStrategy of passport
var LocalStrategy = require('passport-local').Strategy;

class UserService {

    static async signup(phone, password) {
        return await User.create({
            phone: phone,
            password: bcrypt.hashSync(password, 10)
        });

    }

    static async findById(id) {
        return await User.findById(id);
    }

}

module.exports = UserService;