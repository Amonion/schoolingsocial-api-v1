"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const emailController_1 = require("../../controllers/team/emailController");
const notificationController_1 = require("../../controllers/team/notificationController");
const router = express_1.default.Router();
router.route('/').get(emailController_1.getEmails).post(upload.any(), emailController_1.createEmail);
router
    .route('/push-notification')
    .post(upload.any(), notificationController_1.setPushNotificationToken)
    .patch(upload.any(), notificationController_1.sendPushNotification);
router.route('/sms').get(emailController_1.getSms).post(upload.any(), emailController_1.createSms);
router.route('/send/:id').post(upload.any(), emailController_1.sendEmailToUsers);
router
    .route('/notifications')
    .get(emailController_1.getNotifications)
    .post(upload.any(), emailController_1.createNotification);
router
    .route('/sms/:id')
    .get(emailController_1.getSmsById)
    .patch(upload.any(), emailController_1.updateSms)
    .delete(emailController_1.deleteSms);
router
    .route('/notifications/:id')
    .get(emailController_1.getNotificationById)
    .patch(upload.any(), emailController_1.updateNotification)
    .delete(emailController_1.deleteNotification);
router
    .route('/:id')
    .get(emailController_1.getEmailById)
    .patch(upload.any(), emailController_1.updateEmail)
    .delete(emailController_1.deleteEmail);
exports.default = router;
