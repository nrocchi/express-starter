/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'statuses',
      [
        {
          code: 'ACTIVE',
          name: 'Active',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'INACTIVE',
          name: 'Inactive',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'PENDING',
          name: 'Pending',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('statuses', null, {})
  },
}
