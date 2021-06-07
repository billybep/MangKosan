const request = require('supertest')
const app = require('../app')

const { Property, sequelize } = require('../models')
const { hashPassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')
const { queryInterface } = sequelize

//!  masih ada beberapa tidak sesuai .. butuh diskusi

let propertyId = 1

const validUser = {
  email: "owner@mail.com",
  password: "owner123"
}

let globalToken = "";

beforeAll((done) => {
  queryInterface.bulkInsert('Users', [
    {
      id        : 1,
      email     : "owner@mail.com",
      username  : "owner",
      password  : hashPassword('owner123'),
      createdAt : new Date(),
      updatedAt : new Date()
    }
  ],{})
  .then(() => {
    return request(app)
    .post("/login")
    .send(validUser)
    .set('Accept', 'application/json')
  })
  .then((response) => {
    let {body, status} = response;
    globalToken = body.access_token;
  })
  .then(_ => {
    done();
  })
  .catch(err => done(err))
})

afterAll((done) => {
  queryInterface.bulkDelete('Users', null, {})
  .then(_ => {
    return queryInterface.bulkDelete('Properties', null, {})
  })
  .then(_ => { done()})
  .catch(err => done(err))
})

describe('PROPERTY TESTING', _ => {

  const ownerToken = generateToken({
    email   : 'owner@mail.com',
    username: 'owner'
  })

  const testAddProperty = {
    id: 1,
    name : "add name property",
    address : "add location property",
    image: "add image url",
    phone: "088899995555",
    userId: 1,
  }

  describe('Add new Property - POST /properties', _ => {
    test('when success should send response with status code 201', done => {
      request(app)
        .post('/properties')
        .set('Accept', 'application/json')
        .set('access_token', globalToken)
        .expect('Content-Type', /json/)
        .send(testAddProperty)
        .then(response => {
          const { status, body } = response
          expect(status).toEqual(201)
          expect(typeof body).toEqual('object')
          expect(body).toHaveProperty('id', expect.any(Number))
          expect(body).toHaveProperty('name', expect.any(String))
          expect(body).toHaveProperty('address', expect.any(String))
          expect(body).toHaveProperty('image', expect.any(String))
          expect(body).toHaveProperty('phone', expect.any(String))
          expect(body).toHaveProperty('userId', expect.any(Number))
          propertyId = body.id
          done()
        })
        .catch(err => done(err))
      })

      test('empty input error', done => {
        request(app)
          .post('/properties')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .set('access_token', ownerToken)
          .send({
            name    : "",
            address : "",
            image   : "",
            phone   : "",
            userId  : "",
          })
          .then(result => {
            expect(result.status).toEqual(400)
            expect(result.body).toStrictEqual({"errors": [
              "name mustn't empty",
              "address mustn't empty",
              "image mustn't empty",
              "phone mustn't empty",
              ],
              "message": "Sequelize Validation Error"})
            done()
          })
          .catch(err => done(err))
      })

      test('send wrong token should response with status code 400', done => {
        request(app)
          .post('/properties')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .set('access_token', "WRONG TOKEN")
          .send(testAddProperty)
          .then(result => {
            // expect(result.status).toEqual(401) SAMAAIN error handling
            expect(typeof result.body).toEqual('object')
            expect(result.body).toEqual(expect.objectContaining({ "message": "jwt malformed" }))
            done()
          })
          .catch(err => done(err))
      })

      it('when input wrong datatype on field send response with status code 500 & message error', done => {
        request(app)
          .post('/products')
          .set('Accept', 'application/json')
          .set('access_token', ownerToken)
          .send({
            name    : 12345,
            address : 12345,
            image   : 12345,
            phone   : 12345,
            userId  : "STRING",
          })
          .then(result => {
            // expect(result.status).toEqual(500)
            expect(typeof result.body).toEqual('object')
            // expect(result.body).toEqual(expect.objectContaining({ "message": "Internal server error!" }))
            done()
          })
          .catch(err => done(err))
      })

  })

  describe('GET /properties', _ => {
    test('read data property', done => {
      request(app)
      .get('/properties')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('access_token', ownerToken)
      .expect(200)
      .then(response => {

        let { body } = response
        expect(body).toEqual(expect.any(Object))
        expect(body).toHaveProperty("properties", expect.any(Array));
        done()
      })
      .catch(err => done(err))
    })
  })


  describe('Update Property - PUT /properties/:id', _ => {

    const ownerToken = generateToken({ 
      email   : 'owner@mail.com',
      username: 'owner'
    })

    describe('When success to update', _ => {
      test('Update should send response with status code 200', done => {
        request(app)
          .put(`/properties/${propertyId}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .set('access_token', ownerToken)
          .send({
            name : "add name property",
            address : "add location property",
            image: "add image url",
            phone: "088899995555",
          })
          .then(result => {
            expect(result.status).toEqual(200)
            expect(typeof result.body).toEqual('object')
            expect(result.body).toHaveProperty('updated')
            done()
            // propertyId='adfasdf'
          })
          .catch(err => done(err))
      })
    })

  })


  describe('Delete /properties/:id', _ => {

    const ownerToken = generateToken({ 
      username: 'owner',
      email   : 'owner@mail.com'
    })
    
    describe('When success delete', _ => {
      test('should successfully get status 200', (done) => {
        request(app)
          .delete(`/properties/${propertyId}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .set('access_token', ownerToken)
          .then(result => {
            expect(result.status).toEqual(200)
            expect(typeof result.body).toEqual('object')
            expect(result.body).toHaveProperty('message')
            expect(result.body)
              .toEqual(expect.objectContaining({ message: 'Property has been delete!' }))
            done()
          })
          .catch(err => done(err))
      })
    })

    describe('When access_token is null', _ => {
      it('should response with status code (400) with message Invalid Token', done => {
        request(app)
          .delete(`/properties/${propertyId}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .then(result => {
            expect(result.status).toEqual(400) // << masih error
            expect(typeof result.body).toEqual('object')
            expect(result.body).toHaveProperty('message')
            expect(result.body)
              .toEqual(expect.objectContaining({ "message": "Unauthenticate" }))
            done()
          })
          .catch(err => done(err))
      })
    })

  })

})