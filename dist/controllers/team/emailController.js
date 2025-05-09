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
exports.deleteSms = exports.updateSms = exports.getSms = exports.getSmsById = exports.createSms = exports.deleteNotification = exports.updateNotification = exports.getNotifications = exports.getNotificationById = exports.createNotification = exports.deleteEmail = exports.updateEmail = exports.sendEmailToUsers = exports.getEmails = exports.getEmailById = exports.createEmail = void 0;
const emailModel_1 = require("../../models/team/emailModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const userModel_1 = require("../../models/users/userModel");
const sendEmail_1 = require("../../utils/sendEmail");
const createEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, emailModel_1.Email, "Email was created successfully");
});
exports.createEmail = createEmail;
const getEmailById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = yield emailModel_1.Email.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ message: "Email not found" });
        }
        res.status(200).json(email);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getEmailById = getEmailById;
const getEmails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(emailModel_1.Email, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getEmails = getEmails;
const sendEmailToUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersIds = JSON.parse(req.body.usersIds);
        const email = yield emailModel_1.Email.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ message: "Email not found" });
        }
        const users = yield userModel_1.User.find({ _id: { $in: usersIds } });
        let isSuccessful = true;
        for (let i = 0; i < users.length; i++) {
            const el = users[i];
            const isEmailSent = yield (0, sendEmail_1.sendEmail)(String(el.username), el.email, email.name);
            if (isEmailSent !== true) {
                isSuccessful = false;
                break;
            }
        }
        if (isSuccessful) {
            res.status(200).json({
                message: "Email was sent successfully",
                users,
            });
        }
        else {
            res.status(500).json({
                message: "Error, email was not sent successfully",
            });
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.sendEmailToUsers = sendEmailToUsers;
const updateEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = yield emailModel_1.Email.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!email) {
            return res.status(404).json({ message: "Email not found" });
        }
        const item = yield (0, query_1.queryData)(emailModel_1.Email, req);
        const { page, page_size, count, results } = item;
        res.status(200).json({
            message: "Email was updated successfully",
            results,
            count,
            page,
            page_size,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateEmail = updateEmail;
const deleteEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = yield emailModel_1.Email.findByIdAndDelete(req.params.id);
        if (!email) {
            return res.status(404).json({ message: "Email not found" });
        }
        res.status(200).json({ message: "Email deleted successfully" });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteEmail = deleteEmail;
//-----------------NOTIFICATION--------------------//
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, emailModel_1.Notification, "Notification was created successfully");
});
exports.createNotification = createNotification;
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
//-----------------SMS--------------------//
const createSms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, emailModel_1.Sms, "Sms was created successfully");
});
exports.createSms = createSms;
const getSmsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield emailModel_1.Sms.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Sms not found" });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSmsById = getSmsById;
const getSms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(emailModel_1.Sms, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSms = getSms;
const updateSms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, emailModel_1.Sms, [], ["Sms not found", "Sms was updated successfully"]);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateSms = updateSms;
const deleteSms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, emailModel_1.Sms, [], "Sms not found");
});
exports.deleteSms = deleteSms;
