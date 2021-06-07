'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tenant.belongsToMany(models.Room, {through: models.Payment, foreignKey: "tenantId"});
    }
  };
  Tenant.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: `Email is invalid`
        },
        notEmpty: {
          msg: `email musn't be empty`
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: `name musn't be empty`
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: `phone musn't be empty`
        }
      }
    },
    checkIn: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: `checkIn musn't be empty`
        }
      }
    },
    checkOut: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: `checkOut musn't be empty`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Tenant',
  });
  return Tenant;
};