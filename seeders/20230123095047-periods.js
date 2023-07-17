/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'periods',
      [
        {
          code: 'TODAY',
          name: 'Today',
          order: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'YESTERDAY',
          name: 'Yesterday',
          order: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'THISWEEK',
          name: 'This week',
          order: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'LASTWEEK',
          name: 'Last week',
          order: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'THISMONTH',
          name: 'This month',
          order: 5,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'LASTMONTH',
          name: 'Last month',
          order: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'THISQUARTER',
          name: 'This quarter',
          order: 7,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'LASTQUARTER',
          name: 'Last quarter',
          order: 8,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'THISYEAR',
          name: 'This year',
          order: 9,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'LASTYEAR',
          name: 'Last year',
          order: 10,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'LAST2YEARS',
          name: 'Last 2 years',
          order: 11,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          code: 'LAST5YEARS',
          name: 'Last 5 years',
          order: 12,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('periods', null, {})
  },
}
