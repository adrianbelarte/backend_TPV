// routes/index.js
const express = require('express');
const router = express.Router();
const cerrarCajaController = require('../controllers/cerrarCaja');


router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/categorias', require('./categoriaRoutes'));
router.use('/productos', require('./productoRoutes'));
router.use('/empresa', require('./empresaRoutes')); 
router.post('/cerrar-caja', cerrarCajaController.cerrarCaja);
router.use('/tickets', require('./ticketRoutes'));
router.use('/auth', require('./authRoutes'));

module.exports = router;
