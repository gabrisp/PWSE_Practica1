const { check } = require('express-validator');
const validateResults  = require('../utils/handleValidator');

const createDeliveryNoteValidator = [
    check('clientId')
        .notEmpty().withMessage('Client ID is required'),
    check('projectId')
        .notEmpty().withMessage('Project ID is required'),
    check('format')
        .notEmpty().withMessage('Format is required')
        .isIn(['material', 'hours']).withMessage('Format must be either "material" or "hours"'),
    check('material')
        .if(check('format').equals('material'))
        .notEmpty().withMessage('Material is required'),
    check('hours')
        .if(check('format').equals('hours'))
        .notEmpty().withMessage('Hours is required'),
    check('description')
        .notEmpty().withMessage('Description is required'),
    check('workdate')
        .notEmpty().withMessage('Workdate is required')
        .isDate({format: 'YYYY-MM-DD'}).withMessage('Workdate must be a valid date'),
    (req, res, next) => {
            return validateResults(req, res, next);
    }
];

module.exports = { createDeliveryNoteValidator };
