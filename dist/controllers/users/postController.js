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
exports.deletePost = exports.updatePost = exports.getComments = exports.getPosts = exports.getPostById = exports.createPost = exports.deleteAccount = exports.updateAccount = exports.getAccounts = exports.getAccountById = exports.createAccount = void 0;
const postModel_1 = require("../../models/users/postModel");
const fileUpload_1 = require("../../utils/fileUpload");
const errorHandler_1 = require("../../utils/errorHandler");
const userModel_1 = require("../../models/users/userModel");
const query_1 = require("../../utils/query");
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const { username, displayName, description, picture, followingsId, interests, userId, } = req.body;
        const account = yield postModel_1.Account.create({
            username,
            userId,
            displayName,
            picture,
            description,
        });
        const user = yield userModel_1.User.findByIdAndUpdate(userId, {
            picture: picture,
            displayName: displayName,
            isFirstTime: false,
            username: username,
            interests: interests,
        }, { new: true });
        yield postModel_1.Follower.create({
            userId: account._id,
            followingId: followingsId,
        });
        console.log(user);
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
        // const postType = data.type;
        const form = {
            picture: sender.picture,
            username: sender.username,
            displayName: sender.displayName,
            userId: sender._id,
            postId: data.postId,
            postType: data.postType,
            content: data.content,
            createdAt: data.createdAt,
            media: data.media,
            isVerified: sender.isVerified,
        };
        const post = yield postModel_1.Post.create(form);
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
    (0, query_1.getItems)(req, res, postModel_1.Post);
});
exports.getPosts = getPosts;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItems)(req, res, postModel_1.Comment);
});
exports.getComments = getComments;
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
