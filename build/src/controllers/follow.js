"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const follow_1 = __importDefault(require("../services/follow"));
class followController {
    async fetchFollowing(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const followings = await follow_1.default.followingList(user);
            res.send(followings);
        }
        catch (err) {
            res.status(500).json({ error: 'Following not found' });
            ;
        }
    }
    async fetchFollower(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const followings = await follow_1.default.followerList(user);
            res.send(followings);
        }
        catch (err) {
            res.status(500).json({ error: 'Follower not found' });
            ;
        }
    }
    async fetchRandomUserSuggestion(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const followings = await follow_1.default.suggestedUser(user, 3);
            res.send(followings);
        }
        catch (err) {
            res.status(500).json({ error: err });
            ;
        }
    }
    async fetchSearchedUser(req, res) {
        /*  #swagger.parameters['search'] = {
            description: 'search for users (string)'
        } */
        try {
            const user = res.locals.verifyingUser;
            const search = req.query.search;
            const users = await follow_1.default.searchedUsers(search, user);
            res.send(users);
        }
        catch (err) {
            res.status(400).json({ error: err });
            ;
        }
    }
    async setFollowID(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const likedData = await follow_1.default.setFollow(parseInt(req.params.id), user.id);
            if (!likedData)
                throw new Error("Follow Error");
            res.json({
                followed_id: parseInt(req.params.id),
                stats: "user followed"
            });
        }
        catch (err) {
            res.status(404).json({ error: 'Follow Error' });
            ;
        }
    }
    async setUnfollowID(req, res) {
        try {
            const user = res.locals.verifyingUser;
            const likedData = await follow_1.default.setUnfollow(parseInt(req.params.id), user.id);
            if (!likedData)
                throw new Error("Unfollow Error");
            res.json({
                followed_id: parseInt(req.params.id),
                stats: "user unfollowed"
            });
        }
        catch (err) {
            res.status(404).json({ error: 'Unfollow Error' });
            ;
        }
    }
}
exports.default = new followController();
//# sourceMappingURL=follow.js.map