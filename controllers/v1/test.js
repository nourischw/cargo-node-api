const { responseBuilder } = require('services/utils.js');

module.exports = (req, res) => {
    return responseBuilder.success(res, { status: "test success!!" });
}