const { check } = require('express-validator');
const { validateResults } = require('../utils/handleValidator');

const projectValidator = [
    // Datos básicos del proyecto
    check('name')
        .notEmpty()
        .withMessage('El nombre del proyecto es obligatorio'),
    check('projectCode')
        .notEmpty()
        .withMessage('El identificador del proyecto es obligatorio'),
    check('email')
        .notEmpty()
        .withMessage('El email es obligatorio')
        .isEmail()
        .withMessage('El formato del email no es válido'),
    check('code')
        .notEmpty()
        .withMessage('El código interno del proyecto es obligatorio'),
    check('clientId')
        .notEmpty()
        .withMessage('El ID del cliente es obligatorio')
        .isMongoId()
        .withMessage('El ID del cliente no es válido'),

    // Validaciones para el objeto address
    check('address.street')
        .notEmpty()
        .withMessage('La calle es obligatoria'),
    check('address.number')
        .notEmpty()
        .withMessage('El número es obligatorio')
        .isNumeric()
        .withMessage('El número debe ser un valor numérico'),
    check('address.postal')
        .notEmpty()
        .withMessage('El código postal es obligatorio')
        .isNumeric()
        .withMessage('El código postal debe ser un valor numérico')
        .isLength({ min: 5, max: 5 })
        .withMessage('El código postal debe tener 5 dígitos'),
    check('address.city')
        .notEmpty()
        .withMessage('La ciudad es obligatoria'),
    check('address.province')
        .notEmpty()
        .withMessage('La provincia es obligatoria'),

    (req, res, next) => {
        return validateResults(req, res, next);
    }
];




module.exports = { createProjectValidator, updateProjectValidator };
