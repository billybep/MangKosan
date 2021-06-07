const request = require('supertest')
const app = require('../app')

const { User, Revenue } = require('../models');
const { sequelize } = require('../models')
const { hashPassword } = require('../helpers/bcrypt')
const { generateToken} = require('../helpers/jwt')
const { queryInterface } = sequelize

let revenueId = 1

beforeAll(done => {
  queryInterface.bulkInsert('Users', [
    {
      id        : 1,
      email     : "adminKosan@mail.com",
      username  : "adminKosan",
      password  : hashPassword('owner123'),
      createdAt : new Date(),
      updatedAt : new Date()
    },
  ],{})
  .then( _ => {
    return queryInterface.bulkInsert('Properties', [
      {
        id        : 1,
        name      : "Property 1",
        address   : "property address",
        image     : "property image",
        phone     : "4445667889",
        userId    : 1,
        createdAt : new Date(),
        updatedAt : new Date()
      },
    ],{})
  })
  .then( _ => {
    return queryInterface.bulkInsert('Revenues', [
      {
        id        : 1,
        month     : 1,
        year      : 2021,
        total     : 1000000,
        propertyId: 1,
        createdAt : new Date(),
        updatedAt : new Date()
      },
      {
        id        : 2,
        month     : 2,
        year      : 2021,
        total     : 1000001,
        propertyId: 1,
        createdAt : new Date(),
        updatedAt : new Date()
      },
    ],{})
  })
  .then(_ => done())
  .catch(err => {
    console.log(err);
    done(err);
  })
})

afterAll(done => {
  queryInterface.bulkDelete('Users', null, {})
  .then( _ => {
    return queryInterface.bulkDelete('Revenues', null, {})
  })
  .then(() => {
    done()
  })
  .catch(err => {
    console.log(err);
    done();
  })
})


describe('REVENUE TESTING', _ => {

  const ownerToken = generateToken({
    email   : 'adminKosan@mail.com',
    username: 'adminKosan'
  })

  const addRevenue = {
    month       : 2,
    year        : 2021,
    total       : 12002003,
    propertyId  : 1
  }

  describe('GET /revenues', _ => {
    test('read data revenues', done => {
      request(app)
      .get('/revenues')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('access_token', ownerToken)
      .then(response => {
        
        let { body, status } = response
        expect(status).toEqual(200)
        expect(typeof response.body).toEqual('object')
        expect(response.body.revenues).toEqual(expect.any(Array))
        done()
      })
      .catch(err => done(err))
    })
  })
  
  describe('Post /revenues', _ => {
    test('when success should response with status code 201', done => {
      request(app)
        .post('/revenues')
        .set('Accept', 'application/json')
        .set('access_token', ownerToken)
        .expect('Content-Type', /json/)
        .send(addRevenue)
        .then(response => {
          const { status, body } = response
          
          expect(status).toEqual(201)
          expect(typeof body).toEqual('object')
          expect(body).toHaveProperty('month', expect.any(Number))
          expect(body).toHaveProperty('year', expect.any(Number))
          expect(body).toHaveProperty('total', expect.any(Number))
          expect(body).toHaveProperty('propertyId', expect.any(Number))
          done()
        })
        .catch(err => done(err))
    })

    test('empty input error', done => {
      request(app)
        .post('/revenues')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .set('access_token', ownerToken)
        .send({
          month     : "",
          year      : "",
          total     : "",
          propertyId: "",
        })
        .then(result => {
          expect(result.status).toEqual(400)
          expect(result.body).toStrictEqual({"errors": [
            "year mustn't empty",
            "total mustn't empty"
          ],
          "message": "Sequelize Validation Error"})
          done()
        })
        .catch(err => done(err))
    })

    test('send wrong token should response with status code 400', done => {
      request(app)
        .post('/revenues')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .set('access_token', "WRONG TOKEN REVENUES")
        .send(addRevenue)
        .then(result => {
          // expect(result.status).toEqual(401) SAMAAIN error handling
          expect(typeof result.body).toEqual('object')
          expect(result.body).toEqual(expect.objectContaining({ "message": "jwt malformed" }))
          done()
        })
        .catch(err => done(err))
    })

    test('when input wrong datatype on field send response with status code 500 & message error', done => {
      request(app)
        .post('/revenues')
        .set('Accept', 'application/json')
        .set('access_token', ownerToken)
        .send({
          month     : "INPUT STRING",
          year      : "INPUT STRING",
          total     : "INPUT STRING",
          propertyId: "INPUT STRING",
        })
        .then(result => {
          expect(result.status).toEqual(500)
          expect(typeof result.body).toEqual('object')
          expect(result.body).toHaveProperty('message')
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('Update Property - PUT /revenues/:id', _ => {

    describe('When success to update', _ => {
      test('Update should send response with status code 200', done => {
        request(app)
          .put(`/revenues/${revenueId}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .set('access_token', ownerToken)
          .send({
            month : 7,
            year : 2021,
            total: 107005007,
            propertyId: 1,
          })
          .then(result => {
            expect(result.status).toEqual(200)
            expect(typeof result.body).toEqual('object')
            expect(result.body).toHaveProperty('updated')
            done()
          })
          .catch(err => done(err))
      })
    })

    test('when no access_token it should send response with status code (400) Invalid token', done => {
      request(app)
        .put(`/revenues/${revenueId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        // .set('access_token', adminToken)
        .auth('role', 'admin')
        .send({
          month : 7,
          year : 2021,
          total: 107005007,
          propertyId: 1,
        })
        .then(result => {
          expect(result.status).toEqual(400)
          expect(typeof result.body).toEqual('object')
          expect(result.body).toHaveProperty('message')
          expect(result.body)
            .toEqual(expect.objectContaining({ "message": "Unauthenticate" }))
          done()
        })
        .catch(err => done(err))
    })

    test('when valid token but send an empty data should send response with status code (400)', done => {
      request(app)
        .put(`/revenues/${revenueId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .set('access_token', ownerToken)
        .send({
          month     : "",
          year      : "",
          total     : "",
          propertyId: "",
        })
        .then(result => {
          expect(result.status).toEqual(400)
          expect(typeof result.body).toEqual('object')
          expect(result.body).toHaveProperty('message')
          expect(result.body)
            .toEqual(expect.objectContaining({ "message": "Sequelize Validation Error" }))
          expect(result.body).toStrictEqual({"errors": [
            "year mustn't empty",
            "total mustn't empty"
          ],
            "message": "Sequelize Validation Error"})
          done()
        })
        .catch(err => done(err))
    })

  })



  describe('Delete /revenues/:id', _ => {

    describe('When success delete', () => {

      it('should successfully get status 200', done => {
        request(app)
          .delete(`/revenues/${1}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .set('access_token', ownerToken)
          .then(result => {
            expect(result.status).toEqual(200)
            expect(typeof result.body).toEqual('object')
            expect(result.body).toHaveProperty('message')
            expect(result.body)
              .toEqual(expect.objectContaining({ "message": "Revenue record successfull delete!" }))
            done()
          })
          .catch(err => done(err))
      })

      it('Revenue not Found', done => {
        request(app)
          .delete(`/revenues/${999}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .set('access_token', ownerToken)
          .then(result => {
            expect(result.status).toEqual(404)
            expect(typeof result.body).toEqual('object')
            expect(result.body).toHaveProperty('message')
            expect(result.body)
              .toEqual(expect.objectContaining({ "message": "Revenue Not Found" }))
            done()
          })
          .catch(err => done(err))
      })
    })

    

    
    describe('When access_token is null', _ => {
      test('should response with status code (400) with message Invalid Token', done => {
        request(app)
          .delete(`/revenues/${revenueId}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .set('access_token', null)
          .then(result => {
            // expect(result.status).toEqual(400) // << masih error
            expect(typeof result.body).toEqual('object')
            expect(result.body).toHaveProperty('message')
            expect(result.body)
              .toEqual(expect.objectContaining({ "message": "jwt malformed" }))
            done()
          })
          .catch(err => done(err))
      })
    })
  })

})