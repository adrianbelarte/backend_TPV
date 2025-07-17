const { sequelize } = require('./models');

async function dropTable() {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');

    // Borra la tabla VentaTotals
    await sequelize.query('DROP TABLE IF EXISTS VentaTotals;');
    console.log('Tabla VentaTotals eliminada');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

dropTable();
