'use strict';

const dateString = '2021-05-01'
var firstDate = new Date(dateString + "T00:00:00");


const dateStr2 = '2021-06-01'
var secondDate = new Date(dateStr2 + "T00:00:00");


const dateStr3 = '2021-07-01'
var thirdDate = new Date(dateStr3 + "T00:00:00");


const {Tenant, Room} = require("../models")
let roomId;
let tenantId;
module.exports = {
  up:  (queryInterface, Sequelize) => {
    return Tenant.findOne({
      where: {
        email: "qojack82nasution@gmail.com"
      }
    })
    .then(data => {
      tenantId = data.id;
      return Room.findOne({
        where: {
          number: 105
        }
      })
      .then(data => {
        return queryInterface.bulkInsert("Payments", [
          {
            month: 4,
            year: 2021,
            nextDueDate: firstDate,
            paidCash: 2500000,
            tenantId,
            roomId: data.id,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            month: 5,
            year: 2021,
            nextDueDate: secondDate,
            paidCash: 2500000,
            tenantId,
            roomId: data.id,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            month: 6,
            year: 2021,
            nextDueDate: thirdDate,
            paidCash: 2500000,
            tenantId,
            roomId: data.id,
            createdAt: new Date(),
            updatedAt: new Date()
          },
        ], {})
      })
    })
    
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down:  (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Payments", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};


