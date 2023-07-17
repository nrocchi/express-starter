/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      target_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      sender_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
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
    return queryInterface.dropTable('notifications')
  },
}
