"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/tmp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + node_path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
//# sourceMappingURL=image-thread.js.map