const { check } = require('express-validator')
const validateResults  = require('../utils/handleValidator')


const validateCreateUser = [
    check("name").exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('El nombre debe tener entre 3 y 99 caracteres'),
    check("email").exists().notEmpty().isEmail().withMessage('El email no es valido'),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }).withMessage('La contraseña debe tener entre 8 y 16 caracteres'),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const validateVerifyUser = [
    check('code').exists().notEmpty().isNumeric().isLength({ min: 6, max: 6 }),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const validateLoginUser = [
    check('email').exists().isEmail().withMessage('El email no es valido'),
    check('password').exists().notEmpty().isLength({ min: 8, max: 16 }).withMessage('La contraseña debe tener entre 8 y 16 caracteres'),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const validateUpdateUser = [
    check('name').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('El nombre debe tener entre 3 y 99 caracteres'),
    check('nif').exists().isLength({ min: 9, max: 9 }).withMessage('El NIF debe tener 9 caracteres'),
    check('email').exists().isEmail().withMessage('El email no es valido'),
    check('surnames').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('Los apellidos deben tener entre 3 y 99 caracteres'),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const validateRecoverPassword = [
    check('email').exists().isEmail().withMessage('El email no es valido'),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const validateVerifyCode = [
    check('code').exists().notEmpty().isNumeric().isLength({ min: 6, max: 6 }),
    check('email').exists().isEmail().withMessage('El email no es valido'),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const companyUserValidator = [
    check('company').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La direccion debe tener entre 3 y 99 caracteres'),
    check('company.name').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('El nombre debe tener entre 3 y 99 caracteres'),
    check('company.cif').exists().notEmpty().isLength({ min: 9, max: 9 }).withMessage('El CIF debe tener 9 caracteres'),
    check('company.street').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La calle debe tener entre 3 y 99 caracteres'),
    check('company.number').exists().notEmpty().isNumeric().withMessage('El numero debe ser un numero'),
    check('company.postal').exists().notEmpty().isNumeric().withMessage('El codigo postal debe ser un numero'),
    check('company.city').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La ciudad debe tener entre 3 y 99 caracteres'),
    check('company.province').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La provincia debe tener entre 3 y 99 caracteres'),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]


const validateNewPassword = [   
    check('password').exists().notEmpty().isLength({ min: 8, max: 16 }).withMessage('La contraseña debe tener entre 8 y 16 caracteres'),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const addressValidator = [
    check('address').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La direccion debe tener entre 3 y 99 caracteres'),
    check('address.street').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La calle debe tener entre 3 y 99 caracteres'),
    check('address.number').exists().notEmpty().isNumeric().withMessage('El numero debe ser un numero'),
    check('address.postal').exists().notEmpty().isNumeric().withMessage('El codigo postal debe ser un numero'),
    check('address.city').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La ciudad debe tener entre 3 y 99 caracteres'),
    check('address.province').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La provincia debe tener entre 3 y 99 caracteres'),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]


const validateCreateGuest = [
    check('name').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('El nombre debe tener entre 3 y 99 caracteres'),
    check('surnames').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('Los apellidos deben tener entre 3 y 99 caracteres'),
    check('email').exists().isEmail().withMessage('El email no es valido'),
    check('company').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La direccion debe tener entre 3 y 99 caracteres'),
    check('company.name').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('El nombre debe tener entre 3 y 99 caracteres'),
    check('company.cif').exists().notEmpty().isLength({ min: 9, max: 9 }).withMessage('El CIF debe tener 9 caracteres'),
    check('company.street').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La calle debe tener entre 3 y 99 caracteres'),
    check('company.number').exists().notEmpty().isNumeric().withMessage('El numero debe ser un numero'),
    check('company.postal').exists().notEmpty().isNumeric().withMessage('El codigo postal debe ser un numero'),
    check('company.city').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La ciudad debe tener entre 3 y 99 caracteres'),
    check('company.province').exists().notEmpty().isLength({ min: 3, max: 99 }).withMessage('La provincia debe tener entre 3 y 99 caracteres'),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]
module.exports = { validateCreateUser, validateVerifyUser, validateLoginUser, companyUserValidator, validateUpdateUser, validateRecoverPassword, validateVerifyCode, validateNewPassword, addressValidator, validateCreateGuest }
