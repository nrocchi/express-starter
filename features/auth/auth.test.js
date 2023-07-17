const request = require('supertest')
const app = require('../../index')

describe('Auth API', () => {
  it('should signin', async () => {
    const res = await request(app).get('/auth/signin')
    expect(res.statusCode).toEqual(200)
  })
})

afterAll(() => {
  app.close()
})
