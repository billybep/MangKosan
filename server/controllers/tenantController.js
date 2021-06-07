const { Tenant, User } = require('../models')
const axios = require("axios")

class TenantController {
  static async addTenant(req, res, next) {
    let { email, name, phone, checkIn, checkOut } = req.body
    // console.log(req.loggedUser, "<<<<<<")
    let { id } = req.loggedUser
    try {
      const data = await Tenant.create({
        email,
        name,
        phone,
        checkIn,
        checkOut,
        UserId: id
      })

      res.status(201).json(data)

    } catch (err) {
      next(err)
    }
  }

  static getTenant(req, res, next) {
    Tenant.findAll({ order: [['updatedAt', 'DESC']] })
      .then(data => {
        res.status(200).json(data);
      })

  }

  static async getTenantId(req, res, next) {
    let id = req.params.id
    try {
      const data = await Tenant.findOne({
        where: {
          id
        }
      })

      if (!data) {
        throw { status: 404, message: "error not found" }
      } else {
        res.status(200).json(data)
      }
    } catch (err) {
      next(err)
    }

  }

  static async putTenantId(req, res, next) {
    let { email, name, phone, checkIn, checkOut } = req.body
    let id = +req.params.id
    let data = {
      email,
      name,
      phone,
      checkIn,
      checkOut,
    }
    try {
      const findOne = await Tenant.findOne({ where: { id: id } })
      if (!findOne) {
        throw { status: 404, message: "error not found" }
      } else {
        const updated = await Tenant.update(data, { where: { id: id }, returning: true })
        res.status(200).json(updated[1][0])

      }
    } catch (err) {
      next(err)
    }

  }

  static async patchTenantsId(req, res, next) {
    let { phone } = req.body
    let id = +req.params.id
    try {
      const data = await Tenant.findOne({ where: { id: id } })
      if (!data) {
        throw { status: 404, message: "error not found" }
      } else {
        const updated = await Tenant.update({ phone: phone }, { where: { id: id }, returning: true })
        res.status(200).json({
          updated: updated[1][0]
        })
      }
    }
    catch (err) {
      next(err)
    }
  }


  static async deleteTenantId(req, res, next) {
    let id = +req.params.id
    try {
      const data = await Tenant.findOne({ where: { id: id } })
      if (!data) {
        throw { status: 404, message: "error not found" }
      } else {
        const deleted = await Tenant.destroy({ where: { id: id }, returning: true })
        res.status(200).json({
          message: "Tenant successfully deleted"
        })

      }
    } catch (err) {
      next(err)
    }
  }

}

module.exports = TenantController