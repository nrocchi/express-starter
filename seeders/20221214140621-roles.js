/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'roles',
      [
        {
          code: 'SUPER_ADMIN',
          name: 'Super administrator',
          priority: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'ADMIN',
          name: 'Administrator',
          priority: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'USER',
          name: 'User',
          priority: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('roles', null, {})
  },
}
