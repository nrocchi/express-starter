const userService = require('../users/users.service')
const notificationService = require('./notifications.service')

exports.getUser = async (req, next) => {
  try {
    const id = req.params.id || null

    const user = await userService.getUser('id', id)

    // Cannot get a non existing user => !user
    if (id && !user) {
      const error = {
        code: 400,
        message: 'The user was not found.',
      }
      next(error)
      return false
    }

    return user
  } catch (error) {
    next(error)
    return false
  }
}

exports.getNotification = async (req, next) => {
  try {
    const id = req.params.id || null

    const notification = await notificationService.getNotification('id', id)

    // Cannot get a non existing notification => !notification
    if (id && !notification) {
      const error = {
        code: 400,
        message: 'The notification was not found.',
      }
      next(error)
      return false
    }

    return notification
  } catch (error) {
    next(error)
    return false
  }
}
