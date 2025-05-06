const usersRouter = require('./users');
const clientsRouter = require('./clients');
const deliveryNoteRouter = require('./deliveryNote');
const projectsRouter = require('./projects');
const router = require('express').Router();

router.use('/user', usersRouter);
router.use('/client', clientsRouter);
router.use('/deliveryNote', deliveryNoteRouter);
router.use('/project', projectsRouter);

module.exports = router;
