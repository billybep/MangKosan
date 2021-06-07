const propertyRouter = require('express').Router()
const PropertyController = require('../controllers/propertyController')

propertyRouter.post('/', PropertyController.create)
propertyRouter.get('/', PropertyController.readAll)
propertyRouter.put('/:id', PropertyController.update)
propertyRouter.delete('/:id', PropertyController.delete)

module.exports = propertyRouter