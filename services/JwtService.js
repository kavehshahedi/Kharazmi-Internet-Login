const jwt = require('jsonwebtoken');

const Variables = require('../utils/Variables');

module.exports.signToken = function (data) {
    return jwt.sign(data, Variables.jwtSecretKey);
}

module.exports.verifyToken = async function (token) {
    return new Promise(resolve => {
        jwt.verify(token, Variables.jwtSecretKey, (err, result) => {
            if (err) resolve(false);
            else resolve(true);
        });
    });
}