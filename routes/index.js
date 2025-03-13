const usersRouter = require('./users');
const router = require('express').Router();

router.use('/users', usersRouter);

module.exports = router;
