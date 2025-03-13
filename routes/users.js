const router = require('express').Router();


const validators = require('../validators/userValidator')
const controllers = require('../controllers/users')
const middleware  = require('../middleweare/users')
const authMiddleware = require('../middleweare/authMiddleweare')



router.post('/register', validators.validateCreateUser, middleware.registerMiddleware, controllers.createUser)
router.put('/verify', validators.validateVerifyUser, authMiddleware, middleware.verifyMiddleware, controllers.verifyUser)
router.post('/login', validators.validateLoginUser, controllers.loginUser)

module.exports = router