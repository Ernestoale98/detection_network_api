var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = function (passport) {

    passport.use('login', new LocalStrategy({
            usernameField: "phone"
        },
        function (phone, password, done) {
            // check in mongo if a user with phone exists or not
            User.findOne({'phone': phone},
                function (err, user) {
                    // In case of any error
                    if (err != null) {
                        return done(err);
                    }
                    if (!user) {
                        console.log('User Not Found with phone ' + phone);
                        return done(null, false, {message: 'User Not Found with phone ' + phone});
                    }
                    if (!bcrypt.compareSync(password, user.password)) {
                        console.log('Invalid Password');
                        return done(null, false, {message: 'Invalid Password'});
                    }
                    return done(null, user);
                }
            );
        })
    );

}