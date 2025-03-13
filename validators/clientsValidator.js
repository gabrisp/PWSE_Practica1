const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');


const createClientValidator = [
        check('name').exists().notEmpty(),
        check('cif').exists().notEmpty().isLength({ min: 9, max: 9 }),
        check('address').exists().notEmpty(),
        check('address.street').exists().notEmpty(),
        check('address.number').exists().notEmpty().isInt(),
        check('address.postal').exists().notEmpty().isInt(),
        check('address.city').exists().notEmpty(),
        check('address.province').exists().notEmpty(),
        (req, res, next) => {
           return validateResults(req, res, next);
        }
]

module.exports = { createClientValidator };