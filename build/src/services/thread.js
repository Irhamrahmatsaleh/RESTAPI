"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const thread_1 = require("../dto/thread");
const cloudinary_1 = require("cloudinary");
class threadServices {
    prisma;
    constructor() {
        this.prisma = new client_1.PrismaClient();
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        });
    }
    async FindThread(idUser) {
        try {
            const fetchedData = await this.prisma.threads.findMany({
                orderBy: [{
                        update_at: 'desc'
                    }],
                where: { created_by: idUser },
                include: {
                    users: {
                        select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true
                        }
                    },
                    likes: {
                        select: {
                            user_id: true
                        }
                    },
                    replies: {
                        select: {
                            user_id: true
                        }
                    },
                },
            });
            if (fetchedData) {
                const threadData = fetchedData.map(data => {
                    const likesID = new Set(data.likes.map(l => l.user_id));
                    const replyID = new Set(data.replies.map(r => r.user_id));
                    const isliked = likesID.has(idUser);
                    const isReplied = replyID.has(idUser);
                    data.number_of_replies = data.replies.length;
                    return { ...data, isliked, isReplied };
                });
                return threadData;
            }
            else {
                throw new Error("All Thread Empty");
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async FindThreadID(idThread, idUser) {
        try {
            const fetchedData = await this.prisma.threads.findUnique({
                where: { id: idThread },
                include: {
                    users: {
                        select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true
                        }
                    },
                    likes: {
                        select: {
                            user_id: true
                        }
                    },
                    replies: {
                        select: {
                            user_id: true
                        }
                    },
                },
            });
            if (fetchedData) {
                const likesID = new Set(fetchedData.likes.map(l => l.user_id));
                const replyID = new Set(fetchedData.replies.map(r => r.user_id));
                const isliked = likesID.has(idUser);
                const isReplied = replyID.has(idUser);
                fetchedData.number_of_replies = fetchedData.replies.length;
                const threadData = {
                    ...fetchedData, isliked, isReplied
                };
                return threadData;
            }
            else {
                throw new Error("All Thread Empty");
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async FindOtherThread(idOther, idCurrentUser) {
        try {
            const fetchedData = await this.prisma.threads.findMany({
                orderBy: [{
                        update_at: 'desc'
                    }],
                where: { created_by: idOther },
                include: {
                    users: {
                        select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true
                        }
                    },
                    likes: {
                        select: {
                            user_id: true
                        }
                    },
                    replies: {
                        select: {
                            user_id: true
                        }
                    },
                },
            });
            if (fetchedData) {
                const threadData = fetchedData.map(data => {
                    const likesID = new Set(data.likes.map(l => l.user_id));
                    const replyID = new Set(data.replies.map(r => r.user_id));
                    const isliked = likesID.has(idCurrentUser);
                    const isReplied = replyID.has(idCurrentUser);
                    data.number_of_replies = data.replies.length;
                    return { ...data, isliked, isReplied };
                });
                return threadData;
            }
            else {
                throw new Error("All Thread Empty");
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async FindAllThread(idCurrentUser) {
        try {
            const fetchedData = await this.prisma.threads.findMany({
                orderBy: [{
                        update_at: 'desc'
                    }],
                include: {
                    users: {
                        select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true
                        }
                    },
                    likes: {
                        select: {
                            user_id: true
                        }
                    },
                    replies: {
                        select: {
                            user_id: true
                        }
                    },
                },
            });
            if (fetchedData) {
                const threadData = fetchedData.map(data => {
                    const likesID = new Set(data.likes.map(l => l.user_id));
                    const replyID = new Set(data.replies.map(r => r.user_id));
                    const isliked = likesID.has(idCurrentUser);
                    const isReplied = replyID.has(idCurrentUser);
                    data.number_of_replies = data.replies.length;
                    let isUser = false;
                    if (data.created_by === idCurrentUser)
                        isUser = true;
                    return { ...data, isliked, isReplied, isUser };
                });
                return threadData;
            }
            else {
                throw new Error("All Thread Empty");
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async FindAllImage() {
        try {
            const fetchedData = await this.prisma.threads.findMany({
                orderBy: [{
                        update_at: 'desc'
                    }],
                include: {
                    users: {
                        select: {
                            username: true,
                            full_name: true,
                            photo_profile: true
                        }
                    },
                    likes: true
                },
            });
            if (fetchedData) {
                return fetchedData;
            }
            else {
                throw new Error("All Image Empty");
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async FindRepliesID(idThread, idCurrentUser) {
        try {
            const fetchedData = await this.prisma.replies.findMany({
                orderBy: [{
                        updated_at: 'desc'
                    }],
                where: { thread_id: idThread },
                include: {
                    users: {
                        select: {
                            id: true,
                            photo_profile: true,
                            username: true,
                            full_name: true
                        }
                    },
                    likesreplies: true,
                    childReplies: true
                }
            });
            if (fetchedData) {
                const threadData = fetchedData.map(data => {
                    const likesID = new Set(data.likesreplies.map(l => l.user_id));
                    const replyID = new Set(data.childReplies.map(r => r.user_id));
                    const isLiked = likesID.has(idCurrentUser);
                    const isReplied = replyID.has(idCurrentUser);
                    let isUser = false;
                    if (data.created_by === idCurrentUser)
                        isUser = true;
                    const likesCount = data.likesreplies.length;
                    const repliesCount = data.childReplies.length;
                    return { ...data, isUser, likesCount, repliesCount, isLiked, isReplied };
                });
                return threadData;
            }
            else {
                throw new Error("All Thread Empty");
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async FindSingleRepliesID(idReply, idCurrentUser) {
        try {
            const fetchedData = await this.prisma.replies.findUnique({
                where: { id: idReply },
                include: {
                    users: {
                        select: {
                            id: true,
                            photo_profile: true,
                            username: true,
                            full_name: true
                        }
                    },
                    likesreplies: true,
                    childReplies: true
                }
            });
            if (fetchedData) {
                const likesID = new Set(fetchedData.likesreplies.map(l => l.user_id));
                const replyID = new Set(fetchedData.childReplies.map(r => r.user_id));
                const isLiked = likesID.has(idCurrentUser);
                const isReplied = replyID.has(idCurrentUser);
                let isUser = false;
                if (fetchedData.created_by === idCurrentUser)
                    isUser = true;
                const likesCount = fetchedData.likesreplies.length;
                const repliesCount = fetchedData.childReplies.length;
                return { ...fetchedData, isUser, likesCount, repliesCount, isLiked, isReplied };
            }
            else {
                throw new Error("All Thread Empty");
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async FindChildrenRepliesID(idParent, idCurrentUser) {
        try {
            const fetchedData = await this.prisma.replies.findMany({
                orderBy: [{
                        updated_at: 'desc'
                    }],
                where: { parent_id: idParent },
                include: {
                    users: {
                        select: {
                            id: true,
                            photo_profile: true,
                            username: true,
                            full_name: true
                        }
                    },
                    likesreplies: true,
                    childReplies: true
                }
            });
            if (fetchedData) {
                const threadData = fetchedData.map(data => {
                    const likesID = new Set(data.likesreplies.map(l => l.user_id));
                    const replyID = new Set(data.childReplies.map(r => r.user_id));
                    const isLiked = likesID.has(idCurrentUser);
                    const isReplied = replyID.has(idCurrentUser);
                    let isUser = false;
                    if (data.created_by === idCurrentUser)
                        isUser = true;
                    const likesCount = data.likesreplies.length;
                    const repliesCount = data.childReplies.length;
                    return { ...data, isUser, likesCount, repliesCount, isLiked, isReplied };
                });
                return threadData;
            }
            else {
                throw new Error("All Thread Empty");
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async PostReplies(dto, user, idThread) {
        try {
            const validate = thread_1.threadValidate.validate(dto);
            if (validate.error) {
                throw new Error('validate error');
            }
            // Upload image if provided
            let imageUrl = null;
            if (dto.image) {
                const upload = await cloudinary_1.v2.uploader.upload(dto.image, {
                    upload_preset: "threads"
                });
                imageUrl = upload.secure_url;
            }
            const createdData = await this.prisma.replies.create({
                data: {
                    user_id: user.id,
                    thread_id: idThread,
                    content: dto.content,
                    image: imageUrl,
                    created_by: user.id,
                    updated_by: user.id,
                }
            });
            if (!createdData)
                throw new Error("error create data");
            return createdData;
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async PostRepliesChildren(dto, user, idParent) {
        try {
            const validate = thread_1.threadValidate.validate(dto);
            if (validate.error) {
                throw new Error('validate error');
            }
            // Upload image if provided
            let imageUrl = null;
            if (dto.image) {
                const upload = await cloudinary_1.v2.uploader.upload(dto.image, {
                    upload_preset: "threads"
                });
                imageUrl = upload.secure_url;
            }
            const createdData = await this.prisma.replies.create({
                data: {
                    user_id: user.id,
                    parent_id: idParent,
                    content: dto.content,
                    image: imageUrl,
                    created_by: user.id,
                    updated_by: user.id,
                }
            });
            if (!createdData)
                throw new Error("error create data");
            return createdData;
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async PostThread(dto, user) {
        try {
            const validate = thread_1.threadValidate.validate(dto);
            if (validate.error) {
                throw new Error('validate post thread error');
            }
            // Upload image if provided
            let imageUrl = null;
            if (dto.image) {
                const upload = await cloudinary_1.v2.uploader.upload(dto.image, {
                    upload_preset: "threads"
                });
                imageUrl = upload.secure_url;
            }
            const createdData = await this.prisma.threads.create({
                data: {
                    content: dto.content,
                    image: imageUrl,
                    created_by: user.id,
                    updated_by: user.id
                }
            });
            if (!createdData)
                throw new Error("error create threads");
            return createdData;
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async UpdateThread(idUser, dto) {
        const data = {
            content: dto.content,
            image: dto.image
        };
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (!data[key])
                    delete data[key];
            }
        }
        try {
            const validate = thread_1.threadValidate.validate(dto);
            if (validate.error) {
                throw new Error(JSON.stringify(validate.error));
            }
            const dataUpdate = await this.prisma.threads.update({
                where: { id: idUser },
                data: { ...data }
            });
            if (!dataUpdate)
                throw new Error("error update data");
            return dataUpdate;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async DeleteThread(idThread) {
        try {
            const deletedData = await this.prisma.threads.delete({
                where: {
                    id: idThread
                }
            });
            return deletedData;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async DeleteReply(idReply) {
        try {
            const deletedData = await this.prisma.replies.delete({
                where: {
                    id: idReply
                }
            });
            return deletedData;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async setLiked(idThread, idUser) {
        try {
            const likedData = await this.prisma.likes.create({
                data: {
                    user_id: idUser,
                    thread_id: idThread,
                    created_by: idUser,
                    updated_by: idUser
                }
            });
            return likedData;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async setUnliked(idThread, idUser) {
        try {
            const unlikedData = await this.prisma.likes.deleteMany({ where: {
                    user_id: idUser,
                    thread_id: idThread
                } });
            return unlikedData;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async setLikedReplies(idReply, idUser) {
        try {
            const likedData = await this.prisma.likesreplies.create({
                data: {
                    user_id: idUser,
                    reply_id: idReply,
                    created_by: idUser,
                    updated_by: idUser
                }
            });
            return likedData;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async setUnlikedReplies(idReply, idUser) {
        try {
            const unlikedData = await this.prisma.likesreplies.deleteMany({ where: {
                    user_id: idUser,
                    reply_id: idReply
                } });
            return unlikedData;
        }
        catch (err) {
            throw new Error(err);
        }
    }
}
exports.default = new threadServices();
//# sourceMappingURL=thread.js.map