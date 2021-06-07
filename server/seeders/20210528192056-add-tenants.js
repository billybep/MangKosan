'use strict';

const dateString = '2021-04-01'
var firstDate = new Date(dateString + "T00:00:00");


const dateStr2 = '2021-05-01'
var secondDate = new Date(dateStr2 + "T00:00:00");


const dateStr3 = '2021-06-01'
var thirdDate = new Date(dateStr3 + "T00:00:00");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Tenants", [
      {
        email: "qojack82nasution@gmail.com",
        name: "Jack",
        phone: "085253440512",
        checkIn: firstDate,
        checkOut: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: "jecksfresley.gaming@gmail.com",
        name: "Jecksen",
        phone: "085398464583",
        checkIn: secondDate,
        checkOut: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: "hidayatarifin063@gmail.com",
        name: "Arifin",
        phone: "081347767810",
        checkIn: thirdDate,
        checkOut: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tenants", null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
