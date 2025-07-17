'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TicketProducto extends Model {
    static associate(models) {
      // TicketProducto pertenece a un Ticket
      TicketProducto.belongsTo(models.Ticket, { foreignKey: 'ticketId' });
      // TicketProducto pertenece a un Producto
      TicketProducto.belongsTo(models.Producto, { foreignKey: 'productoId' });
    }
  }
  TicketProducto.init({
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Tickets', key: 'id' },
      onDelete: 'CASCADE',
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Productos', key: 'id' },
      onDelete: 'CASCADE',
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      }
    }
  }, {
    sequelize,
    modelName: 'TicketProducto',
  });
  return TicketProducto;
};
