const {faker} = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => {
    const fakeCompanies = [...Array(10)].map(() => ({
      name: faker.company.name(),
      address: faker.address.streetAddress(),
      zipcode: faker.address.zipCode(),
      city: faker.address.city(),
      country: faker.address.country(),
      countryCode: faker.address.countryCode(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }))

    return queryInterface.bulkInsert('companies', fakeCompanies, {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('companies', null, {})
  },
}
