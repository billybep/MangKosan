'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsTo(models.Property, {foreignKey: "propertyId"});
      Room.belongsToMany(models.Tenant, {through: models.Payment, foreignKey: "roomId"});
    }
  };
  Room.init({
    number: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "number mustn't be empty"
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['empty', 'maintenance', 'occupied']],
          msg: "Insert Valid Status"
        }
      }
    },
    propertyId: DataTypes.INTEGER,
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['standard', 'deluxe']],
          msg: "Insert Valid Type"
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          msg: "type mustn't be empty"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Room',
    hooks: {
      beforeCreate(instance, options) {
        instance.status = instance.status.toLowerCase();
        instance.type = instance.type.toLowerCase();
        if (instance.type === 'standard') {
          instance.price = 1500000
        } else if (instance.type === 'deluxe') {
          instance.price = 2500000
        }
      }
    }

  });
  return Room;
};