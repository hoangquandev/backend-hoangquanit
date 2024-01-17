const jwt = require('jsonwebtoken');
const sendError = require('./errorMiddleware');

const authenticateToken = (requiredRoles) => (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 401, 'Unauthorized - No Bearer Token provided');
    }

    const token = authHeader.slice(7);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return sendError(res, 401, 'Forbidden - Invalid Bearer Token');
        }

        // Lưu thông tin người dùng vào request
        req.user = user;

        // Kiểm tra quyền hạn của người dùng
        if (!requiredRoles.includes(user.role)) {
            return sendError(res, 401, 'Forbidden - Insufficient permissions');
        }

        next();
    });
};
const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    console.log(refreshToken);

    if (!refreshToken) {
        return sendError(res, 400, 'Bad Request - Refresh Token is missing');
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return sendError(res, 403, 'Forbidden - Invalid Refresh Token');
        }

        req.user = user;
        next();
    });
};

module.exports = { authenticateToken, verifyRefreshToken };
