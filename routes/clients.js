const router = require('express').Router();

const validators = require('../validators/clientsValidator');
const controllers = require('../controllers/clients');
const authMiddleware = require('../middleweare/authMiddleweare');
const usersMiddleware = require('../../middleweare/users');
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

router.post('/', validators.createClientValidator, authMiddleware, usersMiddleware.isActiveUser, controllers.createClient);

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 */
router.get('/', authMiddleware, usersMiddleware.isActiveUser, controllers.getClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get a client by Id
 *     tags: [Clients]
 */
router.get('/:id', authMiddleware, usersMiddleware.isActiveUser, controllers.getClientById);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client by Id
 *     tags: [Clients]
 */
router.delete('/:id', authMiddleware, usersMiddleware.isActiveUser, controllers.deleteClient);

/**
 * @swagger
 * /clients/archived:
 *   get:
 *     summary: Get all archived clients
 *     tags: [Clients]
 */
router.get('/archived', authMiddleware, usersMiddleware.isActiveUser, controllers.getArchivedClients);
module.exports = router;