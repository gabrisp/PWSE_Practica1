const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const generateVerificationCode = () => {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    return verificationCode;
}

module.exports = generateVerificationCode