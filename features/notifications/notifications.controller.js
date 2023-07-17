const apicache = require('apicache-plus')

const notificationService = require('./notifications.service')
const notificationsValidate = require('./notifications.validate')

exports.getNotificationsByUser = async (req, res, next) => {
  const user = await notificationsValidate.getUser(req, next)

  if (user) {
    const results = await notificationService.getNotificationsByUser(req)

    req.apicacheGroup = `notifications/user/${req.params.id}`

    return res.json({
      status: 'success',
      message: 'The notifications by user has been retrieved!',
      datas: results.rows,
      total: results.count,
    })
  }

  return false
}

exports.getNotificationsBySender = async (req, res, next) => {
  const user = await notificationsValidate.getUser(req, next)

  if (user) {
    const results = await notificationService.getNotificationsBySender(req)

    req.apicacheGroup = `notifications/sender/${req.params.id}`

    return res.json({
      status: 'success',
      message: 'The notifications by sender has been retrieved!',
      datas: results.rows,
      total: results.count,
    })
  }

  return false
}

exports.getNotification = async (req, res, next) => {
  const notification = await notificationsValidate.getNotification(req, next)

  if (notification) {
    req.apicacheGroup = `notifications/${req.params.id}`

    return res.json({
      status: 'success',
      message: 'The notifications has been retrieved!',
      datas: notification,
    })
  }

  return false
}

exports.createNotification = async (req, res, next) => {
  let notification

  try {
    if (req.body.category === 'role') {
      notification = await notificationService.createNotificationByRole(
        req.body,
      )
    } else {
      notification = await notificationService.createNotificationByUser(
        req.body,
      )
    }

    if (notification) {
      apicache.clear(`notifications/user/${req.body.target_id}`)
      apicache.clear(`notifications/sender/${req.body.sender_id}`)

      return res.json({
        status: 'success',
        message: `The notification has been created!`,
        datas: notification,
      })
    }

    return false
  } catch (error) {
    next(error)
    return false
  }
}

exports.updateNotification = async (req, res, next) => {
  const notification = await notificationsValidate.getNotification(req, next)

  if (notification) {
    try {
      const updatedNotification = await notificationService.updateNotification(
        req.params.id,
        req.body,
      )

      if (updatedNotification) {
        apicache.clear(`notifications/user/${req.params.id}`)
        apicache.clear(`notifications/sender/${req.params.id}`)
        apicache.clear(`notifications/${req.params.id}`)

        return res.json({
          status: 'success',
          message: `The notification ${updatedNotification.id} has been edited!`,
          datas: updatedNotification,
        })
      }

      return false
    } catch (error) {
      next(error)
      return false
    }
  }
  return false
}

exports.deleteNotification = async (req, res, next) => {
  const notification = await notificationsValidate.getNotification(req, next)

  if (notification) {
    try {
      const result = await notificationService.deleteNotification(req.params.id)

      if (result === 1) {
        apicache.clear(`notifications/user/${req.params.id}`)
        apicache.clear(`notifications/sender/${req.params.id}`)
        apicache.clear(`notifications/${req.params.id}`)

        return res.json({
          status: 'success',
          message: `The notification ${req.params.id} has been deleted!`,
        })
      }

      return false
    } catch (error) {
      next(error)
      return false
    }
  }
  return false
}
