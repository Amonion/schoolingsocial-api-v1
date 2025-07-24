import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getEmailById,
  getEmails,
  updateEmail,
  deleteEmail,
  createEmail,
  getNotificationById,
  getNotifications,
  updateNotification,
  deleteNotification,
  createNotification,
  getSmsById,
  getSms,
  updateSms,
  deleteSms,
  createSms,
  sendEmailToUsers,
} from '../../controllers/team/emailController'
import {
  sendPushNotification,
  setPushNotificationToken,
} from '../../controllers/team/notificationController'

const router = express.Router()

router.route('/').get(getEmails).post(upload.any(), createEmail)
router
  .route('/push-notification')
  .post(upload.any(), setPushNotificationToken)
  .patch(upload.any(), sendPushNotification)
router.route('/sms').get(getSms).post(upload.any(), createSms)
router.route('/send/:id').post(upload.any(), sendEmailToUsers)
router
  .route('/notifications')
  .get(getNotifications)
  .post(upload.any(), createNotification)

router
  .route('/sms/:id')
  .get(getSmsById)
  .patch(upload.any(), updateSms)
  .delete(deleteSms)

router
  .route('/notifications/:id')
  .get(getNotificationById)
  .patch(upload.any(), updateNotification)
  .delete(deleteNotification)

router
  .route('/:id')
  .get(getEmailById)
  .patch(upload.any(), updateEmail)
  .delete(deleteEmail)

export default router
