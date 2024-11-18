"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({
    url: `${process.env.REDIS_URL}`,
})
    .on('error', err => console.log('Redis Client Error', err));
//# sourceMappingURL=redis.js.map