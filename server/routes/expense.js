const express = require("express");
const expenseRouter = express.Router();
const ExpenseController = require("../controllers/expenseController");

expenseRouter.post('/', ExpenseController.addExpense)

expenseRouter.get('/', ExpenseController.getExpense)

expenseRouter.get('/reportExpense', ExpenseController.getReportExpense)

expenseRouter.get('/:id', ExpenseController.getExpenseId)

expenseRouter.put('/:id', ExpenseController.putExpenseId)

expenseRouter.patch('/:id', ExpenseController.patchExpensesId)

expenseRouter.delete('/:id', ExpenseController.deleteExpenseId)

module.exports = expenseRouter
