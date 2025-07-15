module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Subproductos');
  },
  down: async (queryInterface, Sequelize) => {
    // Si quieres poder revertir, aquí puedes volver a crear la tabla
  }
};
