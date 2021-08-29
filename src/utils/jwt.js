const jwt = require('jsonwebtoken')

const ctrl = {};

ctrl.createToken = (payload, secret) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, (err, token) => {
            if (err) return reject(err);
            resolve(`Bearer ${token}`);
        });
    });
}

ctrl.verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token.split(' ')[1], secret, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    });
}

module.exports = ctrl;