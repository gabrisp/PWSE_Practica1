const router = require('express').Router();
const controllers = require('../controllers/deliverynote');
const validators = require('../validators/deliveryNotesValidator');
const authMiddleware = require('../middleweare/authMiddleweare');
const usersMiddleware = require('../middleweare/users');

/**
 * @swagger
 * /deliveryNotes:
 *   post:
 *     summary: Crear una nueva nota de entrega
 *     tags: [Delivery Notes]   
 */
router.post('/', authMiddleware, usersMiddleware.isActiveUser, validators.createDeliveryNoteValidator, controllers.createDeliveryNote);

/**
 * @swagger
 * /deliveryNotes:
 *   get:
 *     summary: Obtener todas las notas de entrega
 *     tags: [Delivery Notes]   
 */
router.get('/', authMiddleware, usersMiddleware.isActiveUser, controllers.getDeliveryNotes);

/**
 * @swagger
 * /deliveryNotes/archived:
 *   get:
 *     summary: Obtener todas las notas de entrega archivadas
 *     tags: [Delivery Notes]   
 */ 
router.get('/archived', authMiddleware, usersMiddleware.isActiveUser, controllers.getArchivedDeliveryNotes);

/**
 * @swagger
 * /deliveryNotes/signed:
 *   get:
 *     summary: Obtener todas las notas de entrega firmadas
 *     tags: [Delivery Notes]   
 */
router.get('/signed', authMiddleware, usersMiddleware.isActiveUser, controllers.getSignedDeliveryNotes);

/**
 * @swagger
 * /deliveryNotes/unsigned:
 *   get:
 *     summary: Obtener todas las notas de entrega sin firmar
 *     tags: [Delivery Notes]       
 */
router.get('/unsigned', authMiddleware, usersMiddleware.isActiveUser, controllers.getUnsignedDeliveryNotes);


/**
 * @swagger
 * /deliveryNotes/{id}/pdf:
 *   get:
 *     summary: Obtener una nota de entrega por ID  
 *     tags: [Delivery Notes]       
 */
router.get('/pdf/:id', authMiddleware, usersMiddleware.isActiveUser, controllers.getDeliveryNotePDF);


/**
 * @swagger
 * /deliveryNotes/{id}:
 *   get:
 *     summary: Obtener una nota de entrega por ID
 *     tags: [Delivery Notes]   
 */
router.get('/:id', authMiddleware, usersMiddleware.isActiveUser, controllers.getDeliveryNote);

/**
 * @swagger
 * /deliveryNotes/{id}/sign:
 *   patch:
 *     summary: Firmar una nota de entrega por ID
 *     tags: [Delivery Notes]   
 */
router.patch('/:id/sign', authMiddleware, usersMiddleware.isActiveUser, controllers.signDeliveryNote);

/**
 * @swagger
 * /deliveryNotes/{id}:
 *   delete:
 *     summary: Eliminar una nota de entrega por ID
 *     tags: [Delivery Notes]       
 */
router.delete('/:id', authMiddleware, usersMiddleware.isActiveUser, controllers.deleteDeliveryNote);

/**
 * @swagger
 * /deliveryNotes/archive/{id}:
 *   delete:
 *     summary: Archivar una nota de entrega por ID
 *     tags: [Delivery Notes]   
 */
router.delete('/archive/:id', authMiddleware, usersMiddleware.isActiveUser, controllers.archiveDeliveryNote);

/**
 * @swagger
 * /deliveryNotes/restore/{id}:
 *   patch:
 *     summary: Restaurar una nota de entrega archivada por ID
 *     tags: [Delivery Notes]   
 */     
router.patch('/restore/:id', authMiddleware, usersMiddleware.isActiveUser, controllers.restoreDeliveryNote);

module.exports = router;