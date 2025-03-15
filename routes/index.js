const usersRouter = require('./users');
const clientsRouter = require('./clients');

const router = require('express').Router();

router.use('/user', usersRouter);
router.use('/client', clientsRouter);

module.exports = router;
