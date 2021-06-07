const {sendMail} = require('./nodemailer');
const {jsPDF} = require("jspdf");
const autoTable = require("jspdf-autotable")
const moment = require("moment");
const currentYear = moment().format('YYYY');
const {Expense, Payment, sequelize} = require("../../models");
let expenseItems;
let revenueItems;

function generateReport() {
    Expense.findAll({
        where: { year: currentYear },
        attributes: [
            'month',
            'year',
            [ sequelize.fn('sum', sequelize.col('total')), 'totalExpense' ],
        ],
        group: ['month', 'year'],
        })
        .then(found => {
            let expenses = [];
            for(let i = 0; i < found.length; i++) {
                expenses.push(found[i].dataValues);
            }
            expenseItems = expenses;
            console.log(expenseItems);
            return  Payment
            .findAll({
              where: { year: currentYear },
              attributes: [
                'month',
                'year',
                [ sequelize.fn('sum', sequelize.col('paidCash')), 'totalPaid' ],
              ],
              group: ['month', 'year']
            })
        })
        .then(found => {
            let revenues = [];
            for(let i = 0; i < found.length; i++) {
                revenues.push(found[i].dataValues);
            }
            revenueItems = revenues;          
            createReportPDF();
            sendMail(`Laporan Keuangan Bulanan`, `Berikut kami lampirkan laporan keuangan properti anda yang berisi detail properti, penghasilan, dan pengeluaran`);
        })
        .catch(err => {
            console.log(err);
        })
}



const doc = new jsPDF();

function formatMonth(number) {
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
    return monthNames[number-1];
}

function createReportPDF() {

    doc.setFontSize(30)
    doc.text('Revenues Report', 60, 15);
    doc.setFontSize(10)
    doc.autoTable({
        head: [['Id', 'Month', 'Year', 'Total Revenues']],
        margin: {
            top: 25
        },
        body: revenueItems.map((t, index) => {
        return [
            index + 1,
            formatMonth(t.month),
            t.year,
            `Rp. ${t.totalPaid?.toLocaleString()}`,
        ];
        },
        ),
    });
    doc.text("MangKosan", 20, 280)

    doc.addPage();
    doc.setFontSize(30)
    doc.text('Expense Report', 60, 15);
    doc.autoTable({
        head: [['Id', 'Month', 'Year', 'Total Expense']],
        margin: {
            top: 25
        },
        body: expenseItems.map((t, index) => {
        return [
            index + 1,
            formatMonth(t.month),
            t.year,
            `Rp. ${t.totalExpense?.toLocaleString()}`,
        ];
        }),
        
    });
    doc.setFontSize(10)
    doc.text("MangKosan", 20, 280)
    doc.save('Report.pdf');
}

module.exports = {
    generateReport,
    formatMonth,
    createReportPDF
}















