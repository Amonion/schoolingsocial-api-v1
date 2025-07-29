"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (res, statusCode, customMessage, error) => {
    console.error('🔥 Error occurred:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        errorObject: error,
    });
    if (statusCode && customMessage) {
        return res.status(statusCode).json({ message: customMessage });
    }
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        return res.status(400).json({
            message: `A user with the ${field} "${value}" already exists`,
        });
    }
    else if (error.errors) {
        const validationMessages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: validationMessages.join(', ') });
    }
    else {
        return res.status(500).json({
            message: error.message || 'Server error. Please try again later.',
        });
    }
};
exports.handleError = handleError;
