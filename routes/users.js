const router = require('express').Router();

const validators = require('../validators/userValidator')
const controllers = require('../controllers/users')
const usersMiddleware = require('../middleweare/users')

router.post('/register', validators.validateCreateUser, usersMiddleware.checkUserExists, controllers.createUser)
//router.post('/login', validators.validateLoginUser, controllers.loginUser)


module.exports = router