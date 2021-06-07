const { Revenue } = require('../models')

class RevenueController {

  static readAll = (req, res, next) => {
    console.log('readd');
    Revenue
      .findAll()
      .then(revenues => res.status(200).json({revenues}))
      .catch(err => next(err))
  }

  static create = (req, res, next) => {

    const newRevenue = {
      month : req.body.month,
      year: req.body.year,
      total: req.body.total,
      propertyId: req.body.propertyId
    }

    Revenue
      .create(newRevenue)
      .then(data => {
        res.status(201).json({
          month : data.month,
          year: data.year,
          total: data.total,
          propertyId: data.propertyId
        })
      })
      .catch(err => next(err))
  }

  static update = (req, res, next) => {
    
    const id = req.params.id
    const updateData = {
      month: req.body.month,
      year: req.body.year,
      total: req.body.total,
      propertyId: req.body.propertyId
    }

    Revenue
      .update(updateData, { where: {id}, returning: true })
      .then(updated => res.status(200).json({ updated }))
      .catch(err => next(err))

  }

  static delete = (req, res, next) => {
    const id = req.params.id

    Revenue
      .destroy({ where: {id}, returning: true })
      .then(deleted => {
        if(deleted) res.status(200).json({ message: 'Revenue record successfull delete!'})
        else next({name: "RevenueNotFound"})
      })
      .catch(err => next(err))

  }
}

module.exports = RevenueController