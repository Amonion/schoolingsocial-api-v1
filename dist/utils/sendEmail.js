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
exports.sendNotification = void 0;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = require("fs");
const emailModel_1 = require("../models/team/emailModel");
const companyModel_1 = require("../models/team/companyModel");
function sendEmail(username, userEmail, emailName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const templatePath = "emailTemplate.html";
            if (!(yield fs_1.promises.stat(templatePath).catch(() => false))) {
                throw new Error(`Template file "${templatePath}" not found`);
            }
            let templateContent = yield fs_1.promises.readFile(templatePath, "utf-8");
            const email = yield emailModel_1.Email.findOne({ name: emailName });
            const results = yield companyModel_1.Company.find();
            const company = results[0];
            templateContent = templateContent.replace("{{username}}", username);
            templateContent = templateContent.replace("{{greetings}}", String(email === null || email === void 0 ? void 0 : email.greetings));
            templateContent = templateContent.replace("{{logo}}", `${company === null || company === void 0 ? void 0 : company.domain}/images/logos/SchoolingLogo.png`);
            templateContent = templateContent.replace("{{whiteLogo}}", `${company === null || company === void 0 ? void 0 : company.domain}/images/logos/WhiteSchoolingLogo.png`);
            // Create a nodemailer transporter
            const transporter = nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || "465"),
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: company.email,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            const mailOptions = {
                from: `"Your App Name" <${process.env.EMAIL_USERNAME}>`,
                to: userEmail,
                subject: "Your Subject Here",
                html: templateContent,
            };
            yield transporter.sendMail(mailOptions);
            console.log(`Email sent to ${email}`);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error sending email:", {
                    message: error.message,
                    stack: error.stack,
                    user: userEmail,
                });
            }
            else {
                console.error("Unknown error occurred:", error);
            }
            throw error;
        }
    });
}
const sendNotification = (templateName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationTemp = yield emailModel_1.Notification.findOne({
        name: templateName,
    });
    const notification = {
        greetings: notificationTemp === null || notificationTemp === void 0 ? void 0 : notificationTemp.greetings,
        name: notificationTemp === null || notificationTemp === void 0 ? void 0 : notificationTemp.name,
        title: notificationTemp === null || notificationTemp === void 0 ? void 0 : notificationTemp.title,
        username: data.receiverUsername,
        userId: data.userId,
        content: notificationTemp === null || notificationTemp === void 0 ? void 0 : notificationTemp.content.replace("{{sender_username}}", data.username).replace("{{click_here}}", `<a href="/home/friends/chat/${data.username}" class="text-[var(--custom)]">click here</a>`),
    };
    const newNotification = yield emailModel_1.UserNotification.create(notification);
    const count = yield emailModel_1.UserNotification.countDocuments({
        username: data.receiverUsername,
        unread: true,
    });
    return { data: newNotification, count: count };
});
exports.sendNotification = sendNotification;
