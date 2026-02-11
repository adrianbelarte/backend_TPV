'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VentaTotal extends Model {
    static associate(models) {}
  }

  VentaTotal.init({
    fecha: DataTypes.DATEONLY,      // ✅ alinear con migración
    total_tarjeta: DataTypes.FLOAT,
    total_efectivo: DataTypes.FLOAT,
    total_general: DataTypes.FLOAT,

    // ✅ nuevos campos
    productos_json: DataTypes.TEXT,
    export_xlsx: DataTypes.TEXT,
    printed_at: DataTypes.DATE,
    reprinted_count: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'VentaTotal',
  });

  return VentaTotal;
};
