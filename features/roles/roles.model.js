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
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }

  const options = {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }

  const Role = sequelize.define('roles', attributes, options)

  Role.associate = (model) => {
    Role.hasMany(model.User, {
      foreignKey: 'role_id',
      sourceKey: 'id',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    })
  }

  return Role
}
