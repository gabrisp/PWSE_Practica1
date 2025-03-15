const router = require('express').Router();


const validators = require('../validators/userValidator')
const controllers = require('../controllers/users')
const middleware  = require('../middleweare/users')
const authMiddleware = require('../middleweare/authMiddleweare')
const { uploadMiddleware } = require('../utils/handleStorage')
const staticController = require('../controllers/static')

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 */
router.post('/register', validators.validateCreateUser, middleware.registerMiddleware, controllers.createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 */
router.post('/login', validators.validateLoginUser, controllers.loginUser);

/**
 * @swagger
 * /users/verify:
 *   put:
 *     summary: Verify a user
 *     tags: [Users]
 */
router.put('/verify', authMiddleware, validators.validateVerifyUser, middleware.verifyMiddleware, controllers.verifyUser);

/**
 * @swagger
 * /users/register:
 *   put:
 *     summary: Register a new user
 *     tags: [Users]
 */
router.put('/register', authMiddleware, validators.validateUpdateUser, middleware.finishRegisterMiddleware, controllers.updateUser);

/**
 * @swagger
 * /users/company:
 *   patch:
 *     summary: Create a new company
 *     tags: [Users]
 */
router.patch('/company', authMiddleware, validators.companyUserValidator, controllers.createCompany);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a user
 *     tags: [Users]
 */
router.get('/', authMiddleware, controllers.getUser);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 */
router.delete('/', authMiddleware, controllers.deleteUser);


/**
 * @swagger
 * /users/logo:
 *   patch:
 *     summary: Upload a logo
 *     tags: [Users]
 */
router.patch("/logo", authMiddleware, uploadMiddleware.single("image"), staticController.createStatic);

module.exports = router