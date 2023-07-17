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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }
  const options = {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }

  const Notification = sequelize.define('notifications', attributes, options)

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'sender_id',
      foreignKeyConstraint: true,
      as: 'sender',
    })
    Notification.belongsTo(models.User, {
      foreignKey: 'target_id',
      foreignKeyConstraint: true,
      as: 'target',
    })
  }

  return Notification
}
