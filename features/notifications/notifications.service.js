const db = require('../../app/helpers/db')
const userService = require('../users/users.service')

exports.getNotificationsByUser = async (req) => {
  const id = req.params.id || null
  const order = req.query.order || 'created_at'
  const orderby = req.query.orderby || 'DESC'

  const results = await db.Notification.findAndCountAll({
    raw: true,
    nest: true,
    where: {'$recipient.notifications_users.user_id$': id},
    include: [
      {
        model: db.User,
        as: 'recipient',
        attributes: {
          exclude: ['role_id', 'status_id', 'company_id', 'deleted_at'],
        },
        include: [
          {
            model: db.Role,
            as: 'role',
          },
          {
            model: db.Status,
            as: 'status',
          },
          {
            model: db.Company,
            as: 'company',
            attributes: {exclude: ['deleted_at']},
          },
        ],
      },
      {
        model: db.User,
        as: 'target',
        paranoid: false,
        attributes: {
          exclude: ['role_id', 'status_id', 'company_id', 'deleted_at'],
        },
        include: [
          {
            model: db.Role,
            as: 'role',
          },
          {
            model: db.Status,
            as: 'status',
          },
          {
            model: db.Company,
            as: 'company',
            attributes: {exclude: ['deleted_at']},
          },
        ],
      },
      {
        model: db.User,
        as: 'sender',
        attributes: {
          exclude: ['role_id', 'status_id', 'company_id', 'deleted_at'],
        },
        include: [
          {
            model: db.Role,
            as: 'role',
          },
          {
            model: db.Status,
            as: 'status',
          },
          {
            model: db.Company,
            as: 'company',
            attributes: {exclude: ['deleted_at']},
          },
        ],
      },
    ],
    attributes: {
      exclude: ['sender_id', 'target_id'],
    },
    order: [[order, orderby]],
  })

  return results
}

exports.getNotificationsBySender = async (req) => {
  const id = req.params.id || null
  const order = req.query.order || 'created_at'
  const orderby = req.query.orderby || 'DESC'

  const whereId = {sender_id: id}

  const results = await db.Notification.findAndCountAll({
    raw: true,
    nest: true,
    include: [
      {
        model: db.User,
        as: 'target',
        paranoid: false,
        attributes: {
          exclude: ['role_id', 'status_id', 'company_id', 'deleted_at'],
        },
        include: [
          {
            model: db.Role,
            as: 'role',
          },
          {
            model: db.Status,
            as: 'status',
          },
          {
            model: db.Company,
            as: 'company',
            attributes: {exclude: ['deleted_at']},
          },
        ],
      },
      {
        model: db.User,
        as: 'sender',
        where: {id},
        attributes: {
          exclude: ['role_id', 'status_id', 'company_id', 'deleted_at'],
        },
        include: [
          {
            model: db.Role,
            as: 'role',
          },
          {
            model: db.Status,
            as: 'status',
          },
          {
            model: db.Company,
            as: 'company',
            attributes: {exclude: ['deleted_at']},
          },
        ],
      },
    ],
    attributes: {
      exclude: ['sender_id', 'target_id'],
    },
    where: [whereId],
    order: [[order, orderby]],
  })

  return results
}

exports.getNotification = async (type, value) => {
  return db.Notification.findOne({
    raw: true,
    nest: true,
    where: [{[type]: value}],
    include: [
      {
        model: db.User,
        as: 'recipient',
        attributes: {
          exclude: ['role_id', 'status_id', 'company_id', 'deleted_at'],
        },
        include: [
          {
            model: db.Role,
            as: 'role',
          },
          {
            model: db.Status,
            as: 'status',
          },
          {
            model: db.Company,
            as: 'company',
            attributes: {exclude: ['deleted_at']},
          },
        ],
      },
      {
        model: db.User,
        as: 'target',
        paranoid: false,
        attributes: {
          exclude: ['role_id', 'status_id', 'company_id', 'deleted_at'],
        },
        include: [
          {
            model: db.Role,
            as: 'role',
          },
          {
            model: db.Status,
            as: 'status',
          },
          {
            model: db.Company,
            as: 'company',
            attributes: {exclude: ['deleted_at']},
          },
        ],
      },
      {
        model: db.User,
        as: 'sender',
        attributes: {
          exclude: ['role_id', 'status_id', 'company_id', 'deleted_at'],
        },
        include: [
          {
            model: db.Role,
            as: 'role',
          },
          {
            model: db.Status,
            as: 'status',
          },
          {
            model: db.Company,
            as: 'company',
            attributes: {exclude: ['deleted_at']},
          },
        ],
      },
    ],
    attributes: {
      exclude: ['sender_id', 'target_id'],
    },
  })
}

exports.createNotificationByRole = async (data) => {
  const sender = data.sender
    ? data.sender
    : {
        role: {
          priority: 2,
        },
        id: null,
      }

  // Get all active users with role above the sender role
  const usersByRoles = await userService.getActiveUsersByRoles(
    sender.role.priority,
  )

  // Cannot send notification to sender himself
  // (user must be different from sender)
  const usersByRolesWithoutSender = usersByRoles.rows.filter(
    (user) => user.id !== sender.id,
  )

  if (usersByRolesWithoutSender.length > 0) {
    const notification = await db.Notification.create({
      type: data.type,
      content: data.content,
      target_id: data.target.id,
      sender_id: sender.id,
    })

    if (notification) {
      const notificationsUsers = []

      await Promise.all(
        usersByRolesWithoutSender.map(async (userByRole) => {
          const notificationUser = await db.NotificationUser.create({
            read: 0,
            notification_id: notification.dataValues.id,
            user_id: userByRole.id,
          })

          notificationsUsers.push(notificationUser.dataValues)
        }),
      )

      const createdNotification = await this.getNotification(
        'id',
        notification.id,
      )

      return {
        ...createdNotification,
        recipient: {
          notifications_users: notificationsUsers,
        },
      }
    }
  }

  return false
}

exports.createNotificationByUser = async (data) => {
  // Cannot send notification to sender himself
  // (recipient must be different from sender)
  if (data.target.id !== data.sender.id) {
    const notification = await db.Notification.create({
      type: data.type,
      content: data.content,
      target_id: data.target.id,
      sender_id: data.sender.id,
    })

    if (notification) {
      const notificationUser = await db.NotificationUser.create({
        read: 0,
        notification_id: notification.dataValues.id,
        user_id: data.target.id,
      })

      const createdNotification = await this.getNotification(
        'id',
        notification.id,
      )

      return {
        ...createdNotification,
        recipient: {
          notifications_users: notificationUser,
        },
      }
    }
  }

  return false
}

exports.updateNotification = async (id, value) => {
  const notification = await db.NotificationUser.update(value, {
    where: {id},
  })

  if (notification) {
    const updatedNotificationUser = await db.NotificationUser.findOne({
      raw: true,
      nest: true,
      where: {
        id,
      },
    })

    const updatedNotification = await this.getNotification(
      'id',
      updatedNotificationUser.notification_id,
    )

    return {
      ...updatedNotification,
    }
  }

  return db.NotificationUser.update(value, {
    where: {id},
  })
}

exports.deleteNotification = async (id) => {
  const notificationToDelete = await db.NotificationUser.findOne({
    raw: true,
    nest: true,
    where: {id},
  })

  const result = await db.NotificationUser.destroy({
    where: {id},
  })

  if (result === 1) {
    const remainingNotifications = await db.NotificationUser.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        notification_id: notificationToDelete.notification_id,
      },
    })

    if (!remainingNotifications.rows.length) {
      await db.Notification.destroy({
        where: {id: notificationToDelete.notification_id},
      })
    }

    return result
  }

  return false
}
