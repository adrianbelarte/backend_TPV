'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TicketProducto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TicketProducto.init({
    ticketId: DataTypes.INTEGER,
    productoId: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TicketProducto',
  });
  return TicketProducto;
};