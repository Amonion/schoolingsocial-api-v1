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
exports.sendPersonalNotification = exports.sendSocialNotification = void 0;
const personalNotificationModel_1 = require("../models/message/personalNotificationModel");
const notificationTemplateModel_1 = require("../models/message/notificationTemplateModel");
const socialNotificationModel_1 = require("../models/message/socialNotificationModel");
const sendSocialNotification = (templateName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationTemp = yield notificationTemplateModel_1.NotificationTemplate.findOne({
        name: templateName,
    });
    if (!notificationTemp) {
        throw new Error(`Notification template '${templateName}' not found.`);
    }
    const click_here = templateName === 'friend_request'
        ? `<a href="/friends/chat/${data.senderUsername}" class="text-[var(--custom)]">click here</a>`
        : '';
    const content = notificationTemp.content
        .replace('{{receiver_name}}', data.receiverName)
        .replace('{{receiverer_username}}', data.receiverUsername)
        .replace('{{sender_username}}', data.senderUsername)
        .replace('{{sender_name}}', data.senderName)
        .replace('{{gender}}', data.gender)
        .replace('{{school}}', data.str1)
        .replace('{{click_here}}', click_here)
        .replace('{{content}}', data.content);
    const socialNotification = yield socialNotificationModel_1.SocialNotification.create({
        greetings: notificationTemp.greetings,
        name: notificationTemp.name,
        title: notificationTemp.title,
        senderUsername: data.senderUsername,
        receiverUsername: data.receiverUsername,
        senderName: data.senderName,
        receiverName: data.receiverName,
        senderPicture: data.senderPicture,
        unread: true,
        receiverPicture: data.receiverPicture,
        content,
    });
    const unreadNotifications = yield socialNotificationModel_1.SocialNotification.countDocuments({
        receiverUsername: data.receiverUsername,
        unread: true,
    });
    return { socialNotification, unreadNotifications };
});
exports.sendSocialNotification = sendSocialNotification;
const sendPersonalNotification = (templateName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationTemp = yield notificationTemplateModel_1.NotificationTemplate.findOne({
        name: templateName,
    });
    if (!notificationTemp) {
        throw new Error(`Notification template '${templateName}' not found.`);
    }
    const click_here = templateName === 'friend_request'
        ? `<a href="/home/chat/${data.from}/${data.senderUsername}" class="text-[var(--custom)]">click here</a>`
        : '';
    const content = notificationTemp.content
        .replace('{{sender_username}}', data.senderUsername)
        .replace('{{receiver_username}}', data.receiverUsername)
        .replace('{{school}}', data.str1)
        .replace('{{click_here}}', click_here);
    const notification = yield personalNotificationModel_1.PersonalNotification.create({
        greetings: notificationTemp.greetings,
        name: notificationTemp.name,
        title: notificationTemp.title,
        senderUsername: data.senderUsername,
        receiverUsername: data.receiverUsername,
        senderName: data.senderName,
        receiverName: data.receiverName,
        senderPicture: data.senderPicture,
        receiverPicture: data.receiverPicture,
        content,
    });
    const count = yield personalNotificationModel_1.PersonalNotification.countDocuments({
        receiverUsername: data.receiverUsername,
        unread: true,
    });
    return { personalNotification: notification, count };
});
exports.sendPersonalNotification = sendPersonalNotification;
