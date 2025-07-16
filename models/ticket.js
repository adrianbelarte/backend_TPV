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
  Ticket.belongsToMany(models.Producto, {
    through: models.TicketProducto,
    foreignKey: 'ticketId',
    otherKey: 'productoId',
    as: 'productos'
  });
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