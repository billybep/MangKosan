'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Revenue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Revenue.belongsTo(models.Property, {foreignKey: "propertyId"});
    }
  };
  Revenue.init({
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12
      }
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "year mustn't empty"
        }
      }
    },
    total: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          msg: "total mustn't empty"
        }
      }
    },
    propertyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Revenue',
  });
  return Revenue;
};
