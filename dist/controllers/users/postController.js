"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = exports.searchPosts = exports.getPostStat = exports.updatePostViews = exports.updatePostStat = exports.deletePost = exports.updatePost = exports.getBookMarkedPosts = exports.getMutedUsers = exports.getBlockedUsers = exports.getFollowings = exports.getFollowingPosts = exports.getPosts = exports.getPostById = exports.repostPost = exports.muteUser = exports.blockUser = exports.pinPost = exports.updatePoll = exports.createPost = exports.makePost = exports.deleteAccount = exports.updateAccount = exports.getAccounts = exports.getAccountById = exports.createAccount = void 0;
const postModel_1 = require("../../models/users/postModel");
const fileUpload_1 = require("../../utils/fileUpload");
const errorHandler_1 = require("../../utils/errorHandler");
const userModel_1 = require("../../models/users/userModel");
const query_1 = require("../../utils/query");
const statModel_1 = require("../../models/users/statModel");
const computation_1 = require("../../utils/computation");
const app_1 = require("../../app");
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const { username, displayName, description, picture, followingsId, interests, userId, } = req.body;
        const user = yield userModel_1.User.findOneAndUpdate({ _id: userId }, {
            picture: picture,
            displayName: displayName,
            isFirstTime: false,
            username: username,
            interests: interests,
            intro: description,
        }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        yield postModel_1.Follower.create({
            userId: user._id,
            followingId: followingsId,
        });
        res.status(200).json({
            message: 'Account created successfully',
            user: user,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createAccount = createAccount;
const getAccountById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItemById)(req, res, postModel_1.Account, 'Account was not found');
});
exports.getAccountById = getAccountById;
const getAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItems)(req, res, postModel_1.Account);
});
exports.getAccounts = getAccounts;
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.updateItem)(req, res, postModel_1.Account, ['picture', 'media'], ['Account not found', 'Account was updated successfully']);
});
exports.updateAccount = updateAccount;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = yield postModel_1.Account.findByIdAndDelete(req.params.id);
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }
        res.status(200).json({ message: 'Email deleted successfully' });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteAccount = deleteAccount;
/////////////////////////////// POST /////////////////////////////////
const makePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = req.body.sender;
        const data = req.body;
        const form = {
            picture: sender.picture,
            username: sender.username,
            displayName: sender.displayName,
            polls: data.polls,
            users: data.users,
            userId: sender._id,
            postId: data.postId,
            postType: data.postType,
            content: data.content,
            createdAt: data.createdAt,
            media: data.media,
            status: data.status,
            isVerified: sender.isVerified,
        };
        const post = yield postModel_1.Post.create(form);
        const score = (0, computation_1.postScore)(post.likes, post.replies, post.shares, post.bookmarks, post.reposts, post.views);
        if (data.postType === 'comment') {
            yield userModel_1.User.updateOne({ _id: sender._id }, {
                $inc: { comments: 1 },
            });
            yield postModel_1.Post.updateOne({ _id: data.postId }, {
                $inc: { replies: 1 },
                $set: { score: score },
            });
        }
        else {
            yield userModel_1.User.updateOne({ _id: sender._id }, {
                $inc: { posts: 1 },
            });
        }
        yield statModel_1.View.create({
            postId: post._id,
            userId: sender._id,
        });
        res.status(200).json({
            message: 'Your content is posted successfully',
            data: post,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.makePost = makePost;
const createPost = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = data.sender;
        const form = {
            picture: sender.picture,
            username: sender.username,
            displayName: sender.displayName,
            polls: data.polls,
            users: data.users,
            userId: sender._id,
            postId: data.postId,
            postType: data.postType,
            status: data.status,
            content: data.content,
            createdAt: data.createdAt,
            media: data.media,
            isVerified: sender.isVerified,
        };
        const post = yield postModel_1.Post.create(form);
        const score = (0, computation_1.postScore)(post.likes, post.replies, post.shares, post.bookmarks, post.reposts, post.views);
        if (data.postType === 'comment') {
            yield userModel_1.User.updateOne({ _id: sender._id }, {
                $inc: { comments: 1 },
            });
            yield postModel_1.Post.updateOne({ _id: data.postId }, {
                $inc: { replies: 1 },
                $set: { score: score },
            });
        }
        else {
            yield userModel_1.User.updateOne({ _id: sender._id }, {
                $inc: { posts: 1 },
            });
        }
        yield statModel_1.View.create({
            postId: post._id,
            userId: sender._id,
        });
        app_1.io.emit(`post${sender._id}`, {
            message: 'Your post was created successfully',
            data: post,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createPost = createPost;
const updatePoll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { polls, userId, username, totalVotes, pollIndex } = req.body;
        yield postModel_1.Poll.findOneAndUpdate({ postId: req.params.id, userId: userId }, {
            $set: {
                pollIndex: pollIndex,
                username: username,
                userId: userId,
                postId: req.params.id,
            },
        }, { new: true, upsert: true });
        const sanitizedPolls = polls.map((poll) => {
            const { userId, isSelected } = poll, rest = __rest(poll, ["userId", "isSelected"]);
            return rest;
        });
        const updatedPost = yield postModel_1.Post.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                totalVotes: totalVotes,
                polls: sanitizedPolls,
            },
        }, { new: true });
        return res.status(200).json({
            data: updatedPost,
            totalVotes: totalVotes,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updatePoll = updatePoll;
const pinPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, pinnedAt } = req.body;
        const pinnedPost = yield postModel_1.Pin.findOne({
            postId: req.params.id,
            userId: userId,
        });
        if (pinnedPost) {
            yield postModel_1.Pin.findByIdAndDelete(pinnedPost._id);
        }
        else {
            yield postModel_1.Pin.create({
                userId: userId,
                postId: req.params.id,
                createdAt: pinnedAt,
            });
        }
        const post = yield postModel_1.Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (!pinnedPost) {
            const postObj = post.toObject();
            postObj.isPinned = true;
            postObj.pinnedAt = pinnedAt;
            res.status(201).json({
                data: postObj,
                message: 'The post has been pinned successfully.',
            });
        }
        else {
            const postObj = post.toObject();
            postObj.isPinned = false;
            return res.status(200).json({
                data: postObj,
                message: 'The post has been unpinned successfully.',
            });
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.pinPost = pinPost;
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, username, displayName, picture, bioId, isVerified, accountUsername, accountUserId, accountDisplayName, accountPicture, accountIsVerified, } = req.body;
        const blockedUser = yield postModel_1.Block.findOne({
            accountUsername: accountUsername,
            userId: userId,
        });
        if (blockedUser) {
            yield postModel_1.Block.findByIdAndDelete(blockedUser._id);
            yield userModel_1.User.findByIdAndUpdate(accountUserId, { $inc: { blocks: -1 } });
        }
        else {
            yield postModel_1.Block.create({
                userId,
                username,
                displayName,
                picture,
                bioId,
                isVerified,
                accountUsername,
                accountUserId,
                accountDisplayName,
                accountPicture,
                accountBioId: accountUserId,
                accountIsVerified,
                postId: req.params.id,
            });
            yield userModel_1.User.findByIdAndUpdate(accountUserId, { $inc: { blocks: 1 } });
            yield postModel_1.Post.findByIdAndUpdate(req.params.id, { $inc: { blocks: 1 } });
        }
        const post = yield postModel_1.Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.status(201).json({
            id: req.params.id,
            accountUserId,
            blocked: blockedUser ? false : true,
            message: !blockedUser
                ? 'The user has been blocked successfully'
                : 'The user has successfully been unblocked.',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.blockUser = blockUser;
const muteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, username, displayName, picture, bioId, isVerified, accountUsername, accountUserId, accountDisplayName, accountPicture, accountIsVerified, } = req.body;
        const mutedUser = yield postModel_1.Mute.findOne({
            accountUsername: accountUsername,
            userId: userId,
        });
        console.log(req.body);
        if (mutedUser) {
            yield postModel_1.Mute.findByIdAndDelete(mutedUser._id);
            yield userModel_1.User.findByIdAndUpdate(accountUserId, { $inc: { mutes: -1 } });
        }
        else {
            yield postModel_1.Mute.create({
                userId,
                username,
                displayName,
                picture,
                bioId,
                isVerified,
                accountUsername,
                accountUserId,
                accountDisplayName,
                accountPicture,
                accountBioId: accountUserId,
                accountIsVerified,
                postId: req.params.id,
            });
            yield userModel_1.User.findByIdAndUpdate(accountUserId, { $inc: { mutes: 1 } });
            yield postModel_1.Post.findByIdAndUpdate(req.params.id, { $inc: { mutes: 1 } });
        }
        res.status(201).json({
            id: req.params.id,
            accountUserId,
            muted: mutedUser ? false : true,
            message: !mutedUser
                ? 'The user has been muted successfully'
                : 'The user has successfully been unmuted.',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.muteUser = muteUser;
const repostPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.Post.findByIdAndUpdate(req.params.id, { $inc: { reposts: 1 } }, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const score = (0, computation_1.postScore)(post.likes, post.replies, post.shares, post.bookmarks, post.reposts, post.views);
        yield postModel_1.Post.findByIdAndUpdate(req.params.id, { $set: { score: score } });
        const _a = post.toObject(), { _id } = _a, rest = __rest(_a, ["_id"]);
        rest.username = req.body.username;
        rest.displayName = req.body.displayName;
        rest.picture = req.body.picture;
        rest.isVerified = req.body.isVerified;
        rest.userId = req.body.userId;
        rest.replies = 0;
        rest.repostedUsername = post.username;
        rest.bookmarks = 0;
        rest.followers = 0;
        rest.unfollowers = 0;
        rest.shares = 0;
        rest.views = 0;
        rest.likes = 0;
        rest.reposts = 0;
        rest.score = 0;
        rest.trendScore = 0;
        rest.status = true;
        rest.reposted = true;
        rest.isPinned = false;
        rest.createdAt = new Date();
        const newPost = yield postModel_1.Post.create(rest);
        yield userModel_1.User.updateOne({ _id: req.body.userId }, {
            $inc: { posts: 1 },
        });
        yield statModel_1.View.create({
            postId: newPost._id,
            userId: req.body.userId,
        });
        // io.emit(`post${req.body.userId}`, {
        //   message: "The post was reposted successfully",
        //   data: post,
        // });
        // const followers = await Follower.find({ userId: req.body.userId });
        res.status(201).json({ message: 'The post was reposted successfully' });
    }
    catch (error) {
        console.log(error);
    }
});
exports.repostPost = repostPost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItemById)(req, res, postModel_1.Post, 'Post not found');
});
exports.getPostById = getPostById;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerId = String(req.query.myId);
        delete req.query.myId;
        delete req.query.following;
        const processedPosts = yield processFetchedPosts(req, followerId);
        res.status(200).json(processedPosts);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPosts = getPosts;
const getFollowingPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerId = String(req.query.myId);
        const followers = yield postModel_1.Follower.find({ followerId: followerId });
        const followersUserIds = followers.map((user) => user.userId);
        delete req.query.myId;
        const mongoQuery = Object.assign(Object.assign({}, req.query), { userId: { in: followersUserIds } });
        req.query = mongoQuery;
        delete req.query.myId;
        const processedPosts = yield processFetchedPosts(req, followerId);
        res.status(200).json(processedPosts);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getFollowingPosts = getFollowingPosts;
const getFollowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(postModel_1.Follower, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getFollowings = getFollowings;
const getBlockedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(postModel_1.Block, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBlockedUsers = getBlockedUsers;
const getMutedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(postModel_1.Mute, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getMutedUsers = getMutedUsers;
const getBookMarkedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookmarkUserId = String(req.query.myId);
        const bookmarks = yield statModel_1.Bookmark.find({ bookmarkUserId: bookmarkUserId });
        // const followers = await Follower.find({ followerId: followerId });
        const bookmarksPostIds = bookmarks.map((post) => post.postId);
        // delete req.query.myId;
        const mongoQuery = Object.assign(Object.assign({}, req.query), { _id: { in: bookmarksPostIds } });
        req.query = mongoQuery;
        delete req.query.myId;
        const processedPosts = yield processFetchedPosts(req, bookmarkUserId);
        res.status(200).json(processedPosts);
        // const posts = response.results;
        // const postIds = posts.map((post) => post._id);
        // const userIds = [...new Set(posts.map((post) => post.userId))];
        // const userObjects = userIds.map((userId) => ({ userId, followerId }));
        // const queryConditions = userObjects.map(({ userId, followerId }) => ({
        //   userId,
        //   followerId,
        // }));
        // const follows = await Follower.find(
        //   { $or: queryConditions },
        //   { userId: 1, _id: 0 }
        // );
        // const followedUserIds = new Set(follows.map((user) => user.userId));
        // posts.map((post) => {
        //   if (followedUserIds.has(post.userId)) {
        //     post.followed = true;
        //   }
        //   return post;
        // });
        // const likedPosts = await Like.find({
        //   userId: followerId,
        //   postId: { $in: postIds },
        // }).select("postId");
        // const bookmarkedPosts = await Bookmark.find({
        //   userId: followerId,
        //   postId: { $in: postIds },
        // }).select("postId");
        // const viewedPosts = await View.find({
        //   userId: followerId,
        //   postId: { $in: postIds },
        // }).select("postId");
        // const likedPostIds = likedPosts.map((like) => like.postId.toString());
        // const bookmarkedPostIds = bookmarkedPosts.map((bookmark) =>
        //   bookmark.postId.toString()
        // );
        // const viewedPostIds = viewedPosts.map((view) => view.postId.toString());
        // const updatedPosts = [];
        // for (let i = 0; i < posts.length; i++) {
        //   const el = posts[i];
        //   if (likedPostIds.includes(el._id.toString())) {
        //     el.liked = true;
        //   }
        //   if (bookmarkedPostIds.includes(el._id.toString())) {
        //     el.bookmarked = true;
        //   }
        //   if (viewedPostIds.includes(el._id.toString())) {
        //     el.viewed = true;
        //   }
        //   updatedPosts.push(el);
        // }
        // res.status(200).json({
        //   count: response.count,
        //   page: response.page,
        //   page_size: response.page_size,
        //   results: updatedPosts,
        // });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBookMarkedPosts = getBookMarkedPosts;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const post = yield postModel_1.Post.findByIdAndUpdate(req.params.id, req.body);
        res.status(201).json({
            message: 'Your post was updated successfully',
            data: post,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'This post has been deleted' });
        }
        if (post.media.length > 0) {
            for (let i = 0; i < post.media.length; i++) {
                const el = post.media[i];
                (0, fileUpload_1.deleteFileFromS3)(el.source);
            }
        }
        if (post.postType === 'comment') {
            yield userModel_1.User.updateOne({ _id: post.userId }, {
                $inc: { comments: -1 },
            });
            yield postModel_1.Post.updateOne({ _id: post._id }, {
                $inc: { replies: -1 },
            });
        }
        else {
            yield userModel_1.User.updateOne({ _id: post.userId }, {
                $inc: { posts: -1 },
            });
        }
        yield postModel_1.Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: 'Post is deleted successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deletePost = deletePost;
const updatePostStat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id } = req.body;
        let updateQuery = {};
        const post = yield postModel_1.Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (req.body.likes !== undefined) {
            if (!req.body.likes && post.likes <= 0) {
                return res.status(200).json({ message: null });
            }
            const like = yield statModel_1.Like.findOne({ postId: id, userId });
            if (like) {
                updateQuery.$inc = { likes: -1 };
                yield statModel_1.Like.deleteOne({ postId: id, userId });
            }
            else {
                updateQuery.$inc = { likes: 1 };
                yield statModel_1.Like.create({ postId: id, userId });
            }
        }
        if (req.body.bookmarks !== undefined) {
            if (!req.body.bookmarks && post.bookmarks <= 0) {
                return res.status(200).json({ message: null });
            }
            const bookmark = yield statModel_1.Bookmark.findOne({
                postId: id,
                bookmarkUserId: userId,
            });
            if (bookmark) {
                updateQuery.$inc = { bookmarks: -1 };
                yield statModel_1.Bookmark.deleteOne({ postId: id, bookmarkUserId: userId });
            }
            else {
                updateQuery.$inc = { bookmarks: 1 };
                yield statModel_1.Bookmark.create({
                    postId: id,
                    userId: post.userId,
                    bookmarkUserId: userId,
                });
            }
        }
        if (req.body.views !== undefined) {
            if (!req.body.viewedPostIds) {
                for (let i = 0; i < req.body.viewedPostIds.length; i++) {
                    const el = req.body.viewedPostIds[i];
                    const post = yield statModel_1.View.findOne({ userId: userId, postId: el._id });
                    if (!post) {
                        updateQuery.$inc = { views: 1 };
                        yield statModel_1.View.create({ userId: userId, postId: el._id });
                    }
                }
            }
            else {
                const post = yield statModel_1.View.findOne({ userId: userId, postId: id });
                if (!post) {
                    updateQuery.$inc = { views: 1 };
                    yield statModel_1.View.create({ userId: userId, postId: id });
                }
            }
        }
        const score = (0, computation_1.postScore)(post.likes, post.replies, post.shares, post.bookmarks, post.reposts, post.views);
        yield postModel_1.Post.updateOne({ _id: post._id }, {
            $set: { score: score },
        });
        if (Object.keys(updateQuery).length > 0) {
            yield postModel_1.Post.findByIdAndUpdate(id, updateQuery, {
                new: true,
            });
            return res.status(200).json({ message: null });
        }
        else {
            return res.status(200).json({ message: null });
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updatePostStat = updatePostStat;
const updatePostViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id, viewedPostIds } = req.body;
        let updateQuery = {};
        const posts = yield postModel_1.Post.find({
            _id: { $in: viewedPostIds },
        });
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }
        for (let i = 0; i < posts.length; i++) {
            const el = posts[i];
            const post = yield statModel_1.View.findOne({ userId: userId, postId: el._id });
            const score = (0, computation_1.postScore)(el.likes, el.replies, el.shares, el.bookmarks, el.reposts, el.views);
            yield postModel_1.Post.updateOne({ _id: el._id }, {
                $set: { score: score },
            });
            if (!post) {
                updateQuery.$inc = { views: 1 };
                yield statModel_1.View.create({ userId: userId, postId: el._id });
                yield postModel_1.Post.findByIdAndUpdate(el._id, updateQuery, {
                    new: true,
                });
            }
        }
        return res.status(200).json({ message: null });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updatePostViews = updatePostViews;
const getPostStat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.query;
        const hasLiked = yield statModel_1.Like.findOne({ postId: id, userId });
        const hasBookmarked = yield statModel_1.Bookmark.findOne({ postId: id, userId });
        return res.status(200).json({
            likes: hasLiked ? true : false,
            bookmarks: hasBookmarked ? true : false,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPostStat = getPostStat;
const searchPosts = (req, res) => {
    return (0, query_1.search)(postModel_1.Post, req, res);
};
exports.searchPosts = searchPosts;
//-----------------FOLLOW USER--------------------//
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { follow, message } = yield (0, query_1.followAccount)(req, res);
        const post = req.body.post;
        post.followed = follow ? false : true;
        post.isActive = false;
        res.status(200).json({
            message: message,
            data: post,
            action: 'follow',
            actionType: post.postType,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.followUser = followUser;
const processFetchedPosts = (req, followerId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const source = req.query.source;
    delete req.query.source;
    const response = yield (0, query_1.queryData)(postModel_1.Post, req);
    const posts = response.results;
    const postIds = posts.map((post) => post._id);
    const postUserIds = posts.map((post) => post.userId);
    const userIds = [...new Set(posts.map((post) => post.userId))];
    const userObjects = userIds.map((userId) => ({ userId, followerId }));
    const queryConditions = userObjects.map(({ userId, followerId }) => ({
        userId,
        followerId,
    }));
    const follows = yield postModel_1.Follower.find({ $or: queryConditions }, { userId: 1, _id: 0 });
    const followedUserIds = new Set(follows.map((user) => user.userId));
    posts.map((post) => {
        if (followedUserIds.has(post.userId)) {
            post.followed = true;
        }
        return post;
    });
    const blockedUsers = yield postModel_1.Block.find({
        userId: followerId,
        accountUserId: { $in: postUserIds },
    }).select('accountUserId');
    const mutedUsers = yield postModel_1.Mute.find({
        userId: followerId,
        accountUserId: { $in: postUserIds },
    }).select('accountUserId');
    const pinnedPosts = yield postModel_1.Pin.find({
        userId: followerId,
        postId: { $in: postIds },
    }).select('postId createdAt');
    const polledPosts = yield postModel_1.Poll.find({
        userId: followerId,
        postId: { $in: postIds },
    }).select('postId pollIndex');
    const likedPosts = yield statModel_1.Like.find({
        userId: followerId,
        postId: { $in: postIds },
    }).select('postId');
    const bookmarkedPosts = yield statModel_1.Bookmark.find({
        bookmarkUserId: followerId,
        postId: { $in: postIds },
    }).select('postId');
    const viewedPosts = yield statModel_1.View.find({
        userId: followerId,
        postId: { $in: postIds },
    }).select('postId');
    const blockedPostIds = blockedUsers.map((block) => block.accountUserId.toString());
    const polledList = polledPosts.map((poll) => ({
        postId: poll.postId.toString(),
        pollIndex: poll.pollIndex,
    }));
    const mutedUserIds = mutedUsers.map((mute) => mute.accountUserId.toString());
    const likedPostIds = likedPosts.map((like) => like.postId.toString());
    const bookmarkedPostIds = bookmarkedPosts.map((bookmark) => bookmark.postId.toString());
    const viewedPostIds = viewedPosts.map((view) => view.postId.toString());
    const updatedPosts = [];
    const pinnedMap = new Map(pinnedPosts.map((pin) => [pin.postId.toString(), pin.createdAt]));
    for (let i = 0; i < posts.length; i++) {
        const el = posts[i];
        const postIdStr = el._id.toString();
        const pinnedAtValue = pinnedMap.get(postIdStr);
        const userIdStr = (_a = el.userId) === null || _a === void 0 ? void 0 : _a.toString();
        if (mutedUsers.length > 0 && mutedUserIds.includes(userIdStr)) {
            continue;
        }
        if (pinnedAtValue !== undefined) {
            el.isPinned = true;
            el.pinnedAt = pinnedAtValue;
        }
        if (blockedPostIds.includes(el.userId.toString())) {
            el.blocked = true;
        }
        for (let x = 0; x < polledList.length; x++) {
            const poll = polledList[x];
            if (postIdStr.includes(poll.postId)) {
                el.polls[poll.pollIndex].userId = followerId;
                el.isSelected = true;
            }
        }
        if (likedPostIds.includes(el._id.toString())) {
            el.liked = true;
        }
        if (bookmarkedPostIds.includes(el._id.toString())) {
            el.bookmarked = true;
        }
        if (viewedPostIds.includes(el._id.toString())) {
            el.viewed = true;
        }
        updatedPosts.push(el);
    }
    const pinned = updatedPosts.filter((post) => post.isPinned);
    const unpinned = updatedPosts.filter((post) => !post.isPinned);
    pinned.sort((a, b) => new Date(b.pinnedAt).getTime() - new Date(a.pinnedAt).getTime());
    const finalPosts = [...pinned, ...unpinned];
    return {
        count: response.count,
        page: response.page,
        page_size: response.page_size,
        results: source === 'user' ? finalPosts : updatedPosts,
    };
});
