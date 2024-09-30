"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const responseHandler_1 = require("../utils/responseHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Register controller
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, fullName, password } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return (0, responseHandler_1.sendErrorResponse)(res, 400, "User already exists");
        }
        const newUser = new user_1.default({ username, email, fullName, password });
        yield newUser.save();
        // Exclude password from the response
        const _a = newUser.toObject(), { password: _ } = _a, userResponse = __rest(_a, ["password"]);
        return res.status(201).send({ user: userResponse });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Internal server error");
    }
});
exports.register = register;
// Login controller
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_1.default.findOne({ username });
        if (!user) {
            return (0, responseHandler_1.sendErrorResponse)(res, 400, "Invalid email or password");
        }
        const isPasswordCorrect = yield user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return (0, responseHandler_1.sendErrorResponse)(res, 400, "Invalid email or password");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        const _a = user.toObject(), { password: _ } = _a, userResponse = __rest(_a, ["password"]);
        return res
            .status(200)
            .json({ accessToken, refreshToken, user: userResponse });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Internal server error");
    }
});
exports.login = login;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingRefreshToken = req.body.refreshToken;
    if (!incomingRefreshToken) {
        return (0, responseHandler_1.sendErrorResponse)(res, 400, "Refresh token is required");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        // Find the user by the decoded _id
        const user = yield user_1.default.findById(decoded._id);
        if (!user) {
            return (0, responseHandler_1.sendErrorResponse)(res, 401, "Invalid refresh token");
        }
        // Generate a new access token
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        return res.status(200).send({ refreshToken, accessToken });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return (0, responseHandler_1.sendErrorResponse)(res, 401, "Refresh token expired");
        }
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Internal server error");
    }
});
exports.refreshAccessToken = refreshAccessToken;
