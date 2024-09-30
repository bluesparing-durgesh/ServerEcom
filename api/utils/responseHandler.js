"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = void 0;
const sendErrorResponse = (res, statusCode, msg) => {
    const errorResponse = {
        success: false,
        msg,
        statusCode,
    };
    return res.status(statusCode).send(errorResponse);
};
exports.sendErrorResponse = sendErrorResponse;
