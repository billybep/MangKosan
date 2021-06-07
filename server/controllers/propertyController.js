const { Property, User } = require('../models')

class PropertyController {

  static create = (req, res, next) => {

    const loggedUser = req.loggedUser;
    console.log(loggedUser, "INI DI PROPERTY CONTROLLER")
    
    const addProperty = {
      name    : req.body.name,
      address : req.body.address,
      image   : req.body.image,
      phone   : req.body.phone,
      userId  : loggedUser.id
    }

    Property
      .create({ ...addProperty})
      .then(data => {
        res.status(201).json({
          id: data.id,
          name : data.name,
          address : data.address,
          image: data.image,
          phone: data.phone,
          userId: data.userId
        })
      })
      .catch(err => next(err))
  }

  static readAll = (req, res, next) => {
    Property
      .findAll({ include : { model: User } })
      .then(data => {
        const properties = data.map(property => {
          return {
            id          : property.id,
            name        : property.name,
            address     : property.address,
            image       : property.image,
            phone       : property.phone,
            userId      : property.userId,
            username    : property.User.username,
            email       : property.User.email,
            fullname    : property.User.fullname,
            bankAccount : property.User.bankAccount
          }
        })
        res.status(200).json({properties})
      })
      .catch(err => next(err))
  }

  static update = (req, res, next) => {
    const id = req.params.id

    const dataUpdate = {
      name : req.body.name,
      address : req.body.address,
      image: req.body.image,
      phone: req.body.phone
    }

    Property
      .update(dataUpdate, { where: {id}, returning: true })
      .then(updated => res.status(200).json({ updated }))
      .catch(err => next(err))
  }

  static delete = (req, res, next) => {
    const id = +req.params.id
    console.log("MASUKK SINI")
    Property
      .destroy({ where: {id}, returning: true })
      .then(deleted => {
        if(deleted) res.status(200).json({ message: 'Property has been delete!' })
        else {
          res.status(404).json({ message: 'Data not found!'})
        }
      })
      .catch(err => next(err))
  }

}

module.exports = PropertyController