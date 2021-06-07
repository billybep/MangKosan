const request = require('supertest')
const app = require('../app.js')
const { hashPassword } = require('../helpers/bcrypt.js')
const { generateToken } = require('../helpers/jwt')
const { User, Tenant } = require('../models');
const { sequelize } = require('../models')
const tenant = require('../models/tenant.js')
const { queryInterface } = sequelize

let idTenant

beforeAll((done) => {
  queryInterface.bulkInsert('Users', [{
    email: "admin@mail.com",
    username: 'admin',
    password: hashPassword('admin'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }],
    { returning: true })

    .then((res) => {
      res?.map((el => {
        let obj = {
          id: el.id,
          email: el.email,
        }
        access_token = generateToken(obj)
        // done();
      }))
    })
    .then(res => {
      return Tenant.create({
        email: 'pengunjung@mail.com',
        name: 'customer',
        phone: '0812382620',
        checkIn: "2021-03-12",
        checkOut: "2021-04-12",
      })
    })
    .then(res => {
      idTenant = res.id
      done()
    })
    .catch((err) => {
      done(err);
    })

})

afterAll((done) => {
  queryInterface.bulkDelete('Users', null, {})
    .then(() => {
      return queryInterface.bulkDelete("Tenants", null, {})
    })
    .then(() => {
      done()
    })
    .catch((err) => {
      done(err);
    })
})



describe("test tenant's CRUD section", () => {

  describe("test create tenant", () => {
    describe("success create tenant", () => {
      test("success create tenant test", (done) => {
        request(app)
          .post('/tenant')
          .set('access_token', `${access_token}`)
          .send({
            email: 'pengunjun8@customer.com',
            name: 'customer',
            phone: '0812382620',
            checkIn: "2021-03-12",
            checkOut: "2021-04-12",
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .then(res => {
            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty("id", res.body.id)
            expect(res.body).toHaveProperty("email", res.body.email)
            expect(res.body).toHaveProperty("name", res.body.name)
            expect(res.body).toHaveProperty("phone", res.body.phone)
            expect(res.body).toHaveProperty("checkIn", res.body.checkIn)
            expect(res.body).toHaveProperty("checkOut", res.body.checkOut)
            expect(res.body).toHaveProperty("createdAt", res.body.createdAt)
            expect(res.body).toHaveProperty("updatedAt", res.body.updatedAt)
            done()
          })
      })
    })


    describe("error create tenant function", () => {
      test("error empty create tenant test", (done) => {
        request(app)
          .post('/tenant')
          .set('access_token', `${access_token}`)
          .send({
            email: '',
            name: '',
            phone: '',
            checkIn: "",
            checkOut: "",
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .then(res => {
            expect(res.status).toBe(400)
            expect(res.body).toStrictEqual({
              "errors": [
                "Email is invalid",
                "email musn't be empty",
                "name musn't be empty",
                "phone musn't be empty",
                "checkIn musn't be empty",
                "checkOut musn't be empty",
              ],
              "message": "Sequelize Validation Error",
            })
            done()
          })
      })


      test("error empty contain in phone, checkIn, checkOut in create tenant test", (done) => {
        request(app)
          .post('/tenant')
          .set('access_token', `${access_token}`)
          .send({
            email: 'cust12@mail.com',
            name: 'custom12',
            phone: '',
            checkIn: "",
            checkOut: "",
          })
          .end((err, res) => {
            if (err) {
              return done(err)
            }

            expect(res.status).toBe(400)
            expect(res.body).toStrictEqual({
              "errors": [
                "phone musn't be empty",
                "checkIn musn't be empty",
                "checkOut musn't be empty",
              ],
              "message": "Sequelize Validation Error",
            })
            done()
          })
      })


      test("error empty contain in phone create tenant test 2", (done) => {
        request(app)
          .post('/tenant')
          .set('access_token', `${access_token}`)
          .send({
            email: 'cust12@mail.com',
            name: 'custom12',
            phone: '',
            checkIn: "2021-03-12",
            checkOut: "2021-04-12",
          })
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            expect(res.status).toBe(400)
            expect(res.body).toStrictEqual({
              "errors": [
                "phone musn't be empty",
              ],
              "message": "Sequelize Validation Error",
            })
            done()
          })
      })

    })
  })



  describe("test for read lists", () => {
    describe("test for read lists in tenant", () => {
      test("success read tenant test", (done) => {
        request(app)
          .get('/tenant')
          .set('access_token', `${access_token}`)
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("id", res.body.id)
            expect(res.body).toHaveProperty("email", res.body.email)
            expect(res.body).toHaveProperty("name", res.body.name)
            expect(res.body).toHaveProperty("phone", res.body.phone)
            expect(res.body).toHaveProperty("checkIn", res.body.checkIn)
            expect(res.body).toHaveProperty("checkOut", res.body.checkOut)
            done()
          })
      })
    })

    describe("test for read lists in tenant", () => {
      test("read tenant with wrong token", (done) => {
        request(app)
          .get('/tenant')
          .set('access_token', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJkZWx1eGVAbWFpbC5jb20iLCJpYXQiOjE2MjI2MTM3NTl9.ifUBkJSjte4vECRXJSn375JIyNL7lXvmPqD0SskQMF`)
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            expect(res.status).toBe(500)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty("message")
            done()
          })
      })
    })

    describe("test for read lists in tenant", () => {
      test("read tenant with no token", (done) => {
        request(app)
          .get('/tenant')
          // .set('access_token', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJkZWx1eGVAbWFpbC5jb20iLCJpYXQiOjE2MjI2MTM3NTl9.ifUBkJSjte4vECRXJSn375JIyNL7lXvmPqD0SskQMF`)
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            expect(res.status).toBe(400)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty("message")
            expect(res.body).toEqual(expect.objectContaining({  "message": "Unauthenticate" }))
            done()
          })
      })
    })

    describe("test for read lists in tenant", () => {
      test("read tenant with token wrong generate", (done) => {
        request(app)
          .get('/tenant')
          .set('access_token', `eyJpZCI6IjUwIiwiZW1haWwiOiJ0ZXN0QG1haWwuY29tIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.DtSJtciMHbwVcp2Mdu7igqt9YKVn1eDRA2YrWwHh4VY`)
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            expect(res.status).toBe(500)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty("message")
            done()
          })
      })
    })
  })


  describe("test for get list by id", () => {
    describe("test for get list by id in tenant", () => {
      test("success get list tenant test", (done) => {
        request(app)
          .get(`/tenant/${idTenant}`)
          .set('access_token', `${access_token}`)
          .end((err, res) => {
            if (err) {
              console.log(">>>>>", err, res, "<<<<")
              return done(err)
            }

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("email", res.body.email)
            expect(res.body).toHaveProperty("name", res.body.name)
            expect(res.body).toHaveProperty("phone", res.body.phone)
            expect(res.body).toHaveProperty("checkIn", res.body.checkIn)
            expect(res.body).toHaveProperty("checkOut", res.body.checkOut)
            done()
          })
      })
    })


    describe("error test for get list by id in tenant without access token", () => {
      test("get list by id in tenant test without access_token", (done) => {
        request(app)
          .get(`/tenant/${idTenant}`)
          .end((err, res) => {
            if (err) {
              return done(err)
            }

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty("message", "Unauthenticate")
            done()
          })
      })
    })


    describe("error test for get list by id in tenant with riddiculous id", () => {
      test("get list by riddiculous id in tenant test", (done) => {
        request(app)
          .get(`/tenant/999`)
          .set('access_token', `${access_token}`)
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            // console.log(res.body);
            expect(res.status).toBe(500)
            expect(res.body).toHaveProperty("email", res.body.email)
            expect(res.body).toHaveProperty("name", res.body.name)
            expect(res.body).toHaveProperty("phone", res.body.phone)
            expect(res.body).toHaveProperty("checkIn", res.body.checkIn)
            expect(res.body).toHaveProperty("checkOut", res.body.checkOut)
            expect(res.body).toHaveProperty("createdAt", res.body.createdAt)
            expect(res.body).toHaveProperty("updatedAt", res.body.updatedAt)
            done()
          })
      })
    })

  })


  describe("test for update list by id", () => {
    describe("test for update list by id in tenant", () => {
      test("success update list tenant test", (done) => {
        request(app)
          .put(`/tenant/${idTenant}`)
          .set('access_token', `${access_token}`)
          .send({
            email: 'customerr@cust.com',
            name: 'customer12',
            phone: '0812382320',
            checkIn: "2021-02-12",
            checkOut: "2021-03-12",
          })
          .end((err, res) => {
            if (err) {
              return done(err)
            }

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("id", res.body.id)
            expect(res.body).toHaveProperty("email", res.body.email)
            expect(res.body).toHaveProperty("name", res.body.name)
            expect(res.body).toHaveProperty("phone", res.body.phone)
            expect(res.body).toHaveProperty("checkIn", res.body.checkIn)
            expect(res.body).toHaveProperty("checkOut", res.body.checkOut)
            expect(res.body).toHaveProperty("createdAt", res.body.createdAt)
            expect(res.body).toHaveProperty("updatedAt", res.body.updatedAt)
            done()
          })
      })
    })


    describe("error test for update list by id in tenant without access_token", () => {
      test("update list tenant without access_token ", (done) => {
        request(app)
          .put(`/tenant/${idTenant}`)
          .send({
            email: 'custo11rr@cust.com',
            name: 'customer12',
            phone: '0812382320',
            checkIn: "2021-02-12",
            checkOut: "2021-03-12",
          })
          .end((err, res) => {
            if (err) {
              return done(err)
            }

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty("message", "Unauthenticate")
            done()
          })
      })
    })

    describe("error test for update list by id in tenant with empty list", () => {
      test("update list empty contain in tenant test ", (done) => {
        request(app)
          .put(`/tenant/${idTenant}`)
          .set('access_token', `${access_token}`)
          .send({
            email: '',
            name: '',
            phone: '',
            checkIn: "",
            checkOut: "",
          })
          .then(res => {

            expect(res.status).toBe(400)
            expect(res.body).toStrictEqual({
              "errors": [
                "Email is invalid",
                "email musn't be empty",
                "name musn't be empty",
                "phone musn't be empty",
                "checkIn musn't be empty",
                "checkOut musn't be empty",
              ],
              "message": "Sequelize Validation Error",
            })
            done()
          })
          .catch(err => {
            console.log(err);
            done(err);
          })
      })
    })


    describe("error test for update list by id in tenants with half empty list", () => {
      test("update list empty contain in tenant at phone, checkIn, checkOut", (done) => {
        request(app)
          .put(`/tenant/${idTenant}`)
          .set('access_token', `${access_token}`)
          .send({
            email: 'cust12@mail.com',
            name: 'custom12',
            phone: '',
            checkIn: "",
            checkOut: "",
          })
          .then(res => {
            expect(res.status).toBe(400)
            expect(res.body).toStrictEqual({
              "errors": [
                "phone musn't be empty",
                "checkIn musn't be empty",
                "checkOut musn't be empty",
              ],
              "message": "Sequelize Validation Error",
            })
            done()
          })
          .catch(err => {
            console.log(err);
            done(err);
          })

      })
    })


    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    describe("update tenant", () => {
      test("update with wrong id", (done) => {
        request(app)
          .put(`/tenant/${999999999999}`)
          .set('access_token', `${access_token}`)
          .send({
            email: 'cust12@mail.com',
            name: 'custom12',
            phone: '',
            checkIn: "2021-02-12",
            checkOut: "2021-03-12",
          })
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            expect(res.status).toBe(500)
            expect(res.body).toStrictEqual({
              "message": "error not found",
            })
            done()
          })
      })
    })

    describe("Erro update tenant", () => {
      test("update with wrong type input", (done) => {
        request(app)
          .put(`/tenant/${idTenant}`)
          .set('access_token', `${access_token}`)
          .send({
            email: '123@123.mail.com',
            name: 'custom1qweqwe2',
            phone: '987987',
            checkIn: "aaaaaaaaaa",
            checkOut: "2021-03-12",
          })
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            expect(res.status).toBe(500)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty('message')
            done()
          })
      })
    })




  })

  describe("test for delete list by id", () => {
    describe("test for delete list by id in tenant", () => {
      test("success delete list tenant test", (done) => {
        request(app)
          .delete(`/tenant/${idTenant}`)
          .set('access_token', `${access_token}`)
          .end((err, res) => {
            if (err) {
              return done(err)
            }

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("message", `Tenant successfully deleted`)
            done()
          })
      })
    })

    describe("error test for delete list by id in tenant", () => {
      test("error delete list with riddiculous id Tenant test", (done) => {
        request(app)
          .delete(`/tenant/999`)
          .set('access_token', `${access_token}`)
          .end((err, res) => {
            if (err) {
              return done(err)
            }

            expect(res.status).toBe(500)
            expect(res.body).toHaveProperty("message", `error not found`)
            done()
          })
      })
    })

  })

  describe("patch list by id in tenant", () => {

    test("patch list with id Tenant test", (done) => {
      request(app)
        .patch(`/tenant/${-1}`)
        .set('access_token', `${access_token}`)
        .send({
          email : "update@mail", 
          name : "update", 
          phone : "98765431", 
          checkIn : "2021-03-12", 
          checkOut : ""
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          expect(res.status).toBe(500)
          expect(res.body).toStrictEqual({
            "message": "error not found",
          })
          done()
        })
    })


    test("patch list with riddiculous id Tenant phone", (done) => {
      request(app)
        .patch(`/tenant/${99999999999}`)
        .set('access_token', `${access_token}`)
        // .send({
        //   phone : '',
        // })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          expect(res.status).toBe(500)
          expect(res.body).toStrictEqual({
            "message": "error not found",
          })
          done()
        })
    })

  })


})