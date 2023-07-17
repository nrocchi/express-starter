const {faker} = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const users = await queryInterface.sequelize.query('SELECT id from users')

    const type = [
      'post_user',
      'post_user_invite',
      'patch_user',
      'delete_user',
      'enable_user',
      'disable_user',
    ]

    const randomStart = new Date(2018, 0, 1)
    const randomEnd = new Date()

    const fakeNotificationsRole = [...Array(20)].map(() => ({
      type: faker.helpers.arrayElement(type),
      content: 'notification_role',
      target_id: users[0][Math.floor(Math.random() * users[0].length)].id,
      sender_id: users[0][Math.floor(Math.random() * users[0].length)].id,
      created_at: new Date(
        randomStart.getTime() +
          Math.random() * (randomEnd.getTime() - randomStart.getTime()),
      ),
      updated_at: new Date(),
    }))

    const fakeNotificationsRoleSignUp = [...Array(10)].map(() => ({
      type: 'signup',
      content: 'notification_role',
      target_id: users[0][Math.floor(Math.random() * users[0].length)].id,
      sender_id: null,
      created_at: new Date(
        randomStart.getTime() +
          Math.random() * (randomEnd.getTime() - randomStart.getTime()),
      ),
      updated_at: new Date(),
    }))

    const fakeNotificationsRoleInvite = [...Array(10)].map(() => ({
      type: 'invite',
      content: 'notification_role',
      target_id: users[0][Math.floor(Math.random() * users[0].length)].id,
      sender_id: null,
      created_at: new Date(
        randomStart.getTime() +
          Math.random() * (randomEnd.getTime() - randomStart.getTime()),
      ),
      updated_at: new Date(),
    }))

    const fakeNotificationsUser = {
      type: 'patch_user',
      content: 'notification_user',
      target_id: 3,
      sender_id: users[0][Math.floor(Math.random() * users[0].length)].id,
      created_at: new Date(
        randomStart.getTime() +
          Math.random() * (randomEnd.getTime() - randomStart.getTime()),
      ),
      updated_at: new Date(),
    }

    const notifications = [
      ...fakeNotificationsRole,
      ...fakeNotificationsRoleSignUp,
      ...fakeNotificationsRoleInvite,
      fakeNotificationsUser,
    ]

    return queryInterface.bulkInsert('notifications', notifications, {})
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('notifications', null, {})
  },
}
