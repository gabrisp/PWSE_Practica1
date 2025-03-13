
const User = require('../models/userSchema')
const { matchedData } = require("express-validator");
const { encrypt } = require('../utils/handlePassword');
const generateVerificationCode = require('../utils/handleRegister');

const createUser = async (req, res) => {
    req = matchedData(req);
   try {
    const password = await encrypt(req.password);
    const role = req.role || "user";
    const verificationCode = generateVerificationCode();
    const data = {
        ...req,
        password,
        role,
        verificationCode,
    }
    const user = await User.create(data);
    user.set('password', undefined, { strict: false });
    res.status(201).json(user);
   } catch (error) {
        handleHttpError(res, 'Error al crear el usuario', 500)
   }
};

module.exports = { createUser }