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
exports.toggleHateComment = exports.toggleLikeComment = exports.processComment = exports.getComments = exports.createComment = void 0;
const postModel_1 = require("../../models/post/postModel");
const fileUpload_1 = require("../../utils/fileUpload");
const errorHandler_1 = require("../../utils/errorHandler");
const statModel_1 = require("../../models/users/statModel");
const computation_1 = require("../../utils/computation");
const user_1 = require("../../models/users/user");
const query_1 = require("../../utils/query");
const newsModel_1 = require("../../models/place/newsModel");
const commentModel_1 = require("../../models/post/commentModel");
/////////////////////////////// POST /////////////////////////////////
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = req.body.sender;
        const data = Object.assign({}, req.body);
        if (data._id) {
            delete data._id;
        }
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const form = {
            picture: sender.picture,
            username: sender.username,
            displayName: sender.displayName,
            users: data.users,
            replyTo: data.replyTo,
            uniqueId: data.uniqueId,
            userId: sender._id,
            postId: data.postId,
            level: data.level,
            replyToId: data.replyToId,
            content: data.content,
            createdAt: data.createdAt,
            commentMedia: req.body.commentMedia,
            score: 0.5,
            status: data.status,
            isVerified: sender.isVerified,
        };
        if (data.commentSource && data.commentSource === 'news') {
            const news = yield newsModel_1.News.findById(data.postId);
            const score = (0, computation_1.postScore)('comments', news.score);
            if (data.replyToId) {
                yield newsModel_1.News.updateOne({ _id: data.replyToId }, {
                    $inc: { replies: 1, score: 3 },
                });
            }
            else if (data.replyToId !== data.postId) {
                yield newsModel_1.News.findByIdAndUpdate(data.postId, {
                    $inc: { replies: 1 },
                    $set: { score: score },
                });
            }
        }
        else {
            const post = yield postModel_1.Post.findById(data.postId);
            const score = (0, computation_1.postScore)('comments', post.score);
            if (data.replyToId) {
                yield postModel_1.Post.updateOne({ _id: data.replyToId }, {
                    $inc: { replies: 1, score: 3 },
                });
            }
            else if (data.replyToId !== data.postId) {
                yield postModel_1.Post.findByIdAndUpdate(data.postId, {
                    $inc: { replies: 1 },
                    $set: { score: score },
                });
            }
            yield statModel_1.View.create({
                postId: post._id,
                userId: sender._id,
            });
        }
        const comment = yield commentModel_1.Comment.create(form);
        yield user_1.User.updateOne({ _id: sender._id }, {
            $inc: { comments: 1 },
        });
        res.status(200).json({
            data: comment,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createComment = createComment;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerId = String(req.query.myId);
        delete req.query.myId;
        const response = yield (0, query_1.queryData)(commentModel_1.Comment, req);
        const results = yield (0, exports.processComment)(response.results, followerId);
        res.status(200).json({ results, count: response.count });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getComments = getComments;
const processComment = (comments, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const commentsIds = comments.map((item) => item._id);
    const likedComments = yield statModel_1.Like.find({
        userId: userId,
        postId: { $in: commentsIds },
    }).select('postId');
    const hatedComments = yield statModel_1.Hate.find({
        userId: userId,
        postId: { $in: commentsIds },
    }).select('postId');
    const likedCommentIds = likedComments.map((like) => like.postId.toString());
    const hatedCommentIds = hatedComments.map((like) => like.postId.toString());
    const updateComments = [];
    for (let i = 0; i < comments.length; i++) {
        const el = comments[i];
        if (likedCommentIds && likedCommentIds.includes(el._id.toString())) {
            el.liked = true;
        }
        if (hatedCommentIds && hatedCommentIds.includes(el._id.toString())) {
            el.liked = true;
        }
        updateComments.push(el);
    }
    const results = updateComments;
    return results;
});
exports.processComment = processComment;
const toggleLikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id } = req.body;
        let updateQuery = {};
        let score = 0;
        const comment = yield commentModel_1.Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'comment not found' });
        }
        const like = yield statModel_1.Like.findOne({ postId: id, userId });
        if (like) {
            updateQuery.$inc = { likes: -1 };
            yield statModel_1.Like.deleteOne({ postId: id, userId });
            score = comment.score - 2;
        }
        else {
            score = (0, computation_1.postScore)('likes', comment.score);
            updateQuery.$inc = { likes: 1 };
            yield statModel_1.Like.create({ postId: id, userId });
            const hate = yield statModel_1.Hate.findOne({ postId: id, userId });
            if (hate) {
                updateQuery.$inc.hates = -1;
                yield statModel_1.Hate.deleteOne({ postId: id, userId });
            }
        }
        yield commentModel_1.Comment.findByIdAndUpdate(comment._id, {
            $set: { score: score },
        });
        yield commentModel_1.Comment.findByIdAndUpdate(id, updateQuery, {
            new: true,
        });
        return res.status(200).json({ message: null });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.toggleLikeComment = toggleLikeComment;
const toggleHateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id } = req.body;
        let updateQuery = { $inc: {}, $set: {} };
        let score = 0;
        const comment = yield commentModel_1.Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'comment not found' });
        }
        const hate = yield statModel_1.Hate.findOne({ postId: id, userId });
        if (hate) {
            // Remove hate
            updateQuery.$inc.hates = -1;
            yield statModel_1.Hate.deleteOne({ postId: id, userId });
            score = comment.score - 2;
        }
        else {
            // Add hate
            score = (0, computation_1.postScore)('hates', comment.score);
            updateQuery.$inc.hates = 1;
            yield statModel_1.Hate.create({ postId: id, userId });
            // Remove like if exists
            const like = yield statModel_1.Like.findOne({ postId: id, userId });
            if (like) {
                updateQuery.$inc.likes = -1;
                yield statModel_1.Like.deleteOne({ postId: id, userId });
            }
        }
        // Merge score into one update query
        updateQuery.$set.score = score;
        yield commentModel_1.Comment.findByIdAndUpdate(id, updateQuery, { new: true });
        return res.status(200).json({ message: null });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.toggleHateComment = toggleHateComment;
