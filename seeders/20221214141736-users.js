const bcrypt = require('bcryptjs')
const {faker} = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const roles = await queryInterface.sequelize.query('SELECT id from roles')
    const statuses = await queryInterface.sequelize.query(
      'SELECT id from statuses',
    )
    const companies = await queryInterface.sequelize.query(
      'SELECT id from companies',
    )

    const randomStart = new Date(2018, 0, 1)
    const randomEnd = new Date()

    const fakeUsers = [...Array(100)].map(() => ({
      avatar: faker.image.abstract(640, 480, true),
      email: faker.internet.email(),
      userName: faker.name.middleName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: bcrypt.hashSync('Password1', 10),
      job: faker.name.jobTitle(),
      role_id: roles[0][Math.floor(Math.random() * roles[0].length)].id,
      status_id: statuses[0][Math.floor(Math.random() * statuses[0].length)].id,
      company_id:
        companies[0][Math.floor(Math.random() * companies[0].length)].id,
      reset_token: null,
      invitation_token: null,
      created_at: new Date(
        randomStart.getTime() +
          Math.random() * (randomEnd.getTime() - randomStart.getTime()),
      ),
      updated_at: new Date(),
      deleted_at: null,
    }))

    const demoUser = {
      avatar: faker.image.abstract(640, 480, true),
      email: 'user@demo.com',
      userName: 'user',
      firstName: 'Nicolas',
      lastName: 'Rocchi',
      password: bcrypt.hashSync('Password1', 10),
      job: 'Lead Developer',
      role_id: 3,
      status_id: 1,
      company_id: 3,
      reset_token: null,
      invitation_token: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }

    const demoAdmin = {
      avatar: faker.image.abstract(640, 480, true),
      email: 'admin@demo.com',
      userName: 'admin',
      firstName: 'Nicolas',
      lastName: 'Rocchi',
      password: bcrypt.hashSync('Password1', 10),
      job: 'Lead Developer',
      role_id: 2,
      status_id: 1,
      company_id: 2,
      reset_token: null,
      invitation_token: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }

    const demoSuperAdmin = {
      avatar: faker.image.abstract(640, 480, true),
      email: 'superadmin@demo.com',
      userName: 'superadmin',
      firstName: 'Nicolas',
      lastName: 'Rocchi',
      password: bcrypt.hashSync('Password1', 10),
      job: 'Lead Developer',
      role_id: 1,
      status_id: 1,
      company_id: 1,
      reset_token: null,
      invitation_token: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }

    const users = [demoUser, demoAdmin, demoSuperAdmin, ...fakeUsers]

    return queryInterface.bulkInsert('users', users, {})
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {})
  },
}
