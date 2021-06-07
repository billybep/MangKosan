const {Room, Property, Tenant, Payment, User, sequelize} = require("../models")
const { paymentRemainder } = require('../helpers/cron')
class PaymentController {
    static createPayment(req, res, next) {
        let {month, year, nextDueDate, paidCash} = req.body;
        let {roomId, tenantId} = req.params;
        let paymentData = {};
        let tenantData = {};
        let userData = {};
        let roomData = {};

        Payment.create({
            month,
            year,
            nextDueDate,
            paidCash,
            roomId,
            tenantId
        })
        .then(data => {
            paymentData = data;
            Room
              .update(
                  { status: 'occupied' },
                  { where: { id : roomId }}
                )
                
        })
        .then(data => {
            tenantData = data;
            return User.findOne({
                where: {
                    id: req.loggedUser.id
                },
                include: {
                    model: Property
                }
            })

        })
        .then(data => {
            userData = data;
            return Room.findByPk(roomId);
        })
        .then(data => {
            roomData = data;

            return Tenant.findByPk(tenantId)
        })
        .then(data => {
            const duedate = new Date(nextDueDate)
            // pasang cron schedule disini
            paymentRemainder(duedate, data.email, data.name, userData, roomData);
            res.status(201).json(paymentData);
        })
        .catch(err => {
            next(err);
        })
    }

    static findPayments(req, res, next) {
        Payment.findAll({
            include: [
                {
                    model: Room
                },
                {
                    model: Tenant
                }
            ]
        })
        .then(data => {
            res.status(200).json(data);
        })
        // .catch(err => {
        //     next(err);
        // })
    }

    static deletePayment(req, res, next) {
        let id = req.params.id;
        Payment.destroy({
            where: {
                id
            }
        })
        .then(data => {

            if(data === 0) {
                next({name: "PaymentNotFound"});
            } else {
                res.status(200).json({
                    msg: "Payment successfully deleted"
                })
            }
        })
        // .catch(err => {
        //     console.log(err);
        //     next(err);  
        // })
    }

    static findPaymentById(req, res, next) {
        let id = req.params.id;
        Payment.findByPk(id)
            .then(data => {
                console.log(data, "LAGI DI PAYMENT FIND BY PK")
                if(data === null) {
                    next({name: "PaymentNotFound"})
                } else {
                    res.status(200).json(data);
                }
            })
            // .catch(err => {
            //     console.log(err);
            //     next(err);
            // })
    }

    static editPayment(req, res, next) {
        let {id} = req.params;
        let {month, year, nextDueDate, paidCash} = req.body;

        Payment.update({
            month,
            year,
            nextDueDate,
            paidCash,
        }, {
            where: {
                id
            },
            returning: true
        })
        .then(data => {
            if(data[0] === 0) {
                next({name: "PaymentNotFound"})
            } else {
                res.status(200).json({
                    msg: "Payment updated successfully",
                    updatedData: data[1][0]
                })
            }
        })
        .catch(err => {
            next(err);
        })
    }

    static reportPayment = (req, res, next) => {
      
      let year = new Date()
      year = year.getFullYear()

      Payment
        .findAll({
          where: { year },
          attributes: [
            'month',
            'year',
            [ sequelize.fn('sum', sequelize.col('paidCash')), 'totalPaid' ],
          ],
          group: ['month', 'year']
        })
        .then(data => {
          res.status(200).json(data)
          
        })
        // .catch(err => next(err))
    }
}

module.exports = PaymentController;