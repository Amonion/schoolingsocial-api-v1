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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.getNotifications = exports.createUser = void 0;
const userModel_1 = require("../../models/users/userModel");
const userInfoModel_1 = require("../../models/users/userInfoModel");
const staffModel_1 = require("../../models/team/staffModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const postModel_1 = require("../../models/users/postModel");
const emailModel_1 = require("../../models/team/emailModel");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone, signupIp, password } = req.body;
        const userBio = new userInfoModel_1.UserInfo({ email, phone, signupIp });
        yield userBio.save();
        const newUser = new userModel_1.User({
            userId: userBio._id,
            email,
            phone,
            signupIp,
            password: yield bcryptjs_1.default.hash(password, 10),
        });
        yield newUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createUser = createUser;
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(emailModel_1.UserNotification, req);
        const unread = yield emailModel_1.UserNotification.countDocuments({
            username: req.query.username,
            unread: true,
        });
        res.status(200).json({
            page: result.page,
            page_size: result.page_size,
            results: result.results,
            count: result.count,
            unread: unread,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getNotifications = getNotifications;
const updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const user = yield userModel_1.User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.body.picture) {
            yield postModel_1.Post.updateMany({ userId: req.params.id }, { picture: req.body.picture });
        }
        if (req.body.isStaff) {
            const staff = yield staffModel_1.Staff.findOne({ userId: req.params.id });
            if (staff) {
                yield staffModel_1.Staff.findOneAndUpdate({ userId: req.body.id }, req.body);
            }
            else {
                yield staffModel_1.Staff.create(req.body);
            }
            const result = yield (0, query_1.queryData)(userModel_1.User, req);
            const { page, page_size, count, results } = result;
            res.status(200).json({
                message: "User was updated successfully",
                results,
                count,
                page,
                page_size,
            });
        }
        else if (req.body.media || req.body.picture || req.body.intro) {
            res.status(200).json({
                message: "Your profile was updated successfully",
                data: user,
            });
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateNotification = updateNotification;
