const request = require('supertest')
const app = require('../../index')

describe('Companies API', () => {
  it('should show all companies', async () => {
    const res = await request(app).get('/companies')
    expect(res.statusCode).toEqual(200)
  })
})

afterAll(() => {
  app.close()
})
