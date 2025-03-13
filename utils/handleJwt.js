const jwt = require("jsonwebtoken");


const JWT = process.env.JWT;

const tokenSign = (user) => {
    const sign = jwt.sign(
        {
            _id: user._id,
            role: user.role,
            email: user.email,
            name: user.name,
        },
        JWT,
        { expiresIn: "24h" }
    );
    return sign;
};

const verifyToken = (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, JWT);
    } catch (err) {
        console.log(err);
    }
};

module.exports = { tokenSign, verifyToken };