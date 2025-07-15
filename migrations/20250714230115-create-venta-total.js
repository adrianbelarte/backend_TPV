'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VentaTotals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      producto: {
        type: Sequelize.STRING
      },
      cantidad: {
        type: Sequelize.INTEGER
      },
      total_targeta: {
        type: Sequelize.FLOAT
      },
      total_efectivo: {
        type: Sequelize.FLOAT
      },
      fecha: {
        type: Sequelize.DATE
      },
      hora: {
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VentaTotals');
  }
};