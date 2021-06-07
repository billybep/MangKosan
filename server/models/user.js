'use strict';
const {
  Model
} = require('sequelize');
const {hashPassword} = require('../helpers/bcrypt.js')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Property, {foreignKey: "userId"});
    }
  };
  User.init({
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
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: `username musn't be empty`
        }
      }
    },
    fullname: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: `fullname musn't be empty`
        }
      }
    },
    bankAccount: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: `bankAccount musn't be empty`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: `password musn't be empty`
        },
        len: {
          args: [5],
          msg: 'password minimal length is 5'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(instance, options) {
        const hashedPasswords = hashPassword(instance.password)
        instance.password = hashedPasswords
      }
    }
  });
  return User;
};