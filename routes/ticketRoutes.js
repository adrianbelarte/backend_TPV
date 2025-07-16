const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticketController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');


router.get('/', controller.getAll);
router.post('/', controller.create); // Quizás cualquier user puede crear tickets? Ajusta según necesidad
router.put('/:id', isAdmin, controller.update);
router.delete('/:id', isAdmin, controller.delete);

module.exports = router;
