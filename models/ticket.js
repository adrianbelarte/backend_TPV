'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      Ticket.belongsToMany(models.Producto, {
        through: models.TicketProducto,
        foreignKey: 'ticketId',
        otherKey: 'productoId',
        as: 'productos',
      });
    }
  }
  Ticket.init({
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hora: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipo_pago: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      }
    }
  }, {
    sequelize,
    modelName: 'Ticket',
    paranoid: true, 
  });
  return Ticket;
};
