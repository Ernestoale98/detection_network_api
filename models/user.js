var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    phone: String,
    password: String,
});