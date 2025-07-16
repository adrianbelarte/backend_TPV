// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/categorias', require('./categoriaRoutes'));
router.use('/productos', require('./productoRoutes'));
router.use('/empresa', require('./empresaRoutes')); 
router.use('/ventaTotal', require('./ventaTotalRoutes'));
router.use('/tickets', require('./ticketRoutes'));
router.use('/auth', require('./authRoutes'));

module.exports = router;
