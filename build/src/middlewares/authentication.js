"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    //Bearer Token Check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Unauthorized!",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.locals.verifyingUser = user;
        next();
    }
    catch (err) {
        return res.status(401).json({
            error: "Unauthorized!",
        });
    }
}
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=authentication.js.map