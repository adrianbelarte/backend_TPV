require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const { sequelize } = require('./models');
const routes = require('./routes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/exports', express.static('exports'));

// ✅ Health para Electron
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ✅ Rutas API
app.use('/api', routes);

// Root
app.get('/', (_req, res) => {
  res.send('🎉 TPV Hostelería Backend funcionando');
});

// Errores
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Error inesperado',
  });
});

// Start
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
