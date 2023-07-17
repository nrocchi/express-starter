const request = require('supertest')
const app = require('../../index')

describe('Users API', () => {
  it('should show all users', async () => {
    const res = await request(app).get('/users')
    expect(res.statusCode).toEqual(200)
  })
})

afterAll(() => {
  app.close()
})
