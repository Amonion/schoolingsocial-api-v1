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
exports.sendPushNotification = exports.setPushNotificationToken = exports.readSocialNotifications = exports.getSocialNotification = exports.getSocialNotifications = exports.readPersonalNotifications = exports.getPersonalNotification = exports.getPersonalNotifications = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const expo_server_sdk_1 = require("expo-server-sdk");
const personalNotificationModel_1 = require("../../models/message/personalNotificationModel");
const notificationTemplateModel_1 = require("../../models/message/notificationTemplateModel");
const query_1 = require("../../utils/query");
const socialNotificationModel_1 = require("../../models/message/socialNotificationModel");
const bioUser_1 = require("../../models/users/bioUser");
const expo = new expo_server_sdk_1.Expo();
const getPersonalNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(personalNotificationModel_1.PersonalNotification, req);
        const unread = yield personalNotificationModel_1.PersonalNotification.countDocuments({
            receiverUsername: req.query.receiverUsername,
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
exports.getPersonalNotifications = getPersonalNotifications;
const getPersonalNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield personalNotificationModel_1.PersonalNotification.findById(req.params.id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPersonalNotification = getPersonalNotification;
const readPersonalNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = JSON.parse(req.body.ids);
        const username = req.query.username;
        yield personalNotificationModel_1.PersonalNotification.updateMany({ _id: { $in: ids } }, { $set: { unread: false } });
        const unread = yield personalNotificationModel_1.PersonalNotification.countDocuments({
            receiverUsername: username,
            unread: true,
        });
        res.status(200).json({
            unread: unread,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.readPersonalNotifications = readPersonalNotifications;
const getSocialNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(socialNotificationModel_1.SocialNotification, req);
        const unreadSocials = yield socialNotificationModel_1.SocialNotification.countDocuments({
            receiverUsername: req.query.receiverUsername,
            unread: true,
        });
        res.status(200).json({
            page: result.page,
            results: result.results,
            count: result.count,
            unreadSocials,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSocialNotifications = getSocialNotifications;
const getSocialNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield socialNotificationModel_1.SocialNotification.findById(req.params.id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSocialNotification = getSocialNotification;
const readSocialNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = JSON.parse(req.body.ids);
        const username = req.query.username;
        yield socialNotificationModel_1.SocialNotification.updateMany({ _id: { $in: ids } }, { $set: { unread: false } });
        const unread = yield socialNotificationModel_1.SocialNotification.countDocuments({
            receiverUsername: username,
            unread: true,
        });
        res.status(200).json({
            unread: unread,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.readSocialNotifications = readSocialNotifications;
const setPushNotificationToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, id } = req.body;
    if (!expo_server_sdk_1.Expo.isExpoPushToken(token)) {
        return res.status(400).send({ error: 'Invalid Expo push token' });
    }
    try {
        yield bioUser_1.BioUser.findByIdAndUpdate(id, { notificationToken: token }, { new: true });
        res.send({ success: true });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.setPushNotificationToken = setPushNotificationToken;
const sendPushNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { notificationId, token } = req.body;
    // const user = await UserInfo.findById(userId)
    const item = yield notificationTemplateModel_1.NotificationTemplate.findById(notificationId);
    const cleanContent = (_a = item === null || item === void 0 ? void 0 : item.content) === null || _a === void 0 ? void 0 : _a.replace(/<[^>]*>?/gm, '').trim();
    const messages = [
        {
            to: token,
            sound: 'default',
            title: item === null || item === void 0 ? void 0 : item.title,
            body: cleanContent,
            data: { type: 'notifications', screen: '/home/notifications' },
        },
    ];
    try {
        yield expo.sendPushNotificationsAsync(messages);
        res.send({ success: true });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.sendPushNotification = sendPushNotification;
