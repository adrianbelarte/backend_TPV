'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductoExtra = sequelize.define('ProductoExtra', {
    productoId: DataTypes.INTEGER,
    extraId: DataTypes.INTEGER
  }, {});
  
  ProductoExtra.associate = function(models) {
    // No es necesaria asociación aquí, actúa solo como tabla intermedia
  };

  return ProductoExtra;
};
