"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const follow_1 = __importDefault(require("./src/controllers/follow"));
const thread_1 = __importDefault(require("./src/controllers/thread"));
const user_1 = __importDefault(require("./src/controllers/user"));
const redis_1 = require("./src/libs/redis");
const authentication_1 = require("./src/middlewares/authentication");
const image_thread_1 = require("./src/middlewares/image-thread");
const swagger_generated_json_1 = __importDefault(require("./src/swagger-generated.json"));
const port = process.env.PORT || 5000;
exports.app = (0, express_1.default)();
const router = express_1.default.Router();
async function connectRedis() {
    await redis_1.redisClient.connect();
}
connectRedis();
const swaggerOption = {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true
    }
};
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => redis_1.redisClient.sendCommand(args),
    }),
});
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use(express_1.default.json());
// app.use(Cors())
exports.app.use((0, cors_1.default)({
    origin: ['https://carnaval-5z7e.vercel.app', 'http://localhost:5173'], // Ganti dengan domain frontend Anda
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
}));
exports.app.use("/api/v1", router);
router.use(limiter);
router.use('/api-docs', swagger_ui_express_1.default.serve);
router.get('/api-docs', swagger_ui_express_1.default.setup(swagger_generated_json_1.default, swaggerOption));
//v1
router.get("/", (req, res) => {
    redis_1.redisClient.set("HELLO", "WORLD");
    res.send("Welcome to API V1");
});
router.post("/register", image_thread_1.upload.none(), user_1.default.registerUser);
router.post("/login", image_thread_1.upload.none(), user_1.default.loginUser);
router.get("/check", authentication_1.authenticateToken, image_thread_1.upload.none(), user_1.default.check);
router.get("/user", authentication_1.authenticateToken, image_thread_1.upload.none(), user_1.default.findUser);
router.get("/user:id", authentication_1.authenticateToken, image_thread_1.upload.none(), user_1.default.findUserID);
router.get("/verify-email/:token", user_1.default.verifyEmail);
router.post("/request-password", image_thread_1.upload.none(), user_1.default.requestPassword);
router.post("/reset-password/:token", image_thread_1.upload.none(), user_1.default.resetPassword);
router.patch("/user", authentication_1.authenticateToken, image_thread_1.upload.single('photo_profile'), user_1.default.updateUser);
router.delete("/user:id", authentication_1.authenticateToken, user_1.default.deleteUser);
router.get("/thread", authentication_1.authenticateToken, 
// async (req: Request, res: Response, next: NextFunction) => {
//     const result = await redisClient.get("ALL_THREADS_DATA");
//     if (result) return res.json(JSON.parse(result));
//     next();
// },
image_thread_1.upload.none(), thread_1.default.findAllThread);
router.get("/threadProfile", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.findUserThread);
router.get("/otherThread:id", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.findOtherUserThread);
router.get("/thread:id", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.findIDThread);
router.post("/threadPost", authentication_1.authenticateToken, image_thread_1.upload.single('image'), thread_1.default.postThread);
router.patch("/thread:id", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.updateThread);
router.delete("/thread:id", authentication_1.authenticateToken, thread_1.default.deleteThread);
router.get("/image", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.findImage);
router.get("/like:id", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.setLikedID);
router.get("/unlike:id", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.setUnlikedID);
router.get("/lreplies:id", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.setLikedReplies);
router.get("/ulreplies:id", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.setUnlikedReplies);
router.get("/replies:id", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.findRepliesID);
router.get("/singlereplies:id", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.findSingleRepliesID);
router.get("/childrenreplies:id", authentication_1.authenticateToken, image_thread_1.upload.none(), thread_1.default.findChildrenRepliesID);
router.post("/replies:id", authentication_1.authenticateToken, image_thread_1.upload.single('image'), thread_1.default.postReplies);
router.post("/childrenreplies:id", authentication_1.authenticateToken, image_thread_1.upload.single('image'), thread_1.default.postRepliesChildren);
router.delete("/replies:id", authentication_1.authenticateToken, thread_1.default.deleteReply);
router.get("/search", authentication_1.authenticateToken, image_thread_1.upload.none(), follow_1.default.fetchSearchedUser);
router.get("/following", authentication_1.authenticateToken, image_thread_1.upload.none(), follow_1.default.fetchFollowing);
router.get("/follower", authentication_1.authenticateToken, image_thread_1.upload.none(), follow_1.default.fetchFollower);
router.get("/suggested", authentication_1.authenticateToken, image_thread_1.upload.none(), follow_1.default.fetchRandomUserSuggestion);
router.get("/follow:id", authentication_1.authenticateToken, image_thread_1.upload.none(), follow_1.default.setFollowID);
router.get("/unfollow:id", authentication_1.authenticateToken, image_thread_1.upload.none(), follow_1.default.setUnfollowID);
exports.app.listen(port, () => {
    console.log(`Port ${port} is listening`);
});
//# sourceMappingURL=index.js.map