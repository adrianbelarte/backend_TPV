'use strict';
module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es obligatorio'
        }
      }
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: 'El precio debe ser un número'
        },
        min: {
          args: [0],
          msg: 'El precio debe ser mayor o igual a 0'
        }
      }
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});

  Producto.associate = function(models) {
    Producto.belongsTo(models.Categoria, {
      foreignKey: 'categoriaId',
      as: 'categoria',
    });

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
