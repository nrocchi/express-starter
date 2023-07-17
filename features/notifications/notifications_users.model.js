const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    read: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }
  const options = {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }

  const NotificationUser = sequelize.define(
    'notifications_users',
    attributes,
    options,
  )

  NotificationUser.associate = (models) => {
    models.Notification.belongsToMany(models.User, {
      through: 'notifications_users',
      foreignKey: 'notification_id',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
      as: 'recipient',
    })
    models.User.belongsToMany(models.Notification, {
      through: 'notifications_users',
      foreignKey: 'user_id',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    })
  }

  return NotificationUser
}
