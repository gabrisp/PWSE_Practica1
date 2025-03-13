
const User = require('../models/userSchema');

const checkUserExists = async (req, res, next) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    next(); 
};

module.exports = { checkUserExists }