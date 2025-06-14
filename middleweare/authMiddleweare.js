const { handleHttpError } = require("../utils/handleHttpError");
const { verifyToken } = require("../utils/handleJwt");
const UserModel = require("../models/userSchema");

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            handleHttpError(res, "NOT_TOKEN", 401);
            return;
        }

        const token = req.headers.authorization.split(' ').pop();
        console.log("token", token);
        const dataToken = await verifyToken(token);

        if (!dataToken._id) {
            handleHttpError(res, "ERROR_ID_TOKEN", 401);
            return;
        }

        const user = await UserModel.findById(dataToken._id);
        if( user && user.attempts === 0 && user.status === 0 ) {
            handleHttpError(res, "USER_LOCKED", 401 );
            return;
        }
        req.user = user;
        console.log("req.user", req.user);
        next();
        
    } catch (err) {
        handleHttpError(res, "NOT_SESSION", 401);
    }
};

module.exports = authMiddleware;