const app = require('../api/index')
jest.mock('ky/umd', () => ({
  get: jest.fn(() => Promise.resolve({
    statusCode: 201,
    body: { post: true }
  }))
}));
jest.mock('ky-universal', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn()
  })),
  get: jest.fn(() => Promise.resolve({
    statusCode: 201,
    body: { post: true }
  }))
}));

const ky = require('ky/umd')

describe('Endpoints', () => {
  it('get games', () => {

    return ky.get('http://localhost:5001/api/games')
      .then(res => {
        console.log({ res })
        // .post('/group/update')
        // .send({
        //   userId: 1,
        //   title: 'test is cool',
        // })
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('post')
      })
  })
})
