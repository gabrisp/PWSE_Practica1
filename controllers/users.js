

const User = require('../models/userSchema')
const { matchedData } = require("express-validator");
const { encrypt, compare } = require('../utils/handlePassword');
const generateVerificationCode = require('../utils/handleRegister');
const { tokenSign } = require('../utils/handleJwt');
const { handleHttpError } = require('../utils/handleHttpError');

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
    const token = tokenSign(user);

    user.set('password', undefined, { strict: false });
    res.status(201).json({ token, user });

   } catch (error) {
        handleHttpError(res, 'Error al crear el usuario', 500)
   }
};

const verifyUser = async (req, res) => {
    const user = req.user;
    const verificationCode = req.body.code;

   if ( user.verificationCode === verificationCode) {
        user.status = 1;
        user.verificationCode = null;
        user.attempts = 0;
        await user.save();
        res.json({ message: 'Usuario verificado correctamente' }).status(200);
   } else {
        user.attempts = user.attempts - 1;
        await user.save();
        handleHttpError(res, 'Codigo de verificacion incorrecto', 401);
   }
};

const loginUser = async (req, res) => {
	try {
		req = matchedData(req)
		const user = await User.findOne({ email: req.email }).select("password name role email")
		
        if (!user) {
			handleHttpError(res, "USER_NOT_EXISTS", 404)
			return
		}

		const hashPassword = user.password;
		const check = await compare(req.password, hashPassword)
		
        if (!check) {
			handleHttpError(res, "INVALID_PASSWORD", 401)
			return
		}

		user.set("password", undefined, { strict: false })

		const data = {
			token: await tokenSign(user),
			user
		}

		res.send(data)

	} catch (err) {
		console.log(err)
		handleHttpError(res, "ERROR_LOGIN_USER")
	}
    
}
module.exports = { createUser, verifyUser, loginUser }