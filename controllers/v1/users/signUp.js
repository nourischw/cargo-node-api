var _l = require('lodash');
var Joi = require('joi');
var async = require('async');

var Users = require('models/user.js');
const { responseBuilder, badRequestCodes, getUniqId } = require('services/utils.js');

// @Input Type Validate
const signUpObjSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  email: Joi.string().email(),
  firstname: Joi.string().max(30).required(),
  lastname: Joi.string().max(30).required(),
});

module.exports = (req, res) => {
  const { error } = Joi.validate(req.body, signUpObjSchema);

  if (!error) {
    const checkIfExists = (username, email, cb) => {
      Users.findOne({
        $or: [
          { username },
          { email },
        ],
      }, (_error, user) => {
        if (_error) return cb(_error);
        return cb(null, user);
      });
    };

    const createUser = (user, cb) => {
      if (user) return cb(null, false, user);

      // @Params DataSet
      let newUser = new Users({
        userId: getUniqId('user'),
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      });

      newUser.setPassword(req.body.password);

      newUser.save((_error, doc) => {
        if (_error) return cb(_error);
        return cb(null, true, doc);
      });
    };  

    async.waterfall([
      async.apply(checkIfExists, req.body.username, req.body.email),
      createUser,
    ], (_error, isNewUser, user) => {
      if (_error) return responseBuilder.error(res, _error.message);

      if (isNewUser) {
        return responseBuilder.success(res, {});
      } else if (user.username === req.body.username) {
        return responseBuilder.badRequest(res, badRequestCodes.usernameExists, 'username already exists.');
      } else if (user.email === req.body.email) {
        return responseBuilder.badRequest(res, badRequestCodes.userEmailExists, 'email already exists.');
      }

      return responseBuilder.serviceNotAvailable(res, 'can not sign up now.');
    });
  } else {
    // @req body not valid
    return responseBuilder.badRequest(res, badRequestCodes.invalidRequestBodyOrQuery, error.message);
  }
};

