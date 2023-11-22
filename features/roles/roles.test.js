const request = require('supertest')
const app = require('../../index')

let token = ''

beforeAll(async () => {
  const payload = {email: 'superadmin@demo.com', password: 'Password1'}
  await request(app)
    .post('/auth/signin')
    .send(payload)
    .then(({body}) => {
      token = body.token
    })
})

describe('Roles API', () => {
  it('should show all roles', () => {
    return request(app)
      .get('/roles')
      .auth(token, {
        type: 'bearer',
      })
      .expect(200)
      .send()
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
})

afterAll(() => {
  app.close()
})
