
const User = require('../models/userSchema');
const { handleHttpError } = require('../utils/handleHttpError');

const registerMiddleware = async (req, res, next) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        handleHttpError(res, 'Usuario ya existe', 403);
    }
    next(); 
};

const verifyMiddleware = async (req, res, next) => {

    const existingUser = await User.findOne({ email: req.user.email }); // Usar matched.email

    if (!existingUser) {
        return handleHttpError(res, 'Usuario no encontrado', 404); // Retornar aquí para evitar llamar a next()
    }

    if (existingUser &&  existingUser.status === 1) {
        return handleHttpError(res, 'Usuario ya verificado', 401); // Retornar aquí para evitar llamar a next()
    }

    if (existingUser.attempts === 0) {
        return handleHttpError(res, 'Usuario bloqueado', 401); // Retornar aquí para evitar llamar a next()
    }

    req.user = existingUser; // Agregar el usuario al objeto req
    next(); // Solo se llama a next() si no hay errores

}

module.exports = { registerMiddleware, verifyMiddleware }