'use strict';
module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    nombre: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    imagen: DataTypes.STRING,
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: true, // << opcional
    }
  }, {});

  Producto.associate = function(models) {
  Producto.belongsTo(models.Categoria, {
    foreignKey: 'categoriaId',
    as: 'categoria',
  });

  // Asociación muchos a muchos con otros productos como extras
  Producto.belongsToMany(models.Producto, {
    through: models.ProductoExtra,
    as: 'extras',
    foreignKey: 'productoId',
    otherKey: 'extraId',
  });

  Producto.belongsToMany(models.Producto, {
    through: models.ProductoExtra,
    as: 'baseDe',
    foreignKey: 'extraId',
    otherKey: 'productoId',
  });

  Producto.belongsToMany(models.Ticket, {
  through: models.TicketProducto,
  foreignKey: 'productoId',
  otherKey: 'ticketId',
  as: 'tickets'
});

};

  return Producto;
};
