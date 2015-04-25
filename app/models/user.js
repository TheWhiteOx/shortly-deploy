var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var Mongoose = require('mongoose');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Mongoose.schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  links: Array,
  salt: String,
  createdOn: { type: Date, default: Date.now }
});

UserSchema.methods.hasPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      this.set('password', hash);
    });
}

UserSchema.methods.comparePassword =  function(attemptedPassword, callback) {
  var savedPassword = this.password;
  bcrypt.compare(attemptedPassword, savedPassword, function(err, isMatch) {
    callback(isMatch);
  });
}

UserSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

var UserModel = mongoose.model('UserModel', UserSchema);



// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

module.exports = User;
