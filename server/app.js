if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express');
const {User} = require("./models")
const app = express();
const cors = require('cors');
const router = require('./routes/index');
const port = process.env.PORT || 4000;
const errorHandler = require('./middlewares/errorHandler.js');
const {monthlyReport} = require("./helpers/cron");
const {generateReport} = require("./controllers/mvp/report")
const cron = require("node-cron");

app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(router)

// MONTHLY REPORT
// cron.schedule(`30 7 3 6 *`, () => {
//   generateReport();
// })

cron.schedule(`0 9 ${monthlyReport().get("date")} * *`, () => {
  generateReport();
})


app.use(errorHandler)

module.exports = app;