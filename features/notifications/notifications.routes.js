const express = require('express')

const auth = require('../../app/middlewares/auth')
const notificationController = require('./notifications.controller')
const notificationSchema = require('./notifications.schema')

const router = express.Router()

router.get('/user/:id', auth(), notificationController.getNotificationsByUser)
router.get(
  '/sender/:id',
  auth(),
  notificationController.getNotificationsBySender,
)
router.get('/:id', auth(), notificationController.getNotification)
router.post(
  '/',
  auth(),
  notificationSchema.create,
  notificationController.createNotification,
)
router.put(
  '/:id',
  auth(),
  notificationSchema.update,
  notificationController.updateNotification,
)
router.delete('/:id', auth(), notificationController.deleteNotification)

module.exports = router
