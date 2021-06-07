const express = require("express");
const paymentRouter = express.Router();
const PaymentController = require("../controllers/paymentController");

paymentRouter.get("/", PaymentController.findPayments);
paymentRouter.get("/reportPayment", PaymentController.reportPayment);
paymentRouter.post("/:roomId/:tenantId", PaymentController.createPayment);
paymentRouter.get("/:id", PaymentController.findPaymentById);
paymentRouter.put("/:id", PaymentController.editPayment);
paymentRouter.delete("/:id", PaymentController.deletePayment);



module.exports = paymentRouter

