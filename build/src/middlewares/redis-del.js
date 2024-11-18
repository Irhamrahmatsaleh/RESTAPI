"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delRedisThreads = void 0;
const redis_1 = require("../libs/redis");
async function delRedisThreads(req, res, next) {
    await redis_1.redisClient.del("THREADS_DATA");
    console.log("Redis Reset!");
    next();
}
exports.delRedisThreads = delRedisThreads;
//# sourceMappingURL=redis-del.js.map