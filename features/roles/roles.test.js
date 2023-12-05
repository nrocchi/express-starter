const request = require('supertest')
const app = require('../../index')

describe('Roles API', () => {
  let token = ''

  beforeAll(async () => {
    const payload = {email: 'superadmin@demo.com', password: 'Password1'}
    const response = await request(app).post('/auth/signin').send(payload)
    token = response.body.token
  })

  it('should show all roles', () => {
    request(app)
      .get('/roles')
      .auth(token, {
        type: 'bearer',
      })
      .send()
      .expect(200)
      .expect(({body}) => {
        expect(body.status).toBeDefined()
        expect(body.message).toBeDefined()
        expect(body.data).toBeDefined()
        expect(body.total).toBeDefined()
        expect(body.pagination).toBeDefined()
        expect(body.data[0].id).toBeDefined()
        expect(body.data[0].password).not.toBeDefined()
      })
  })

  afterAll(() => {
    app.close()
  })
})
