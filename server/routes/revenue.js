const revenueRouter = require('express').Router()
const RevenueController = require('../controllers/revenueController')
const { authorization } = require('../middlewares/auth')

revenueRouter.post('/', RevenueController.create)
revenueRouter.get('/', RevenueController.readAll)
revenueRouter.put('/:id', RevenueController.update)
revenueRouter.delete('/:id', RevenueController.delete)

module.exports = revenueRouter