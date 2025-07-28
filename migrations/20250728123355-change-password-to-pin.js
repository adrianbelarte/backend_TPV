'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero elimina la columna "password"
    await queryInterface.removeColumn('Users', 'password');

    // Luego agrega "pin" con un valor por defecto (temporal)
    await queryInterface.addColumn('Users', 'pin', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '0000', // Valor por defecto para filas existentes
    });
  },

  async down(queryInterface, Sequelize) {
    // Quitar "pin"
    await queryInterface.removeColumn('Users', 'pin');

    // Restaurar "password"
    await queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '', // Evita error al revertir
    });
  }
};
