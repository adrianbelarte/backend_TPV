// migrations/XXXXXXXXXXXX-add-logo-to-empresa.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Empresas", "logo", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Empresas", "logo");
  },
};
