const { check } = require('express-validator')
const { validateResults } = require('../utils/handleValidator')


const validateCreateUser = [
    check("name").exists().notEmpty().isLength({ min: 3, max: 99 }),
    check("age").optional().isNumeric(),
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const validateLoginUser = [
    check('email').exists().isEmail().withMessage('El email no es valido'),
    check('password').exists().isString().isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

module.exports = { validateCreateUser, validateLoginUser }