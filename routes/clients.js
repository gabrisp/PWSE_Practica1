const router = require('express').Router();

const validators = require('../validators/clientsValidator');
const controllers = require('../controllers/clients');
const authMiddleware = require('../middleweare/authMiddleweare');


router.post('/', validators.createClientValidator, authMiddleware, controllers.createClient);
router.get('/', authMiddleware, controllers.getClients);
router.get('/:id', authMiddleware, controllers.getClientById);


module.exports = router;