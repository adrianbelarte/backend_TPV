// categoriaRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriaController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');



// Rutas públicas
router.get('/', controller.getAll);

// Rutas protegidas (requieren token de admin)
router.post('/', authenticateToken, isAdmin, controller.create);
router.put('/:id', authenticateToken, isAdmin, controller.update);
router.delete('/:id', authenticateToken, isAdmin, controller.delete);

module.exports = router;
