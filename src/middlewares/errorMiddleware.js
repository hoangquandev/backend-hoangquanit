const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        statusCode,
        message,
    });
};

module.exports = sendError;
