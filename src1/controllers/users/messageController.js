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
exports.readNotifications = exports.updateNotification = exports.getNotifications = exports.createUser = void 0;
const userModel_1 = require("../../models/users/userModel");
const userInfoModel_1 = require("../../models/users/userInfoModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
        const usernames = String(req.query.usernames || "").split(",");
        const result = yield (0, query_1.queryData)(emailModel_1.UserNotification, req);
        const unread = yield emailModel_1.UserNotification.countDocuments({
            username: { $in: usernames },
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
        const notifications = JSON.parse(req.body.notifications);
        const ids = notifications.map((doc) => doc._id);
        yield emailModel_1.UserNotification.updateMany({ _id: { $in: ids } }, { $set: { unread: false } });
        const updatedNotifications = yield emailModel_1.UserNotification.find({
            _id: { $in: ids },
        });
        const unread = yield emailModel_1.UserNotification.countDocuments({
            username: req.params.username,
            unread: true,
        });
        res.status(200).json({
            results: updatedNotifications,
            uread: unread,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateNotification = updateNotification;
const readNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = JSON.parse(req.body.ids);
        const usernames = String(req.query.usernames || "").split(",");
        yield emailModel_1.UserNotification.updateMany({ _id: { $in: ids } }, { $set: { unread: false } });
        const unread = yield emailModel_1.UserNotification.countDocuments({
            username: { $in: usernames },
            unread: true,
        });
        res.status(200).json({
            results: ids,
            uread: unread,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.readNotifications = readNotifications;
