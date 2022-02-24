var mongoose = require('mongoose');
var moment = require('moment');
var crypto = require('crypto');
var jsonwebtoken = require('jsonwebtoken');
const { timeFormat, jwt } = require('config');

var { Schema } = mongoose;

let userSchema = new Schema({
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
        type: String,
    },    
    email: {
      type: String,
      unique: true,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    salt: {
        type: String,
        required: true,
      },    
    active: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: String,
      default: moment.utc().format(timeFormat),
    },
    updatedAt: {
      type: String,
      default: moment.utc().format(timeFormat),
    },
});

userSchema.methods.setPassword = function (password) {
    this.salt = this.salt || crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.genAccessToken = function () {
    return jsonwebtoken.sign({
      data: {
        user: {
          userId: this.userId,
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email
        }
      }
    }, jwt.secret, { expiresIn: jwt.defaultExpire } )
}
  
module.exports = mongoose.model('user', userSchema);
  