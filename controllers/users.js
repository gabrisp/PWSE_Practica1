const User = require('../models/userSchema')
const { matchedData } = require("express-validator");
const { encrypt, compare } = require('../utils/handlePassword');
const generateVerificationCode = require('../utils/handleRegister');
const { tokenSign } = require('../utils/handleJwt');
const { handleHttpError } = require('../utils/handleHttpError');
const { sendEmail } = require('../utils/nodeMail');


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
            verificationCode
        }
    const user = await User.create(data);
    const token = tokenSign(user);
    const mail = await sendEmail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Codigo de verificacion de registro",
        text: `El codigo de verificacion es: ${verificationCode}`,
    });
    console.log(mail);
    user.set('password', undefined, { strict: false });
    user.set('verificationCode', undefined, { strict: false });
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
        console.log("loginUser");
		req = matchedData(req)
        console.log(req);
		const user = await User.findOne({ email: req.email }).select("password name role email")
        if (!user) {
			handleHttpError(res, "USER_NOT_EXISTS", 404)
			return
		}

		const hashPassword = user.password;
		const check = await compare(req.password, hashPassword)
		console.log(check);
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

};

const updateUser = async (req, res) => {
    const user = req.user;
    const userUpdate = await User.findByIdAndUpdate(user._id, {...req.body}, {new: true});
    res.status(201).json(userUpdate);
};

const createCompany = async (req, res) => {
    const user = req.user;
    user.isAutonomo = false;
    user.company = req.body.company;
    await user.save();
    res.status(201).json(user);
};

const getUser = async (req, res) => {
    const user = req.user;
    const userData = await User.findById(user._id).select("-password -verificationCode -attempts").populate("logo").populate("guests", "-password -verificationCode -attempts -company -guests -logo -status -isAutonomo -address -createdAt -updatedAt");
    res.status(200).json(userData);
};

const deleteUser = async (req, res) => {
    const user = req.user;
    const { soft } = req.query;
    if (soft === 'false') {
        await User.findByIdAndDelete(user._id);
        res.status(200).json({ message: 'Usuario eliminado correctamente (hard delete)' });
    }
};


const recoverPassword = async (req, res) => {
    
    const code = generateVerificationCode();
    console.log(code);
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        handleHttpError(res, "USER_NOT_EXISTS", 404);
        return;
    }

    user.verificationCode = code;
    await user.save();

    await sendEmail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Recuperacion de contraseña",
        text: `El codigo de recuperacion es: ${code}`,
    });
    res.status(200).json({ message: 'Codigo de recuperacion enviado correctamente' });
};

const validateCode = async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        handleHttpError(res, "USER_NOT_EXISTS", 404);
        return;
    }
    if (user.verificationCode === req.body.code) {
        user.verificationCode = null;
        const token = tokenSign(user);
        user.set("password", undefined, { strict: false });
        user.set("verificationCode", undefined, { strict: false });
        res.status(200).json({ token, user });
    }
}

const updatePassword = async (req, res) => {
    const user = req.user;
    user.password = await encrypt(req.body.password);
    await user.save();
    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
}

const updateAddress = async (req, res) => {
    const user = req.user;
    user.address = req.user.address;
    if (user.isAutonomo){
        user.company = {
            ...user.address,
            name: user.name,
            nif: user.dni || "",
        }
    }
    await user.save();
    res.status(200).json({ message: 'Direccion actualizada correctamente' });
}

const createGuest = async (req, res) => {
    const user = req.user;
    const findGuest = await User.findOne({email: req.body.email});
    if (findGuest) {
        handleHttpError(res, "GUEST_ALREADY_EXISTS", 400);
        return;
    }
    const guest = await User.create({role: "user", ...req.body});
    const mail = await sendEmail({
        from: process.env.EMAIL_FROM,
        to: guest.email,
        subject: `${user.name} te ha invitado a que formes parte de su empresa`,
        text: `Hola ${guest.name}, ${user.name} te ha invitado a que formes parte de su empresa, para ello, puedes acceder a la siguiente url: ${process.env.FRONTEND_URL}/login`,
    });
    const token = tokenSign(guest);
    if (!user.guests) {
        user.guests = [];
    }
    user.guests = [...user.guests, guest._id];
    await user.save();
    res.status(201).json({token, guest});
}

const deleteGuest = async (req, res) => {
    const user = req.user;
    const guest = await User.findByIdAndDelete(req.body.guestId);
    user.guests = user.guests.filter(guest => guest._id.toString() !== req.body.guestId);
    await user.save();
    res.status(200).json({ message: 'Invitacion eliminada correctamente' });
}

module.exports = { createUser, verifyUser, loginUser, createCompany, updateUser, getUser, deleteUser, recoverPassword, validateCode, updatePassword, updateAddress, createGuest, deleteGuest };







