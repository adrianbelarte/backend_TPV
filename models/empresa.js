// models/empresa.js
"use strict";
module.exports = (sequelize, DataTypes) => {
  const Empresa = sequelize.define(
    "Empresa",
    {
      nombre: DataTypes.STRING,
      direccion: DataTypes.STRING,
      telefono: DataTypes.STRING,
      correo: DataTypes.STRING,
      cif: DataTypes.STRING,
      logo: DataTypes.STRING, // 👈 NUEVO
    },
    {}
  );
  return Empresa;
};
