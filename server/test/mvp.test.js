const request = require("supertest");
const app = require("../app.js");
const {sequelize} = require("../models");
const {queryInterface} = sequelize;
const {sendMail, convertToRupiah, sendMailTenant} = require("../controllers/mvp/nodemailer");
const {formatMonth, generateReport, createReportPDF} = require("../controllers/mvp/report");

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

describe("Test nodemailer", () => {

    test("nodemailer owner", async () => {
        let msg = await sendMail("blabla", "blabla")
        console.log(msg, "INI MESSAGE")
    })

    test("nodemailer tenant", async () => {
        let msg = await sendMailTenant("blabla", "blabla")
        expect(msg).toBe(undefined);
    })


})

describe("Testing report js", () => {
    test("Format month", () => {
        for(let i = 0; i < monthNames.length; i++) {
            expect(formatMonth(i+1)).toBe(monthNames[i])
        }
    })

    test("Convert To Rupiah", () => {
        expect(convertToRupiah(50000)).toEqual(expect.any(String));
        expect(convertToRupiah(100000)).toEqual("Rp. 100.000");
        expect(convertToRupiah(250000)).toEqual("Rp. 250.000");
    })

    // test("create report pdf", () => {
    //     createReportPDF();
    // })

})
