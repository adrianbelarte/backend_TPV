const express = require('express');
const router = express.Router();
const controller = require('../controllers/ventaTotalController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

router.get('/', controller.getAll);
router.post('/', authenticateToken, isAdmin, controller.create);
router.put('/:id',authenticateToken, isAdmin, controller.update);
router.delete('/:id',authenticateToken, isAdmin, controller.delete);

module.exports = router;
