'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // En SQLite basta con dropTable; si no existiera, no fallará si envuelves en try/catch.
    try {
      await queryInterface.dropTable('ProductoExtras');
    } catch (e) {
      console.warn('ProductoExtras no existe o ya fue eliminada:', e.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // (Opcional) Recrea la tabla puente mínima para poder revertir
    await queryInterface.createTable('ProductoExtras', {
      productoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Productos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      extraId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Productos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('CURRENT_TIMESTAMP') },
    });

    // Clave primaria compuesta (en SQLite se implementa como UNIQUE + índice implícito)
    await queryInterface.addConstraint('ProductoExtras', {
      fields: ['productoId', 'extraId'],
      type: 'primary key',
      name: 'PK_ProductoExtras',
    });
  },
};
