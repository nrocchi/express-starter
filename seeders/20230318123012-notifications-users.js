const {faker} = require('@faker-js/faker')
const _ = require('lodash')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const notifications = await queryInterface.sequelize.query(
      'SELECT id from notifications',
    )

    const notificationsRole = notifications[0].slice(0, -1)
    const notificationsUser = notifications[0].pop()
    const read = ['0', '1']
    const user = ['2', '3']
    const randomNotificationsRole = _.shuffle(notificationsRole)
    const randomStart = new Date(2018, 0, 1)
    const randomEnd = new Date()

    const fakeNotificationsUsersRole = [...Array(40)].map((_item, index) => ({
      read: faker.helpers.arrayElement(read),
      notification_id: randomNotificationsRole[index].id,
      user_id: faker.helpers.arrayElement(user),
      created_at: new Date(
        randomStart.getTime() +
          Math.random() * (randomEnd.getTime() - randomStart.getTime()),
      ),
      updated_at: new Date(),
    }))

    const fakeNotificationsUsersUser = {
      read: 0,
      notification_id: notificationsUser.id,
      user_id: 1,
      created_at: new Date(
        randomStart.getTime() +
          Math.random() * (randomEnd.getTime() - randomStart.getTime()),
      ),
      updated_at: new Date(),
    }

    const notificationsUsers = [
      fakeNotificationsUsersUser,
      ...fakeNotificationsUsersRole,
    ]

    return queryInterface.bulkInsert(
      'notifications_users',
      notificationsUsers,
      {},
    )
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('notifications_users', null, {})
  },
}
