const request = require('supertest')
const app = require('../../index')

describe('Statuses API', () => {
  it('should show all statuses', async () => {
    const res = await request(app).get('/statuses')
    expect(res.statusCode).toEqual(200)
  })
})

afterAll(() => {
  app.close()
})
