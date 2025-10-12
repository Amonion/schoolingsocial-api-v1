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
exports.getComments = exports.createComment = void 0;
const postModel_1 = require("../../models/post/postModel");
const fileUpload_1 = require("../../utils/fileUpload");
const errorHandler_1 = require("../../utils/errorHandler");
const statModel_1 = require("../../models/users/statModel");
const computation_1 = require("../../utils/computation");
const user_1 = require("../../models/users/user");
const query_1 = require("../../utils/query");
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
            polls: data.polls,
            users: data.users,
            replyTo: data.replyTo,
            uniqueId: data.uniqueId,
            userId: sender._id,
            postId: data.postId,
            level: data.level,
            replyToId: data.replyToId,
            postType: 'comment',
            content: data.content,
            createdAt: data.createdAt,
            commentMedia: req.body.commentMedia,
            score: 0.5,
            status: data.status,
            isVerified: sender.isVerified,
        };
        const post = yield postModel_1.Post.findById(data.postId);
        const comment = yield postModel_1.Post.create(form);
        yield user_1.User.updateOne({ _id: sender._id }, {
            $inc: { comments: 1 },
        });
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
        const followerId = req.query.myId;
        delete req.query.myId;
        const result = yield (0, query_1.queryData)(postModel_1.Post, req);
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getComments = getComments;
