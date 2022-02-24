const _l = require('lodash');
const Hashids = require('hashids');
const moment = require('moment');
const request = require('request');
const config = require('config.js');

const responseBuilder = {
    success: (res, data) => res.status(200).send({
        success: true,
        message: '',
        data,
    }),
    badRequest: (res, code, message) => res.status(400).send({
        success: false,
        code,
        message,
    }),
    serviceNotAvailable: (res, message) => res.status(503).send({
        success: false,
        message,
    }),
    error: (res, message) => {
        res.status(500).send({
        success: false,
        message,
        });
    },
    noContent: (res) => {
        res.status(204).send();
    },
};

const badRequestCodes = {
    usernameExists: 401,
    userEmailExists: 402,
    accessDenied: 403,
    userNotFound: 405,
    invalidPassword: 406,
    userNotActivated: 407,
    invalidRequestBodyOrQuery: 408,
    pageNotFound: 411,
    alreadyExist: 413,
    postNotFound:414
};  

const getUniqId = (collectionName) => {
    const hashids = new Hashids(collectionName);
    const timestamp = moment().unix();
    const randomInt = _l.random(1000);
    return hashids.encode(timestamp, randomInt);
};

module.exports = {
    responseBuilder,
    badRequestCodes,
    getUniqId
};
