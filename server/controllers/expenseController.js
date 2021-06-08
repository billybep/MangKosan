const {Expense} = require("../models");
const sequelize = require("sequelize");

class ExpenseController {
    
  static async addExpense(req, res, next) {
    let { title, month, year, total } = req.body
    let currentUser = req.loggedUser;
    let ownedProperty = currentUser.ownedProperty
    try {
      const data = await Expense.create({
        title,
        month, 
        year,
        total,
        propertyId: ownedProperty.id
      })
        res.status(201).json(data)
    } catch(err) {
      next(err)
    }
  }

  static async getExpense(req, res, next) {
    try {
      const data = await Expense.findAll()
      res.status(200).json(data);
    } catch(err) {
      next(err)
    }
  }
    
  static async getReportExpense(req, res, next) {
    try {
      let year = new Date()
      year = year.getFullYear()
      const data = await Expense.findAll({
        where: { year },
        attributes: [
            'month',
            "year",
            [ sequelize.fn('sum', sequelize.col('total')), 'totalExpense' ],
        ],
        group: ['month', "year"],
      });
        res.status(200).json(data);
    } catch (err) {
      next(err)   
    }
  }

  static async getExpenseId(req, res, next) {
    let id = req.params.id
    try {
      const data = await Expense.findOne({ where: { id }})
      if (data === null) {
          next({name: "ExpenseNotFound"});
        } else {
            res.status(200).json(data)
        }
    } catch(err) {
      next(err)
    }
  }

  static async putExpenseId(req, res, next) {
    let { title, month, year, total } = req.body
    let id = +req.params.id
    let data = {
      title,
      month,
      year,
      total,
    }
    try {
      const findOne = await Expense.findOne({where: { id: id }})
      if(!findOne) next({name: "ExpenseNotFound"})
      else {
        const updated = await Expense.update(data, { where: { id: id }, returning: true })
        res.status(200).json(updated[1][0])
      }
    } catch (err) {
      next(err)
    }  
  }

  static async patchExpensesId(req, res, next) {
    let { title } = req.body
    let id = +req.params.id
    try {
      const data = await Expense.findOne({where: { id: id }})
      if(!data) next({name: "ExpenseNotFound"});
      else {
        const updated = await Expense.update({ title: title }, { where: { id: id }, returning: true })
          res.status(200).json({
            updated:updated[1][0]
        })
      }
    } catch (err) {
      next(err)
    }
  }

  static async deleteExpenseId(req, res, next) {
    let id = +req.params.id
    try {
        const data = await Expense.findOne({where: { id: id }})
        if(!data) next({name: "ExpenseNotFound"});
        else {
          const deleted = await Expense.destroy({ where: { id }, returning: true })
          res.status(200).json({
              message: "Expense successfully deleted"
          })
        }
    } catch(err) {
        next(err)
    }
  }
}

module.exports = ExpenseController;
