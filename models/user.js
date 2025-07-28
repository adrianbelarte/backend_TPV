'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relaciones aquí si las tienes
    }
  }

  User.init({
    nombre: DataTypes.STRING,
  email: DataTypes.STRING,
  pin: DataTypes.STRING,  // antes era 'password'
  rol: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
