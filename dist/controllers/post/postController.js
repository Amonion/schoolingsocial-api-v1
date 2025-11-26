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
exports.processPosts = exports.followUser = exports.searchPosts = exports.getPostStat = exports.updatePostViews = exports.updatePostStat = exports.toggleBookmarkedPosts = exports.toggleLikePost = exports.deletePost = exports.updatePost = exports.getBookMarkedPosts = exports.getMutedUsers = exports.getBlockedUsers = exports.getFollowers = exports.getFollowings = exports.getFilteredPosts = exports.getPosts = exports.getUserPosts = exports.getPostById = exports.repostPost = exports.muteUser = exports.blockUser = exports.pinPost = exports.updatePoll = exports.createPost = void 0;
const postModel_1 = require("../../models/post/postModel");
const fileUpload_1 = require("../../utils/fileUpload");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const statModel_1 = require("../../models/users/statModel");
const computation_1 = require("../../utils/computation");
const app_1 = require("../../app");
const user_1 = require("../../models/users/user");
const interestModel_1 = require("../../models/post/interestModel");
const postStateModel_1 = require("../../models/post/postStateModel");
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
            country: data.country,
            createdAt: data.createdAt,
            media: data.media,
            backgroundColor: data.backgroundColor,
            isVerified: sender.isVerified,
        };
        const post = yield postModel_1.Post.create(form);
        yield user_1.User.updateOne({ _id: sender._id }, {
            $inc: { posts: 1, postMedia: data.media.length },
        });
        yield statModel_1.View.create({
            postId: post._id,
            userId: sender._id,
        });
        app_1.io.emit(`post_${sender.username}`, {
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
        const post = yield postModel_1.Post.findById(req.params.id);
        const score = (0, computation_1.postScore)('likes', post.score);
        const updatedPost = yield postModel_1.Post.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                totalVotes: totalVotes,
                polls: sanitizedPolls,
                score: score,
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
        const pinnedPost = yield postStateModel_1.Pin.findOne({
            postId: req.params.id,
            userId: userId,
        });
        if (pinnedPost) {
            yield postStateModel_1.Pin.findByIdAndDelete(pinnedPost._id);
        }
        else {
            yield postStateModel_1.Pin.create({
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
        const blockedUser = yield postStateModel_1.Block.findOne({
            accountUsername: accountUsername,
            userId: userId,
        });
        if (blockedUser) {
            yield postStateModel_1.Block.findByIdAndDelete(blockedUser._id);
            yield user_1.User.findByIdAndUpdate(accountUserId, { $inc: { blocks: -1 } });
        }
        else {
            yield postStateModel_1.Block.create({
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
            yield user_1.User.findByIdAndUpdate(accountUserId, { $inc: { blocks: 1 } });
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
        const mutedUser = yield postStateModel_1.Mute.findOne({
            accountUsername: accountUsername,
            userId: userId,
        });
        console.log(req.body);
        if (mutedUser) {
            yield postStateModel_1.Mute.findByIdAndDelete(mutedUser._id);
            yield user_1.User.findByIdAndUpdate(accountUserId, { $inc: { mutes: -1 } });
        }
        else {
            yield postStateModel_1.Mute.create({
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
            yield user_1.User.findByIdAndUpdate(accountUserId, { $inc: { mutes: 1 } });
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
        const score = (0, computation_1.postScore)('reposts', post.score);
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
        rest.views = 1;
        rest.likes = 0;
        rest.reposts = 0;
        rest.score = 0;
        rest.trendScore = 0;
        rest.status = true;
        rest.reposted = true;
        rest.isPinned = false;
        rest.createdAt = new Date();
        const newPost = yield postModel_1.Post.create(rest);
        yield user_1.User.updateOne({ _id: req.body.userId }, {
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
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerId = String(req.query.myId);
        delete req.query.myId;
        const response = yield (0, query_1.queryData)(postModel_1.Post, req);
        const results = yield (0, exports.processPosts)(response.results, followerId, 'user');
        res.status(200).json({ results, count: response.count });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserPosts = getUserPosts;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerId = String(req.query.myId);
        const page = parseInt(req.query.page, 10) || 1;
        const source = String(req.query.source);
        const interest = yield interestModel_1.Interest.findById(followerId);
        const result = yield (0, exports.getFilteredPosts)({
            followerId: followerId,
            countries: interest ? interest.countries : [],
            topics: interest ? interest.topics : [],
            page: page,
            source: source,
        });
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPosts = getPosts;
const getFilteredPosts = (interest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { countries = [], topics = [], page = 1, limit = 20, followerId, } = interest;
        const filter = {};
        if (countries.length > 0) {
            filter.country = { $in: countries };
        }
        if (topics.length > 0) {
            const escaped = topics.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const pattern = escaped.join('|');
            filter.content = { $regex: pattern, $options: 'i' };
        }
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(topics.length + countries.length === 0
            ? threeDaysAgo.getDate() - 100
            : threeDaysAgo.getDate() - 3);
        filter.createdAt = { $gte: threeDaysAgo };
        filter.postType = 'main';
        const sortOptions = { score: -1, createdAt: -1 };
        const skip = (page - 1) * limit;
        const [posts, total] = yield Promise.all([
            postModel_1.Post.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            postModel_1.Post.countDocuments(filter),
        ]);
        const results = yield (0, exports.processPosts)(posts, followerId, 'post');
        return {
            count: total,
            page,
            page_size: limit,
            results,
        };
    }
    catch (err) {
        console.error('Error fetching filtered posts:', err);
        throw err;
    }
});
exports.getFilteredPosts = getFilteredPosts;
const getFollowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { followerId } = req.query;
        // const result = await queryData<IFollower>(Follower, req)
        const followingResponse = yield (0, query_1.queryData)(postStateModel_1.Follower, req);
        const followings = followingResponse.results;
        delete req.query.followerId;
        req.query.userId = followerId;
        const followersResponse = yield (0, query_1.queryData)(postStateModel_1.Follower, req);
        const followers = followersResponse.results;
        const updatedFollowers = [];
        for (let i = 0; i < followings.length; i++) {
            const el = followings[i];
            for (let x = 0; x < followers.length; x++) {
                const fl = followers[x];
                if (fl.userId === el.followerId) {
                    el.followed = true;
                }
            }
            updatedFollowers.push(el);
        }
        res.status(200).json({
            count: followersResponse.count,
            page: followersResponse.page,
            page_size: followersResponse.page_size,
            results: updatedFollowers,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getFollowings = getFollowings;
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        // const result = await queryData<IFollower>(Follower, req)
        const followersResponse = yield (0, query_1.queryData)(postStateModel_1.Follower, req);
        const followers = followersResponse.results;
        delete req.query.userId;
        req.query.followerId = userId;
        const followingsResponse = yield (0, query_1.queryData)(postStateModel_1.Follower, req);
        const followings = followingsResponse.results;
        const updatedFollowers = [];
        for (let i = 0; i < followers.length; i++) {
            const el = followers[i];
            for (let x = 0; x < followings.length; x++) {
                const fl = followings[x];
                if (fl.userId === el.followerId) {
                    el.followed = true;
                }
            }
            updatedFollowers.push(el);
        }
        res.status(200).json({
            count: followersResponse.count,
            page: followersResponse.page,
            page_size: followersResponse.page_size,
            results: updatedFollowers,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getFollowers = getFollowers;
const getBlockedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(postStateModel_1.Block, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBlockedUsers = getBlockedUsers;
const getMutedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(postStateModel_1.Mute, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getMutedUsers = getMutedUsers;
const getBookMarkedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = String(req.query.myId);
        const bookmarks = yield statModel_1.Bookmark.find({ userId: userId });
        // const followers = await Follower.find({ followerId: followerId });
        const bookmarksPostIds = bookmarks.map((post) => post.postId);
        // delete req.query.myId;
        const mongoQuery = Object.assign(Object.assign({}, req.query), { _id: { in: bookmarksPostIds } });
        req.query = mongoQuery;
        delete req.query.myId;
        const processedPosts = yield processFetchedPosts(req, userId);
        res.status(200).json(processedPosts);
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
            yield user_1.User.updateOne({ _id: post.userId }, {
                $inc: { comments: -1 },
            });
            yield postModel_1.Post.updateOne({ _id: post.postId }, {
                $inc: { replies: -1 },
            });
        }
        else {
            yield user_1.User.updateOne({ _id: post.userId }, {
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
const toggleLikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id } = req.body;
        let updateQuery = {};
        let score = 0;
        const post = yield postModel_1.Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const like = yield statModel_1.Like.findOne({ postId: id, userId });
        if (like) {
            updateQuery.$inc = { likes: -1 };
            yield statModel_1.Like.deleteOne({ postId: id, userId });
            score = post.score - 2;
        }
        else {
            score = (0, computation_1.postScore)('likes', post.score);
            updateQuery.$inc = { likes: 1 };
            yield statModel_1.Like.create({ postId: id, userId });
            const hate = yield statModel_1.Hate.findOne({ postId: id, userId });
            if (hate) {
                updateQuery.$inc.hates = -1;
                yield statModel_1.Hate.deleteOne({ postId: id, userId });
            }
        }
        yield postModel_1.Post.updateOne({ _id: post._id }, {
            $set: { score: score },
        });
        yield postModel_1.Post.findByIdAndUpdate(id, updateQuery, {
            new: true,
        });
        return res.status(200).json({ message: null });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.toggleLikePost = toggleLikePost;
const toggleBookmarkedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id } = req.body;
        let score = 0;
        const post = yield postModel_1.Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'post not found' });
        }
        const save = yield statModel_1.Bookmark.findOne({ postId: id, userId });
        if (save) {
            yield statModel_1.Bookmark.deleteOne({ postId: id, userId });
            score = Math.max(0, post.score - 5);
            yield postModel_1.Post.updateOne({ _id: id }, [
                {
                    $set: {
                        bookmarks: { $max: [{ $subtract: ['$bookmarks', 1] }, 0] },
                        score: score,
                    },
                },
            ]);
        }
        else {
            score = (0, computation_1.postScore)('bookmarks', post.score);
            yield statModel_1.Bookmark.create({ postId: id, userId });
            yield postModel_1.Post.updateOne({ _id: id }, [
                {
                    $set: {
                        bookmarks: { $add: ['$bookmarks', 1] },
                        score: score,
                    },
                },
            ]);
        }
        yield postModel_1.Post.updateOne({ _id: post._id }, {
            $set: { score: score },
        });
        return res.status(200).json({ message: null });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.toggleBookmarkedPosts = toggleBookmarkedPosts;
const updatePostStat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id } = req.body;
        let updateQuery = {};
        let score = 0;
        let liked = false;
        let hated = false;
        let bookmarked = false;
        const post = yield postModel_1.Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
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
                score = post.score - 5;
            }
            else {
                score = (0, computation_1.postScore)('bookmarks', post.score);
                bookmarked = true;
                updateQuery.$inc = { bookmarks: 1 };
                yield statModel_1.Bookmark.create({
                    postId: id,
                    userId: post.userId,
                    bookmarkUserId: userId,
                });
            }
        }
        if (req.body.views !== undefined) {
            score = (0, computation_1.postScore)('views', post.score);
            if (req.body.viewedPostIds) {
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
        yield postModel_1.Post.updateOne({ _id: post._id }, {
            $set: { score: score },
        });
        if (Object.keys(updateQuery).length > 0) {
            yield postModel_1.Post.findByIdAndUpdate(id, updateQuery, {
                new: true,
            });
            return res.status(200).json({ message: null, liked, bookmarked });
        }
        else {
            return res.status(200).json({ message: null, liked, bookmarked });
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
            const score = (0, computation_1.postScore)('views', el.score);
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
    const follows = yield postStateModel_1.Follower.find({ $or: queryConditions }, { userId: 1, _id: 0 });
    const followedUserIds = new Set(follows.map((user) => user.userId));
    posts.map((post) => {
        if (followedUserIds.has(post.userId)) {
            post.followed = true;
        }
        return post;
    });
    const blockedUsers = yield postStateModel_1.Block.find({
        userId: followerId,
        accountUserId: { $in: postUserIds },
    }).select('accountUserId');
    const mutedUsers = yield postStateModel_1.Mute.find({
        userId: followerId,
        accountUserId: { $in: postUserIds },
    }).select('accountUserId');
    const pinnedPosts = yield postStateModel_1.Pin.find({
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
        userId: followerId,
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
        if (blockedPostIds.length > 0 &&
            blockedPostIds.includes(el.userId.toString())) {
            el.blocked = true;
        }
        for (let x = 0; x < polledList.length; x++) {
            const poll = polledList[x];
            if (postIdStr.includes(poll.postId)) {
                el.polls[poll.pollIndex].userId = followerId;
                el.isSelected = true;
            }
        }
        if (likedPostIds && likedPostIds.includes(el._id.toString())) {
            el.liked = true;
        }
        if (bookmarkedPostIds && bookmarkedPostIds.includes(el._id.toString())) {
            el.bookmarked = true;
        }
        if (viewedPostIds && viewedPostIds.includes(el._id.toString())) {
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
const processPosts = (posts, followerId, source) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const postIds = posts.map((post) => post._id);
    const postUserIds = posts.map((post) => post.userId);
    const userIds = [...new Set(posts.map((post) => post.userId))];
    const userObjects = userIds.map((userId) => ({ userId, followerId }));
    const queryConditions = userObjects.map(({ userId, followerId }) => ({
        userId,
        followerId,
    }));
    const follows = yield postStateModel_1.Follower.find({ $or: queryConditions }, { userId: 1, _id: 0 });
    const followedUserIds = new Set(follows.map((user) => user.userId));
    posts.map((post) => {
        if (followedUserIds.has(post.userId)) {
            post.followed = true;
        }
        return post;
    });
    const followedUsers = yield postStateModel_1.Follower.find({
        followerId: followerId,
        userId: { $in: userIds },
    }).select('userId');
    const blockedUsers = yield postStateModel_1.Block.find({
        userId: followerId,
        accountUserId: { $in: postUserIds },
    }).select('accountUserId');
    const mutedUsers = yield postStateModel_1.Mute.find({
        userId: followerId,
        accountUserId: { $in: postUserIds },
    }).select('accountUserId');
    const pinnedPosts = yield postStateModel_1.Pin.find({
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
        userId: followerId,
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
        if (blockedPostIds.length > 0 &&
            blockedPostIds.includes(el.userId.toString())) {
            el.blocked = true;
        }
        for (let x = 0; x < polledList.length; x++) {
            const poll = polledList[x];
            if (postIdStr.includes(poll.postId)) {
                el.polls[poll.pollIndex].userId = followerId;
                el.isSelected = true;
            }
        }
        if (likedPostIds && likedPostIds.includes(el._id.toString())) {
            el.liked = true;
        }
        if (bookmarkedPostIds && bookmarkedPostIds.includes(el._id.toString())) {
            el.bookmarked = true;
        }
        if (viewedPostIds && viewedPostIds.includes(el._id.toString())) {
            el.viewed = true;
        }
        updatedPosts.push(el);
    }
    const pinned = updatedPosts.filter((post) => post.isPinned);
    const unpinned = updatedPosts.filter((post) => !post.isPinned);
    pinned.sort((a, b) => new Date(b.pinnedAt).getTime() - new Date(a.pinnedAt).getTime());
    const finalPosts = [...pinned, ...unpinned];
    const results = source === 'user' ? finalPosts : updatedPosts;
    return results;
});
exports.processPosts = processPosts;
