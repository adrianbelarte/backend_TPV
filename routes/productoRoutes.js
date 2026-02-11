const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');
const upload = require('../utils/upload');

// GET todos
router.get('/', controller.getAll);

// Crear (solo admin)
router.post('/', authenticateToken, isAdmin, upload.single('imagen'), controller.create);

// Actualizar (solo admin)
router.put('/:id', authenticateToken, isAdmin, upload.single('imagen'), controller.update);

// Eliminar (solo admin)
router.delete('/:id', authenticateToken, isAdmin, controller.delete);

module.exports = router;
