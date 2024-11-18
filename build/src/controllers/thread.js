"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const thread_1 = __importDefault(require("../services/thread"));
const redis_1 = require("../libs/redis");
class threadController {
    async findUserThread(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const userThreadData = await thread_1.default.FindThread(user.id);
            if (!userThreadData)
                throw new Error("Thread not found");
            res.send(userThreadData);
        }
        catch (err) {
            res.status(404).json({ error: 'Thread not found' });
            ;
        }
    }
    async findIDThread(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const threadData = await thread_1.default.FindThreadID(parseInt(req.params.id), user.id);
            if (!threadData)
                throw new Error("Thread not found");
            res.send(threadData);
        }
        catch (err) {
            res.status(404).json({ error: 'Thread not found' });
            ;
        }
    }
    async findOtherUserThread(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const threadData = await thread_1.default.FindOtherThread(parseInt(req.params.id), user.id);
            if (!threadData)
                throw new Error("Thread not found");
            res.send(threadData);
        }
        catch (err) {
            res.status(404).json({ error: 'Thread not found' });
            ;
        }
    }
    async findAllThread(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const threadsData = await thread_1.default.FindAllThread(user.id);
            if (!threadsData)
                throw new Error("Thread not found");
            await redis_1.redisClient.set("ALL_THREADS_DATA", JSON.stringify(threadsData));
            res.send(threadsData);
        }
        catch (err) {
            res.status(404).json({ error: 'Thread not found' });
            ;
        }
    }
    async findImage(req, res) {
        try {
            const userData = await thread_1.default.FindAllImage();
            if (!userData)
                throw new Error("Image not found");
            res.send(userData);
        }
        catch (err) {
            res.status(404).json({ error: 'Image not found' });
            ;
        }
    }
    async findRepliesID(req, res) {
        try {
            const userLocals = res.locals.verifyingUser;
            const userData = await thread_1.default.FindRepliesID(parseInt(req.params.id), userLocals.id);
            if (!userData)
                throw new Error("Thread not found");
            res.send(userData);
        }
        catch (err) {
            res.status(404).json({ error: 'Thread not found' });
            ;
        }
    }
    async findSingleRepliesID(req, res) {
        try {
            const userLocals = res.locals.verifyingUser;
            const userData = await thread_1.default.FindSingleRepliesID(parseInt(req.params.id), userLocals.id);
            if (!userData)
                throw new Error("Thread not found");
            res.send(userData);
        }
        catch (err) {
            res.status(404).json({ error: 'Thread not found' });
            ;
        }
    }
    async findChildrenRepliesID(req, res) {
        try {
            const userLocals = res.locals.verifyingUser;
            const userData = await thread_1.default.FindChildrenRepliesID(parseInt(req.params.id), userLocals.id);
            if (!userData)
                throw new Error("Thread not found");
            res.send(userData);
        }
        catch (err) {
            res.status(404).json({ error: 'Thread not found' });
            ;
        }
    }
    async postReplies(req, res) {
        /*  #swagger.parameters['repliesid'] = {
            description: 'id for repliedThread (int)'
        } */
        /*  #swagger.requestBody = {
               required: true,
               content: {
                   "multipart/form-data": {
                       schema: {
                           $ref: "#/components/schemas/threadSchema"
                       }
                   }
               }
           }
       */
        /*
         #swagger.consumes = ['multipart/form-data']
         #swagger.parameters['singleFile'] = {
             in: 'formData',
             type: 'file',
             required: 'true',
             description: 'Some description...',
         } */
        try {
            const body = {
                ...req.body,
                image: (req.file ? req.file.path : null),
            };
            const user = res.locals.verifyingUser;
            const dataCreated = await thread_1.default.PostReplies(body, user, parseInt(req.params.id));
            res.status(201).json({
                stats: "replies created",
                value: dataCreated
            });
        }
        catch (err) {
            res.status(400).json({
                message: 'replies has not been saved',
                err: err
            });
        }
    }
    async postRepliesChildren(req, res) {
        /*  #swagger.parameters['repliesid'] = {
            description: 'id for repliedParent (int)'
        } */
        /*  #swagger.requestBody = {
               required: true,
               content: {
                   "multipart/form-data": {
                       schema: {
                           $ref: "#/components/schemas/threadSchema"
                       }
                   }
               }
           }
       */
        /*
         #swagger.consumes = ['multipart/form-data']
         #swagger.parameters['singleFile'] = {
             in: 'formData',
             type: 'file',
             required: 'true',
             description: 'Some description...',
         } */
        try {
            const body = {
                ...req.body,
                image: (req.file ? req.file.path : null),
            };
            const user = res.locals.verifyingUser;
            const dataCreated = await thread_1.default.PostRepliesChildren(body, user, parseInt(req.params.id));
            res.status(201).json({
                stats: "replies created",
                value: dataCreated
            });
        }
        catch (err) {
            res.status(400).json({
                message: 'replies has not been saved',
                err: err.message
            });
        }
    }
    async postThread(req, res) {
        /*  #swagger.requestBody = {
               required: true,
               content: {
                   "multipart/form-data": {
                       schema: {
                           $ref: "#/components/schemas/threadSchema"
                       }
                   }
               }
           }
       */
        /*
         #swagger.consumes = ['multipart/form-data']
         #swagger.parameters['singleFile'] = {
             in: 'formData',
             type: 'file',
             required: 'true',
             description: 'Some description...',
         } */
        try {
            const body = {
                ...req.body,
                image: (req.file ? req.file.path : null),
            };
            const user = res.locals.verifyingUser;
            const dataCreated = await thread_1.default.PostThread(body, user);
            redis_1.redisClient.del("ALL_THREADS_DATA");
            res.status(201).json({
                stats: "data created",
                value: dataCreated
            });
        }
        catch (err) {
            res.status(400).json({
                message: 'data has not been saved',
                err: err
            });
        }
    }
    async updateThread(req, res) {
        /*  #swagger.parameters['threadid'] = {
            description: 'id for thread (int)'
        } */
        /*  #swagger.requestBody = {
               required: true,
               content: {
                   "multipart/form-data": {
                       schema: {
                           $ref: "#/components/schemas/threadSchema"
                       }
                   }
               }
           }
       */
        try {
            const dataUpdated = await thread_1.default.UpdateThread(parseInt(req.params.id), req.body);
            redis_1.redisClient.del("ALL_THREADS_DATA");
            res.status(201).json({
                stats: "data updated",
                value: dataUpdated
            });
        }
        catch (err) {
            res.status(400).json({ error: 'Create User error' });
        }
    }
    async deleteThread(req, res) {
        /*  #swagger.parameters['threadid'] = {
            description: 'id for thread (int)'
        } */
        try {
            const userData = await thread_1.default.DeleteThread(parseInt(req.params.id));
            redis_1.redisClient.del("ALL_THREADS_DATA");
            res.status(201).json({
                stats: "data deleted",
                content: userData.content
            }).send;
        }
        catch (err) {
            res.sendStatus(400);
        }
    }
    async deleteReply(req, res) {
        /*  #swagger.parameters['replyid'] = {
            description: 'id for reply (int)'
        } */
        try {
            const userData = await thread_1.default.DeleteReply(parseInt(req.params.id));
            redis_1.redisClient.del("ALL_THREADS_DATA");
            res.status(201).json({
                stats: "data deleted",
                content: userData.content
            }).send;
        }
        catch (err) {
            res.sendStatus(400);
        }
    }
    async setLikedID(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const likedData = await thread_1.default.setLiked(parseInt(req.params.id), user.id);
            if (!likedData)
                throw new Error("Like Error");
            res.json({
                thread_id: parseInt(req.params.id),
                stats: "thread liked"
            });
        }
        catch (err) {
            res.status(404).json({ error: 'Like Error', err: err });
            ;
        }
    }
    async setUnlikedID(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const likedData = await thread_1.default.setUnliked(parseInt(req.params.id), user.id);
            if (!likedData)
                throw new Error("unlike Error");
            res.json({
                thread_id: parseInt(req.params.id),
                stats: "thread unliked"
            });
        }
        catch (err) {
            res.status(404).json({ error: 'unlike Error', err: err });
            ;
        }
    }
    async setLikedReplies(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const likedData = await thread_1.default.setLikedReplies(parseInt(req.params.id), user.id);
            if (!likedData)
                throw new Error("Like Replies Error");
            res.json({
                thread_id: parseInt(req.params.id),
                stats: "replies liked"
            });
        }
        catch (err) {
            res.status(404).json({ error: 'Like Replies Error', err: err });
            ;
        }
    }
    async setUnlikedReplies(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const likedData = await thread_1.default.setUnlikedReplies(parseInt(req.params.id), user.id);
            if (!likedData)
                throw new Error("unlike replies Error");
            res.json({
                thread_id: parseInt(req.params.id),
                stats: "thread unliked"
            });
        }
        catch (err) {
            res.status(404).json({ error: 'unlike replies Error', err: err });
            ;
        }
    }
}
exports.default = new threadController();
//# sourceMappingURL=thread.js.map