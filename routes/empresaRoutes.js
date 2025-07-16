// routes/empresaRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/empresaController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

router.get('/', controller.get);
router.post('/', authenticateToken, isAdmin, controller.create);
router.put('/', authenticateToken, isAdmin, controller.update);
router.delete('/', authenticateToken, isAdmin, controller.delete);

module.exports = router;
