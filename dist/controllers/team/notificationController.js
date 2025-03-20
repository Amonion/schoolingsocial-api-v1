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
exports.deleteNotification = exports.updateNotification = exports.getNotifications = exports.getNotificationById = exports.ReadNotification = exports.getNotificationCounts = exports.createVerificationNotification = exports.routeNotification = void 0;
const emailModel_1 = require("../../models/team/emailModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const routeNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    switch (data.action) {
        case "verification":
            return (0, exports.createVerificationNotification)(data);
            break;
        case "get-notifications":
            return (0, exports.getNotificationCounts)(data);
            break;
        case "read-notifications":
            return (0, exports.ReadNotification)(data);
            break;
        default:
            break;
    }
    //   createItem(req, res, Email, "Email was created successfully");
});
exports.routeNotification = routeNotification;
//-----------------NOTIFICATION--------------------//
const createVerificationNotification = (item) => __awaiter(void 0, void 0, void 0, function* () {
    const user = item.user;
    if (user &&
        user.isBio &&
        user.isContact &&
        user.isDocument &&
        user.isRelated &&
        user.isOrigin &&
        user.isAccountSet &&
        user.isEducation &&
        user.isEducationDocument &&
        user.isEducationHistory) {
        const noteTemp = yield emailModel_1.Notification.findOne({ name: item.action });
        yield emailModel_1.UserNotification.create({
            userId: item.user._id,
            username: item.user.username,
            name: noteTemp === null || noteTemp === void 0 ? void 0 : noteTemp.name,
            content: noteTemp === null || noteTemp === void 0 ? void 0 : noteTemp.content,
            greetings: noteTemp === null || noteTemp === void 0 ? void 0 : noteTemp.greetings,
            title: noteTemp === null || noteTemp === void 0 ? void 0 : noteTemp.title,
            createdAt: item.time,
        });
    }
    return (0, exports.getNotificationCounts)(item);
});
exports.createVerificationNotification = createVerificationNotification;
const getNotificationCounts = (item) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield emailModel_1.UserNotification.countDocuments({
        username: item.user.username,
        unread: true,
    });
    return { count };
});
exports.getNotificationCounts = getNotificationCounts;
const ReadNotification = (item) => __awaiter(void 0, void 0, void 0, function* () {
    yield emailModel_1.UserNotification.updateMany({ _id: { $in: item.data.map((el) => el._id) } }, { $set: { unread: false } });
    return (0, exports.getNotificationCounts)(item);
});
exports.ReadNotification = ReadNotification;
const getNotificationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield emailModel_1.Notification.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getNotificationById = getNotificationById;
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(emailModel_1.Notification, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getNotifications = getNotifications;
const updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, emailModel_1.Notification, [], ["Notification not found", "Notification was updated successfully"]);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateNotification = updateNotification;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, emailModel_1.Notification, [], "Notification not found");
});
exports.deleteNotification = deleteNotification;
