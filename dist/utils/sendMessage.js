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
exports.sendPersonalMessage = exports.sendOfficialMessageById = exports.sendOfficialMessage = void 0;
const notificationTemplateModel_1 = require("../models/message/notificationTemplateModel");
const officialMessageModel_1 = require("../models/message/officialMessageModel");
const personalMessageModel_1 = require("../models/message/personalMessageModel");
const sendOfficialMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield officialMessageModel_1.OfficialMessage.create(data);
    const senderCount = yield officialMessageModel_1.OfficialMessage.countDocuments({
        receiverUsername: data.senderUsername,
        unread: true,
    });
    const receiverCount = yield officialMessageModel_1.OfficialMessage.countDocuments({
        receiverUsername: data.receiverUsername,
        unread: true,
    });
    return { officialMessage: message, receiverCount, senderCount };
});
exports.sendOfficialMessage = sendOfficialMessage;
const sendOfficialMessageById = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationTemp = yield notificationTemplateModel_1.NotificationTemplate.findById(data.templateId);
    if (!notificationTemp) {
        throw new Error(`Notification template not found.`);
    }
    const message = yield officialMessageModel_1.OfficialMessage.create({
        greetings: notificationTemp.greetings,
        name: notificationTemp.name,
        title: notificationTemp.title,
        senderUsername: data.senderUsername,
        receiverUsername: data.receiverUsername,
        senderName: data.senderName,
        receiverName: data.receiverName,
        senderPicture: data.senderPicture,
        receiverPicture: data.senderPicture,
        senderAddress: data.senderAddress,
        senderArea: data.senderArea,
        senderState: data.senderState,
        senderCountry: data.senderCountry,
        receiverAddress: data.receiverAddress,
        receiverArea: data.receiverArea,
        receiverState: data.receiverState,
        receiverCountry: data.receiverCountry,
        unread: true,
        content: notificationTemp.content,
    });
    const senderCount = yield officialMessageModel_1.OfficialMessage.countDocuments({
        senderUsername: data.senderUsername,
        unread: true,
    });
    const receiverCount = yield officialMessageModel_1.OfficialMessage.countDocuments({
        receiverUsername: data.receiverUsername,
        unread: true,
    });
    return { officialMessage: message, receiverCount, senderCount };
});
exports.sendOfficialMessageById = sendOfficialMessageById;
const sendPersonalMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield personalMessageModel_1.PersonalMessage.create({
        type: data.type,
        title: data.title,
        senderUsername: data.senderUsername,
        receiverUsername: data.receiverUsername,
        senderName: data.senderName,
        receiverName: data.receiverName,
        senderPicture: data.senderPicture,
        receiverPicture: data.senderPicture,
        senderAddress: data.senderAddress,
        senderArea: data.senderArea,
        senderState: data.senderState,
        senderCountry: data.senderCountry,
        receiverAddress: data.receiverAddress,
        receiverArea: data.receiverArea,
        receiverState: data.receiverState,
        receiverCountry: data.receiverCountry,
        unread: true,
        content: data.content,
    });
    const senderCount = yield personalMessageModel_1.PersonalMessage.countDocuments({
        senderUsername: data.senderUsername,
        unread: true,
    });
    const receiverCount = yield personalMessageModel_1.PersonalMessage.countDocuments({
        receiverUsername: data.receiverUsername,
        unread: true,
    });
    return { personalMessage: message, receiverCount, senderCount };
});
exports.sendPersonalMessage = sendPersonalMessage;
