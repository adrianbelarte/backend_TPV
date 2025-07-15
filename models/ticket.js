'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ticket.init({
    producto: DataTypes.STRING,
    cantidad: DataTypes.INTEGER,
    fecha: DataTypes.DATE,
    hora: DataTypes.STRING,
    tipo_pago: DataTypes.STRING,
    total: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};