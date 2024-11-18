"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.threadValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.threadValidate = joi_1.default.object({
    image: joi_1.default.string().allow(null),
    content: joi_1.default.string().min(1).max(320).required()
});
//# sourceMappingURL=thread.js.map