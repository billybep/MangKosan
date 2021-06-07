'use strict';

const {User} = require("../models")


module.exports = {
  up:  (queryInterface, Sequelize) => {
    return User.findOne({
      where: {
        email: "muhammadihsan076@gmail.com"
      }
    })
    .then(data => {
      return queryInterface.bulkInsert("Properties", [
        {
          name: "Wisma Andara",
          address: "Jl. Andara Raya, Pangkalan Jati Baru, Kec. Cinere, Kota Depok, Jawa Barat.",
          image: "https://blogpictures.99.co/sumber-gridid2.png",
          phone: "082110112795",
          userId: data.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {})
    })
    
  },

  down:  (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Properties", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
