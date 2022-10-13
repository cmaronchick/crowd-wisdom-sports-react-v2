const app = require('../api/index')
const ky = require('ky/umd')
describe('Endpoints', () => {
  it('get games', () => {

    ky.get('http://localhost:5001/api/games')
    .then(res => {
      console.log({res})
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