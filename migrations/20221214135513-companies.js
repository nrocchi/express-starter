/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('companies', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      zipcode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      countryCode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DataTypes.FLOAT,
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
    return queryInterface.dropTable('companies')
  },
}
