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
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    job: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invitation_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }
  const options = {
    defaultScope: {
      // exclude password by default
      attributes: {exclude: ['password', 'reset_token', 'invitation_token']},
    },
    scopes: {
      // include password with this scope
      withPassword: {attributes: {}},
    },
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
  }

  const User = sequelize.define('users', attributes, options)

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'role_id',
      foreignKeyConstraint: true,
      as: 'role',
    })
    User.belongsTo(models.Status, {
      foreignKey: 'status_id',
      foreignKeyConstraint: true,
      as: 'status',
    })
    User.belongsTo(models.Company, {
      foreignKey: 'company_id',
      foreignKeyConstraint: true,
      as: 'company',
    })
    // User.belongsToMany(models.Notification, {
    //   through: 'notifications_users',
    //   foreignKey: 'user_id',
    //   onDelete: 'NO ACTION',
    //   onUpdate: 'NO ACTION',
    // })
  }

  return User
}
