'use strict';

const {Property} = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Property.findOne({
      where: {
        name: "Wisma Andara"
      }
    })
    .then(data => {
      return queryInterface.bulkInsert("Revenues", [
        {
          month: 1,
          year: 2021,
          total: 4000000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 2,
          year: 2021,
          total: 5500000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 3,
          year: 2021,
          total: 2500000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 4,
          year: 2021,
          total: 4500000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 5,
          year: 2021,
          total: 4000000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 6,
          year: 2021,
          total: 6500000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 7,
          year: 2021,
          total: 3600000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 8,
          year: 2021,
          total: 2400000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 9,
          year: 2021,
          total: 4000000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 10,
          year: 2021,
          total: 3500000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 11,
          year: 2021,
          total: 25000000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          month: 12,
          year: 2021,
          total: 1500000,
          propertyId: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
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

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Revenues", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
