require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('./models');
const routes = require('./routes');

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/exports', express.static('exports'));

// Rutas
app.use('/api', routes);

// Ruta base
app.get('/', (req, res) => {
  res.send('🎉 TPV Hostelería Backend funcionando');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Error inesperado',
  });
  
});

// Conexión DB y arrancar servidor
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('DB conectada');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
