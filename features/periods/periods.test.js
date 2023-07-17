const request = require('supertest')
const app = require('../../index')

describe('Periods API', () => {
  it('should show all periods', async () => {
    const res = await request(app).get('/periods')
    expect(res.statusCode).toEqual(200)
  })
})

afterAll(() => {
  app.close()
})
