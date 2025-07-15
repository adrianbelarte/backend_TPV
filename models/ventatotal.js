'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VentaTotal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VentaTotal.init({
    producto: DataTypes.STRING,
    cantidad: DataTypes.INTEGER,
    total_targeta: DataTypes.FLOAT,
    total_efectivo: DataTypes.FLOAT,
    fecha: DataTypes.DATE,
    hora: DataTypes.STRING,
    total: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'VentaTotal',
  });
  return VentaTotal;
};