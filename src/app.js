// src/app.js

require('dotenv').config();
const express = require('express');
const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder para archivos subidos
app.use('/uploads', express.static(__dirname + '/uploads'));

// Importar rutas (vacías por ahora)
const routes = require('./routes');
app.use('/api', routes);

// Ruta base
app.get('/', (req, res) => {
  res.send('🎉 TPV Hostelería Backend funcionando');
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
