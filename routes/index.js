const usersRouter = require('./users');
const clientsRouter = require('./clients');

const router = require('express').Router();

router.use('/users', usersRouter);
router.use('/clients', clientsRouter);

module.exports = router;
