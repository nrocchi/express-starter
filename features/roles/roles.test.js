const request = require('supertest')
const app = require('../../index')

describe('Roles API', () => {
  it('should show all roles', async () => {
    // const results = [
    //   {
    //     id: 1,
    //     code: 'SUPER_ADMIN',
    //     name: 'Super administrator',
    //   },
    // ]
    const res = await request(app).get('/roles')
    expect(res.statusCode).toEqual(200)
    // if (!res.body.length) {
    //   expect(res.body).toEqual([])
    // } else {
    //   expect([
    //     {
    //       id: 1,
    //       code: 'SUPER_ADMIN',
    //       name: 'Super administrator',
    //     },
    //     {
    //       id: 999,
    //       code: 'code',
    //       name: 'name',
    //     },
    //   ]).toEqual(expect.arrayContaining(results))
    //   expect(res.body).toEqual(
    //     expect.arrayContaining([
    //       {
    //         id: 1,
    //         code: 'SUPER_ADMIN',
    //         name: 'Super administrator',
    //       },
    //     ]),
    //   )
    //   expect(res.body.length >= 1).toBe(true)
    //   expect(res.body).toEqual(
    //     expect.arrayContaining([
    //       expect.objectContaining({
    //         id: 1,
    //         code: 'SUPER_ADMIN',
    //         name: 'Super administrator',
    //       }),
    //     ]),
    //   )
    // }
  })
})

afterAll(() => {
  app.close()
})
