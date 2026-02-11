'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('VentaTotals', 'productos_json', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('VentaTotals', 'export_xlsx', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('VentaTotals', 'printed_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('VentaTotals', 'reprinted_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('VentaTotals', 'productos_json');
    await queryInterface.removeColumn('VentaTotals', 'export_xlsx');
    await queryInterface.removeColumn('VentaTotals', 'printed_at');
    await queryInterface.removeColumn('VentaTotals', 'reprinted_count');
  }
};
