const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriaController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');
const upload = require('../utils/upload');

router.get('/', controller.getAll);
router.get('/with-counts', controller.getAllWithCounts);
router.get('/:id/productos', controller.getProductosPorCategoria);

router.post('/', authenticateToken, isAdmin, controller.create);
router.put('/:id', authenticateToken, isAdmin, upload.single('imagen'), controller.update);
router.delete('/:id', authenticateToken, isAdmin, controller.delete);

module.exports = router;
