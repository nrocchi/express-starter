/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      avatar: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        isEmail: true,
      },
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      firstname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      lastname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      job: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      role_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'roles',
          },
          key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      status_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'statuses',
          },
          key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      company_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'companies',
          },
          key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      reset_token: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      invitation_token: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
    })
  },

  down(queryInterface) {
    return queryInterface.dropTable('users')
  },
}
