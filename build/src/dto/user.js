"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProfileValidate = exports.registerValidate = exports.loginValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginValidate = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().min(8).alphanum().required(),
});
exports.registerValidate = joi_1.default.object({
    full_name: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    password: joi_1.default.string().min(8).alphanum().required(),
});
exports.editProfileValidate = joi_1.default.object({
    full_name: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    bio: joi_1.default.string(),
    photo_profile: joi_1.default.string().allow(null),
});
//# sourceMappingURL=user.js.map