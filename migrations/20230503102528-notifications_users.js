/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('notifications_users', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      read: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      notification_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'notifications',
          },
          key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    })
  },

  down(queryInterface) {
    return queryInterface.dropTable('notifications_users')
  },
}
