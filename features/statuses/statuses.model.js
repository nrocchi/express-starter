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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }

  const options = {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }

  const Status = sequelize.define('statuses', attributes, options)

  Status.associate = (model) => {
    Status.hasMany(model.User, {
      foreignKey: 'status_id',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    })
  }

  return Status
}
