const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');
const upload = require('../utils/upload');

router.get('/', controller.getAll);
router.post('/', authenticateToken,isAdmin,upload.single('imagen'), controller.create);
router.post('/conExtras', authenticateToken, isAdmin, controller.createWithExtras);
router.put('/:id',authenticateToken, isAdmin,upload.single('imagen'), controller.update);
router.delete('/:id',authenticateToken, isAdmin, controller.delete);

module.exports = router;
