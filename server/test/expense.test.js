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

let adminToken = "";

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
                    name: "Wisma",
                    address: "Tanah Lot",
                    image: "blabla",
                    phone: "14256",
                    userId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ], {})
        })
    .then(_ => {
        return queryInterface.bulkInsert("Expenses", [
            {
                id: 1,
                title: "Bayar Listrik",
                month: 4,
                year: 2021,
                total: 7000000,
                propertyId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                title: "Service AC",
                month: 4,
                year: 2021,
                total: 2000000,
                propertyId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                title: "Stock Sprei",
                month: 4,
                year: 2021,
                total: 1000000,
                propertyId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {})
    })
    .then(_ => {
        done();
    })
    .catch(err => {
        console.log(err);
        done(err);
    })
});

afterAll(done => {
    queryInterface.bulkDelete("Users", null, {})
        .then(() => {
            return queryInterface.bulkDelete("Properties", null, {})
        })
        .then(() => {
            return queryInterface.bulkDelete("Expenses", null, {})
        })
        .then(() => {
            done()
        })
        .catch(err => {
            console.log(err);
            done(err);
        })
})

const dateString = '2014-04-03'
var mydate = new Date(dateString + "T00:00:00");
console.log(mydate);

const expected = [
    {
        id: 1,
        title: "Bayar Listrik",
        month: 4,
        year: 2021,
        total: 7000000,
        propertyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        title: "Service AC",
        month: 4,
        year: 2021,
        total: 2000000,
        propertyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        title: "Stock Sprei",
        month: 4,
        year: 2021,
        total: 1000000,
        propertyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]


// Find All
describe("Test find all expenses", () => {
    it("find all expenses", (done) => {
        request(app)
            .get('/expenses')
            .set('Accept', 'application/json')
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toEqual(expect.any(Array));

                for(let i = 0; i < body.length; i++) {
                    expect(body[i]).toHaveProperty("title", expected[i].title);
                    expect(body[i]).toHaveProperty("month", expected[i].month);
                    expect(body[i]).toHaveProperty("year", expected[i].year);
                    expect(body[i]).toHaveProperty("total", expected[i].total);
                }

                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Unauthenticate", (done) => {
        request(app)
            .get('/expenses/reportExpense')
            .set('Accept', 'application/json')
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

    it("Success find report", (done) => {
        request(app)
            .get('/expenses/reportExpense')
            .set('Accept', 'application/json')
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toEqual(expect.any(Array));
                for(let i = 0; i < body.length; i++) {
                    expect(body[i]).toHaveProperty("month", expected[i].month);
                    expect(body[i]).toHaveProperty("year", expected[i].year);
                    // expect(body[i]).toHaveProperty("total", expected[i].total);
                }
                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })


})

const testId = 1;

// Test Find One
describe("Test findOne", () => {
    it("find expense by id success", (done) => {
        request(app)
            .get(`/expenses/${testId}`)
            .set('Accept', 'application/json')
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("title", expected[0].title);
                expect(body).toHaveProperty("month", expected[0].month);
                expect(body).toHaveProperty("year", expected[0].year);
                expect(body).toHaveProperty("total", expected[0].total);

                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Unauthenticate", (done) => {
        request(app)
            .get(`/expenses/${testId}`)
            .set('Accept', 'application/json')
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

    it("Expense not found", (done) => {
        request(app)
            .get(`/expenses/${999}`)
            .set('Accept', 'application/json')
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(404);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Expense Not Found");
                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })
})

// Create Expense

let newExpense = {
    title: "Beli pompa air",
    month: 4,
    year: 2021,
    total: 4000000,
    propertyId: 1
}

describe("Test create expense", () => {
    it("Create expense success", (done) => {
        request(app)
            .post(`/expenses`)
            .set('Accept', 'application/json')
            .send(newExpense)
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                console.log(response.body, "INI DI EXPENSE TEST JS");
                let {body, status} = response;
                expect(status).toBe(201);
                expect(body).toHaveProperty("title", newExpense.title);
                expect(body).toHaveProperty("month", newExpense.month);
                expect(body).toHaveProperty("year", newExpense.year);
                expect(body).toHaveProperty("total", newExpense.total);
                expect(body).toHaveProperty("propertyId", newExpense.propertyId);
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Unauthenticate", (done) => {
        request(app)
            .post(`/expenses`)
            .set('Accept', 'application/json')
            .send(newExpense)
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

    it("Create expense failed", (done) => {
        request(app)
            .post(`/expenses`)
            .set('Accept', 'application/json')
            .send({
                title: "",
                month: 0,
                year: 0,
                total: 0,
                propertyId: 1
            })
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(400);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Sequelize Validation Error");
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            })
    })
})

const updateData = {
    title: "Beli stok tanaman hias",
    month: 2,
    year: 2021,
    total: 1500000
}

// Update Expense

describe("Updating expense test", () => {
    it("Updating expense success", (done) => {
        request(app)
            .put(`/expenses/${testId}`)
            .set('Accept', 'application/json')
            .send(updateData)
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toHaveProperty("title", updateData.title);
                expect(body).toHaveProperty("month", updateData.month);
                expect(body).toHaveProperty("year", updateData.year);
                expect(body).toHaveProperty("total", updateData.total);
                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Unauthenticate", (done) => {
        request(app)
            .put(`/expenses/${testId}`)
            .set('Accept', 'application/json')
            .send(updateData)
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

    it("Validation error", (done) => {
        request(app)
            .put(`/expenses/${testId}`)
            .set('Accept', 'application/json')
            .send({
                title: "",
                month: 0,
                year: 0,
                total: 0
            })
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(400);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Sequelize Validation Error");
                expect(body).toHaveProperty("errors", expect.any(Array));
                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Expense Not Found", (done) => {
        request(app)
            .put(`/expenses/${999}`)
            .set('Accept', 'application/json')
            .send(updateData)
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(404);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Expense Not Found");
                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })
})

// Updating the title

describe("Updating title test", () => {
    it("Updating title success", (done) => {
        request(app)
            .patch(`/expenses/${testId}`)
            .set('Accept', 'application/json')
            .send({
                title: "Beli stok galon air mineral"
            })
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toHaveProperty("updated", expect.any(Object));
                expect(body.updated).toHaveProperty("title", "Beli stok galon air mineral");
                expect(body.updated).toHaveProperty("month", updateData.month);
                expect(body.updated).toHaveProperty("year", updateData.year);
                expect(body.updated).toHaveProperty("total", updateData.total);
                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Unauthenticate", (done) => {
        request(app)
            .patch(`/expenses/${testId}`)
            .set('Accept', 'application/json')
            .send(updateData)
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

    it("Validation error", (done) => {
        request(app)
            .patch(`/expenses/${testId}`)
            .set('Accept', 'application/json')
            .send({
                title: "",
                month: 0,
                year: 0,
                total: 0
            })
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(400);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Sequelize Validation Error");
                expect(body).toHaveProperty("errors", expect.any(Array));
                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Expense Not Found", (done) => {
        request(app)
            .patch(`/expenses/${999}`)
            .set('Accept', 'application/json')
            .send(updateData)
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(404);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Expense Not Found");
                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })
})

// Testing Delete

describe("Delete expense test", () => {
    it("Deleting expense test", (done) => {
        request(app)
            .delete(`/expenses/${testId}`)
            .set('Accept', 'application/json')
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(200);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Expense successfully deleted");
                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })

    it("Unauthenticate", (done) => {
        request(app)
            .delete(`/expenses/${testId}`)
            .set('Accept', 'application/json')
            .send(updateData)
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

    it("Expense Not Found", (done) => {
        request(app)
            .delete(`/expenses/${999}`)
            .set('Accept', 'application/json')
            .send(updateData)
            .set("access_token", adminToken)
            .expect('Content-Type', /json/)
            .then(response => {
                let {body, status} = response;
                expect(status).toBe(404);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Expense Not Found");
                done();
            })  
            .catch(err => {
                console.log(err);
                done(err);
            })
    })
})
