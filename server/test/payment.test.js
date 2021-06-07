const request = require("supertest");
const app = require("../app.js");
const {sequelize} = require("../models");
const {queryInterface} = sequelize;
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

let validUser = {
    email: "maestro@mail.com",
    username: "maestro",
    password: "postgres"
}

const dateString = '2021-06-01'
var firstDate = new Date(dateString + "T00:00:00");
console.log(firstDate);

const dateStr2 = '2021-04-01'
var dueDate = new Date(dateStr2 + "T00:00:00");
console.log(dueDate);

let adminToken = "";
const publicPaymentId = 145;

beforeAll((done) => {
    queryInterface.bulkInsert("Users", [
        {
             id: 1,
             email: "maestro@mail.com",
             username: "maestro",
             password: bcrypt.hashSync("postgres", salt),
             createdAt: new Date(),
             updatedAt: new Date()
        }
    ], {})
    .then(() => {
         return request(app)
         .post("/login")
         .send(validUser)
         .set('Accept', 'application/json')
    })
    .then(response => {
        let {body, status} = response;
        adminToken = body.access_token;
 
        return queryInterface.bulkInsert("Properties", [
             {
                 id: 1,
                 name: "Wisma Rembulan",
                 address: "Pasar Minggu",
                 image: "blabla",
                 phone: "14256",
                 userId: 1,
                 createdAt: new Date(),
                 updatedAt: new Date()
             }
         ], {})
 
         
    })
    .then(_ => {
        return queryInterface.bulkInsert("Rooms", [
             {
                 id: 1,
                 number: "101",
                 status: "empty",
                 propertyId: 1,
                 type: "standard",
                 price: 2500000,
                 createdAt: new Date(),
                 updatedAt: new Date()
             }
         ], {}) 
    })
    .then(_ => {
        return queryInterface.bulkInsert("Tenants", [
            {
                id: 1,
                email: "maestro@mail.com",
                name: "maestro",
                phone: "1897234",
                checkIn: new Date(),
                checkOut: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            ], {}) 
        })
    .then(_ => {
        return queryInterface.bulkInsert("Payments", [
            {
                id: publicPaymentId,
                month: 5,
                year: 2021,
                nextDueDate: firstDate,
                paidCash: 2500000,
                tenantId: 1,
                roomId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            ], {}) 
        })
    .then(_ => {
        done()
    })
    .catch(err => {
        done(err)
    })
 });

 afterAll((done) => {
    queryInterface.bulkDelete("Users", null, {})
        .then(() => {
            return queryInterface.bulkDelete("Properties", null, {})
        })
        .then(() => {
            return queryInterface.bulkDelete("Rooms", null, {})
        })
        .then(() => {
            return queryInterface.bulkDelete("Tenants", null, {})
        })
        .then(() => {
            return queryInterface.bulkDelete("Payments", null, {})
        })
        .then(() => {
            done();
        })
        .catch(err => {
            done(err);
        })
})



// Find Payments

describe("Show payments", () => {
    it("Find all payments", (done) => {
        request(app)
            .get('/payments')
            .set('Accept', 'application/json')
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toEqual(expect.any(Array));
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Unauthenticate", (done) => {
        request(app)
            .get('/payments')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(400);
                expect(body).toHaveProperty("message", "Unauthenticate")
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })
})

// Report Payments
describe("Report payments", () => {
    it("Report payments", (done) => {
        request(app)
            .get('/payments/reportPayment')
            .set('Accept', 'application/json')
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toEqual(expect.any(Array));
                for(let i = 0; i < body.length ; i++) {
                    expect(body[i]).toHaveProperty("month", body[i].month);
                    expect(body[i]).toHaveProperty("year", body[i].year);
                    expect(body[i]).toHaveProperty("nextDueDate", body[i].nextDueDate);
                    expect(body[i]).toHaveProperty("paidCash", body[i].paidCash);
                }
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
        
    })

})

const tenantId = 1;
const roomId = 1

const due = '2021-06-01'
var dueDate = new Date(due + "T00:00:00");
console.log(dueDate);
// Create Payment
const paymentData = {
    month: 5,
    year: 2021,
    nextDueDate: dueDate,
    paidCash: 2500000
}

// Create Payment

describe("Create Payment", () => {
    it("Adding new payment", (done) => {
        request(app)
            .post(`/payments/${roomId}/${tenantId}`)
            .set('Accept', 'application/json')
            .send(paymentData)
            .expect('Content-Type', /json/)
            .set("access_token", adminToken)
            .then(response => {
                let {body, status} = response;
                console.log(body, "INI DI PAYMENT ")
                expect(status).toBe(201);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("month", 5);
                expect(body).toHaveProperty("year", 2021);
                expect(new Date(body.nextDueDate)).toEqual(dueDate);
                expect(body).toHaveProperty("paidCash", 2500000);
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })
    
    it("Unauthenticate", (done) => {
        request(app)
            .post(`/payments/${roomId}/${tenantId}`)
            .set('Accept', 'application/json')
            .send(paymentData)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(400);
                expect(body).toHaveProperty("message", "Unauthenticate");
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Not sending data", (done) => {
        request(app)
            .post(`/payments/${roomId}/${tenantId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .set("access_token", adminToken)
            .then(response => {
                let {body, status} = response;
                console.log(body, "INI DI PAYMENT TEST, BODY")
                expect(status).toBe(400);
                expect(body).toHaveProperty("message", "Sequelize Validation Error");
                expect(body).toHaveProperty("errors", expect.any(Array));
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })
})

// Find By ID

describe("Find payment by ID", () => {
    it("Find payment by ID success", (done) => {
        request(app)
            .get(`/payments/${publicPaymentId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .set("access_token", adminToken)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("month", 5);
                expect(body).toHaveProperty("year", 2021);
                expect(new Date(body.nextDueDate)).toEqual(dueDate);
                expect(body).toHaveProperty("paidCash", 2500000);
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Unauthenticate", (done) => {
        request(app)
            .get(`/payments/${publicPaymentId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(400);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Unauthenticate");
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Payment Not Found", (done) => {
        request(app)
            .get(`/payments/${999}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .set("access_token", adminToken)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(404);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Payment Not Found");
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })
});

const editString= '2020-06-02'
let editedDate = new Date(editString+ "T00:00:00");
console.log(editedDate);

const editPayment = {
    month: 5,
    year: 2020,
    nextDueDate: editedDate,
    paidCash: 2000000
}



// EDIT Payment

describe("Edit payment", () => {
    it("edit payment success", (done) => {
        request(app)
            .put(`/payments/${publicPaymentId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(editPayment)
            .set("access_token", adminToken)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty("msg", "Payment updated successfully");
                expect(body).toHaveProperty("updatedData", expect.any(Object));
                expect(body.updatedData).toHaveProperty("month", editPayment.month);
                expect(body.updatedData).toHaveProperty("year", editPayment.year);
                expect(body.updatedData).toHaveProperty("paidCash", editPayment.paidCash);
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Unauthenticate", (done) => {
        request(app)
            .put(`/payments/${publicPaymentId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(editPayment)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(400);
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty("message", "Unauthenticate");
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Payment Not Found", (done) => {
        request(app)
            .put(`/payments/${999}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                month: 1,
                year: 2021,
                nextDueDate: new Date(),
                paidCash: 25003400
            })
            .set("access_token", adminToken)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(404);
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty("message", "Payment Not Found");
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("empty string", (done) => {
        request(app)
            .put(`/payments/${publicPaymentId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                month: 0,
                year: "",
                nextDueDate: "",
                paidCash: ""
            })
            .set("access_token", adminToken)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(400);
                expect(body).toEqual(expect.any(Object))
                expect(body).toHaveProperty("message", "Sequelize Validation Error");
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })
})

// DELETE Payment

describe("Delete payment" , () => {
    it("deleting payment success", (done) => {
        request(app)
            .delete(`/payments/${publicPaymentId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .set("access_token", adminToken)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("msg", "Payment successfully deleted");
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    });

    it("Unauthenticate", (done) => {
        request(app)
            .delete(`/payments/${publicPaymentId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(400);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Unauthenticate");
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    });

    it("Payment Not Found", (done) => {
        request(app)
            .delete(`/payments/${999}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .set("access_token", adminToken)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(404);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Payment Not Found");
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    });
});





