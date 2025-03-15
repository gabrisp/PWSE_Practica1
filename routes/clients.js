const router = require('express').Router();

const validators = require('../validators/clientsValidator');
const controllers = require('../controllers/clients');
const authMiddleware = require('../middleweare/authMiddleweare');

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management
 */
/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 * 
 */

router.post('/', validators.createClientValidator, authMiddleware, controllers.createClient);

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 */
router.get('/', authMiddleware, controllers.getClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get a client by Id
 *     tags: [Clients]
 */
router.get('/:id', authMiddleware, controllers.getClientById);


module.exports = router;