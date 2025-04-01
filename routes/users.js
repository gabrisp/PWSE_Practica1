const router = require('express').Router();


const validators = require('../validators/userValidator')
const controllers = require('../controllers/users')
const middleware  = require('../middleweare/users')
const authMiddleware = require('../middleweare/authMiddleweare')
const { uploadMiddleware } = require('../utils/handleStorage')
const staticController = require('../controllers/static')
const { send } = require("../controllers/email");
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: user@example.com
 *             password:
 *               type: string
 *               example: yourpassword
 *             name:
 *               type: string
 *               example: John Doe
 * */
router.post('/register', validators.validateCreateUser, middleware.registerMiddleware, controllers.createUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 */
router.post('/login', validators.validateLoginUser, controllers.loginUser);

/**
 * @swagger
 * /user/verify:
 *   put:
 *     summary: Verify a user
 *     tags: [Users]
 */
router.put('/verify', authMiddleware, validators.validateVerifyUser, middleware.verifyMiddleware, controllers.verifyUser);

/**
 * @swagger
 * /user/register:
 *   put:
 *     summary: Register a new user
 *     tags: [Users]
 */
router.put('/register', authMiddleware, middleware.isActiveUser, validators.validateUpdateUser, middleware.finishRegisterMiddleware, controllers.updateUser);

/**
 * @swagger
 * /user/company:
 *   patch:
 *     summary: Create a new company
 *     tags: [Users]
 */
router.patch('/company', authMiddleware, middleware.isActiveUser, validators.companyUserValidator, controllers.createCompany);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get a user
 *     tags: [Users]
 */
router.get('/', authMiddleware, middleware.isActiveUser, controllers.getUser);

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 */
router.delete('/', authMiddleware,  controllers.deleteUser);


/**
 * @swagger
 * /user/logo:
 *   patch:
 *     summary: Upload a logo
 *     tags: [Users]
 */
router.patch("/logo", authMiddleware, middleware.isActiveUser, uploadMiddleware.single("image"), staticController.createStatic);

/**
 * @swagger
 * /user/recover:
 *   post:
 *     summary: Recover a password
 *     tags: [Users]
 */
router.post('/recover', validators.validateRecoverPassword, controllers.recoverPassword);



/**
 * @swagger
 * /user/validation:
 *   post:
 *     summary: Validate a code
 *     tags: [Users]
 */
router.post('/validation', validators.validateVerifyCode, controllers.validateCode);


/**
 * @swagger
 * /user/password:
 *   patch:
 *     summary: Update a password
 *     tags: [Users]
 */
router.patch('/password', authMiddleware, validators.validateNewPassword, controllers.updatePassword);

/**
 * @swagger
 * /user/address:
 *   patch:
 *     summary: Update a address
 *     tags: [Users]
 */
router.patch('/address', authMiddleware, middleware.isActiveUser, validators.addressValidator, controllers.updateAddress);


/**
 * @swagger
 * /user/guest:
 *   post:
 *     summary: Create a guest
 *     tags: [Users]
 */ 
router.post('/invite', authMiddleware, middleware.isActiveUser, validators.validateCreateGuest, controllers.createGuest);


/**
 * @swagger
 * /user/guest:
 *   delete:
 *     summary: Delete a guest
 *     tags: [Users]
 */
router.delete('/invite', authMiddleware, middleware.isActiveUser, controllers.deleteGuest);
module.exports = router
