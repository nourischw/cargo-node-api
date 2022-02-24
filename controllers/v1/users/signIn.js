var Joi = require('joi');
var _l = require('lodash');
var crypto = require('crypto');
var async = require('async');
var config = require('config.js')

var Users = require('models/user.js');

const {
  responseBuilder,
  getUniqId,
  badRequestCodes
} = require('services/utils.js');

const signInObjSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});

module.exports = (req, res) => {
  const {
    error
  } = Joi.validate(req.body, signInObjSchema);

  if (!error) {
    let username = _l.get(req.body, 'username', '');
    let password = _l.get(req.body, 'password', '');

    async.parallel({
      user: (callback) => {
        let user = Users.findOne({
          username: username
        }).exec((err, user) => {
          callback(null, user);
        })
      }
    }, (err, results) => {
      let _user = _l.get(results, 'user', false);
      // check user exists
      if (_l.isNull(_user)) 
        return responseBuilder.badRequest(res, badRequestCodes.userNotFound, 'USER_NOT_FOUND')

      // verify password
      let selt = _l.get(_user, 'salt', '');
      let tmpPassword = crypto.pbkdf2Sync(password, selt, 1000, 64, 'sha512').toString('hex');
      if (!_l.isEqual(tmpPassword, _l.get(_user, 'password', ''))) 
        return responseBuilder.badRequest(res, badRequestCodes.invalidPassword, 'INVALID_PASSWORD');

      if (!_l.get(_user, 'active', false)) 
        return responseBuilder.badRequest(res, badRequestCodes.userNotActivated, 'USER_NOT_ACTIVATED');

      // return JWT when sign in success
      responseBuilder.success(res, {
        token: _user.genAccessToken()
      });
    })
  } else {
    return responseBuilder.badRequest(res, null, error.message);
  }
}
