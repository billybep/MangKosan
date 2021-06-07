'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property.belongsTo(models.User, {foreignKey: "userId"});
      Property.hasMany(models.Room, {foreignKey: "propertyId"});
      Property.hasMany(models.Revenue, {foreignKey: "propertyId"});
      Property.hasMany(models.Expense, {foreignKey: "propertyId"});
    }
  };
  Property.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "name mustn't empty"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "address mustn't empty"
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "image mustn't empty"
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "phone mustn't empty"
        }
      }
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Property',
  });
  return Property;
};