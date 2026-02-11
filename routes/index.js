const express = require('express');
const router = express.Router();

const cerrarCajaController = require('../controllers/cerrarCaja');

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/categorias', require('./categoriaRoutes'));
router.use('/productos', require('./productoRoutes'));
router.use('/empresa', require('./empresaRoutes'));
router.use('/tickets', require('./ticketRoutes'));

// ✅ imprimir ticket + imprimir cierre
router.use('/imprimir', require('./imprimirRoutes'));
router.use('/imprimir-cierre', require('./imprimirCierreCaja'));

// ✅ cierre de caja "operativo" (borra tickets + crea cierre)
router.post('/cerrar-caja', cerrarCajaController.cerrarCaja);

// ✅ histórico + reimpresión
router.use('/cierres', require('./cierresRoutes'));

module.exports = router;
