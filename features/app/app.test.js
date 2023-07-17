const request = require('supertest')
const app = require('../../index')

describe('App endpoints', () => {
  it('Show the health check on route "/"', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toBeDefined()
  })

  it('Show the swagger doc on route "/doc"', async () => {
    const element = '<!DOCTYPE html>'
    const res = await request(app).get('/doc')
    expect(res.statusCode).toEqual(301)
    expect(res.text).toContain(element)
  })

  it('Show resource not found on "/non-existing-route"', async () => {
    const res = await request(app).get('/non-existing-route')
    expect(res.statusCode).toEqual(404)
    expect(res.body.message).toEqual('Resource not found')
  })
})

afterAll(() => {
  app.close()
})
