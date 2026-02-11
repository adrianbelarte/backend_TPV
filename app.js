require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => res.send('ok'));

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/exports', express.static(path.join(__dirname, 'exports')));


// Rutas de impresión (las de tu servicio actual)
const imprimirRouter = require('./routes/imprimir');
const imprimirCierreRouter = require('./routes/imprimirCierre');
app.use('/api/imprimir', imprimirRouter);
app.use('/api/imprimir-cierre', imprimirCierreRouter);
app.use('/api/printer', require('./routes/printerConfig'));
// Rutas principales
app.use('/api', routes);

// Ruta base
app.get('/', (_req, res) => {
  res.send('🎉 TPV Hostelería Backend funcionando');
});

// Manejo de errores
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error inesperado' });
});

// Conexión DB y arrancar servidor
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('🟢 DB conectada');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 No se pudo conectar a la base de datos:', err);
  });
