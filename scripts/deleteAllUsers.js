// scripts/deleteAllUsers.js
const { sequelize, User } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    await User.destroy({ where: {}, truncate: true });
    console.log('✅ Todos los usuarios han sido eliminados.');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error al eliminar usuarios:', error);
  }
})();
