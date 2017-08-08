var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
    idno: {
        type: String
    },
    name: {
        type: String
    },
    year: {
        type: String,
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    }
});

var User = module.exports = mongoose.model('user', UserSchema);
module.exports.user2 = mongoose.model('user', UserSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getAll = function () {
    return User.findOne({}, (err, result) => {
        if (err) throw err;
        return result;
    })
}