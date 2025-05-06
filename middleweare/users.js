const User = require('../models/userSchema');
const { handleHttpError } = require('../utils/handleHttpError');

const registerMiddleware = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
                return handleHttpError(res, 'Email ya esta en uso', 403);
        }
        // If no existing user, proceed to the next middleware
        next();
    } catch (error) {
        return handleHttpError(res, 'ERROR_SERVER', 500);
    }
};

const finishRegisterMiddleware = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        // Comprobar si el usuario existente es diferente del usuario logueado
        if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
            return handleHttpError(res, 'No se puede cambiar el email, ya que pertenece a otro usuario', 403);
        }
        // Si no hay usuario existente o es el mismo, proceder
        next();
    } catch (error) {
        return handleHttpError(res, 'ERROR_SERVER', 500);
    }
}

const verifyMiddleware = async (req, res, next) => {

    const existingUser = await User.findOne({ email: req.user.email }); // Usar matched.email

    if (!existingUser) {
        return handleHttpError(res, 'Usuario no encontrado', 404); // Retornar aquí para evitar llamar a next()
    }

    if (existingUser &&  existingUser.status === 1) {
        return handleHttpError(res, 'Usuario ya verificado', 401); // Retornar aquí para evitar llamar a next()
    }

    if (existingUser.attempts === 0 && existingUser.status === 0) {
        return handleHttpError(res, 'Usuario bloqueado', 401); // Retornar aquí para evitar llamar a next()
    }

    req.user = existingUser; // Agregar el usuario al objeto req
    next(); // Solo se llama a next() si no hay errores

};

const isActiveUser = async (req, res, next) => {
    console.log("req.user IS ACTIVE USER", req.user);
	if (req.user.status === 0) {
        return handleHttpError(res, 'Usuario no verificado', 401); // Retornar aquí para evitar llamar a next()
	}else {
		next()
	}
}

module.exports = { registerMiddleware, verifyMiddleware, finishRegisterMiddleware, isActiveUser }