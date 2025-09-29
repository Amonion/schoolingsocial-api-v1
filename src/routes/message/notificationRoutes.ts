import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getPersonalNotification,
  getPersonalNotifications,
  getSocialNotification,
  getSocialNotifications,
  readPersonalNotifications,
  readSocialNotifications,
  sendPushNotification,
  setPushNotificationToken,
} from '../../controllers/message/notificationController'
import {
  createNotificationTemplate,
  deleteNotificationTemplate,
  getNotificationTemplateById,
  getNotificationTemplates,
  updateNotificationTemplate,
} from '../../controllers/message/notificationTemplateController'

const router = express.Router()

router
  .route('/templates')
  .get(getNotificationTemplates)
  .post(upload.any(), createNotificationTemplate)

router
  .route('/templates/:id')
  .get(getNotificationTemplateById)
  .patch(upload.any(), updateNotificationTemplate)
  .delete(deleteNotificationTemplate)

router.route('/personal/read').patch(upload.any(), readPersonalNotifications)
router.route('/personal').get(getPersonalNotifications)
router.route('/personal/:id').get(getPersonalNotification)

router.route('/social/read').patch(upload.any(), readSocialNotifications)
router.route('/social').get(getSocialNotifications)
router.route('/social/:id').get(getSocialNotification)

router
  .route('/push-notification')
  .post(upload.any(), setPushNotificationToken)
  .patch(upload.any(), sendPushNotification)

export default router
