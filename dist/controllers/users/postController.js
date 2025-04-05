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
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = exports.getPostStat = exports.updatePostStat = exports.deletePost = exports.updatePost = exports.getPosts = exports.getPostById = exports.createPost = exports.deleteAccount = exports.updateAccount = exports.getAccounts = exports.getAccountById = exports.createAccount = void 0;
const postModel_1 = require("../../models/users/postModel");
const fileUpload_1 = require("../../utils/fileUpload");
const errorHandler_1 = require("../../utils/errorHandler");
const userModel_1 = require("../../models/users/userModel");
const query_1 = require("../../utils/query");
const statModel_1 = require("../../models/users/statModel");
const computation_1 = require("../../utils/computation");
const userInfoModel_1 = require("../../models/users/userInfoModel");
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
        yield userInfoModel_1.UserInfo.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user.userId, {
            picture: picture,
            displayName: displayName,
            username: username,
            intro: description,
        }, { new: true });
        if (!user) {
            throw new Error("User not found");
        }
        yield postModel_1.Follower.create({
            userId: user._id,
            followingId: followingsId,
        });
        res.status(201).json({
            message: "Account created successfully",
            user: user,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createAccount = createAccount;
const getAccountById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItemById)(req, res, postModel_1.Account, "Account was not found");
});
exports.getAccountById = getAccountById;
const getAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItems)(req, res, postModel_1.Account);
});
exports.getAccounts = getAccounts;
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.updateItem)(req, res, postModel_1.Account, ["picture", "media"], ["Account not found", "Account was updated successfully"]);
});
exports.updateAccount = updateAccount;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = yield postModel_1.Account.findByIdAndDelete(req.params.id);
        if (!email) {
            return res.status(404).json({ message: "Email not found" });
        }
        res.status(200).json({ message: "Email deleted successfully" });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteAccount = deleteAccount;
/////////////////////////////// POST /////////////////////////////////
const createPost = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = data.sender;
        const form = {
            picture: sender.picture,
            username: sender.username,
            displayName: sender.displayName,
            polls: data.polls,
            userId: sender._id,
            postId: data.postId,
            postType: data.postType,
            content: data.content,
            createdAt: data.createdAt,
            media: data.media,
            isVerified: sender.isVerified,
        };
        const post = yield postModel_1.Post.create(form);
        if (data.postType === "comment") {
            yield userModel_1.User.updateOne({ _id: sender._id }, {
                $inc: { comments: 1 },
            });
            yield postModel_1.Post.updateOne({ _id: data.postId }, {
                $inc: { replies: 1 },
                $push: { users: sender.username },
            });
        }
        else {
            yield statModel_1.View.create({
                postId: post._id,
                userId: sender._id,
            });
            yield userModel_1.User.updateOne({ _id: sender._id }, {
                $inc: { posts: 1 },
            });
            const score = (0, computation_1.postScore)(post.likes, post.replies, post.shares, post.bookmarks, post.views);
            yield postModel_1.Post.updateOne({ _id: post._id }, {
                $inc: { score: score },
                $push: { users: sender.username },
            });
        }
        return {
            message: "Your post was created successfully",
            data: post,
        };
    }
    catch (error) {
        console.log(error);
    }
});
exports.createPost = createPost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItemById)(req, res, postModel_1.Post, "Post not found");
});
exports.getPostById = getPostById;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerId = String(req.query.myId);
        req.query.myId = undefined;
        const response = yield (0, query_1.queryData)(postModel_1.Post, req);
        const posts = response.results;
        const postIds = posts.map((post) => post._id);
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
        const likedPosts = yield statModel_1.Like.find({
            userId: followerId,
            postId: { $in: postIds },
        }).select("postId");
        const bookmarkedPosts = yield statModel_1.Bookmark.find({
            userId: followerId,
            postId: { $in: postIds },
        }).select("postId");
        const viewedPosts = yield statModel_1.View.find({
            userId: followerId,
            postId: { $in: postIds },
        }).select("postId");
        const likedPostIds = likedPosts.map((like) => like.postId.toString());
        const bookmarkedPostIds = bookmarkedPosts.map((bookmark) => bookmark.postId.toString());
        const viewedPostIds = viewedPosts.map((view) => view.postId.toString());
        const updatedPosts = [];
        for (let i = 0; i < posts.length; i++) {
            const el = posts[i];
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
        res.status(200).json({
            count: response.count,
            page: response.page,
            page_size: response.page_size,
            results: updatedPosts,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPosts = getPosts;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const post = yield postModel_1.Post.findByIdAndUpdate(req.params.id, req.body);
        res.status(201).json({
            message: "Your post was updated successfully",
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
            return res.status(404).json({ message: "This post has been deleted" });
        }
        if (post.media.length > 0) {
            for (let i = 0; i < post.media.length; i++) {
                const el = post.media[i];
                (0, fileUpload_1.deleteFileFromS3)(el.source);
            }
        }
        if (post.postType === "comment") {
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
            message: "Post is deleted successfully",
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
            return res.status(404).json({ message: "Post not found" });
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
            const bookmark = yield statModel_1.Bookmark.findOne({ postId: id, userId });
            if (bookmark) {
                updateQuery.$inc = { bookmarks: -1 };
                yield statModel_1.Bookmark.deleteOne({ postId: id, userId });
            }
            else {
                updateQuery.$inc = { bookmarks: 1 };
                yield statModel_1.Bookmark.create({ postId: id, userId });
            }
        }
        if (req.body.views !== undefined) {
            const post = yield statModel_1.View.findOne({ userId: userId, postId: id });
            if (!post) {
                updateQuery.$inc = { views: 1 };
                yield statModel_1.View.create({ userId: userId, postId: id });
            }
        }
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
//-----------------FOLLOW USER--------------------//
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { follow, message } = yield (0, query_1.followAccount)(req, res);
        const post = req.body.post;
        post.isFollowed = follow ? false : true;
        post.isActive = false;
        res.status(200).json({
            message: message,
            data: post,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.followUser = followUser;
