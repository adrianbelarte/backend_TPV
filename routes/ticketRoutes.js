const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticketController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');


router.get('/', controller.getAll);
router.post('/', controller.create); 
router.get('/tickets/deleted-only', controller.getOnlyDeleted);
router.put('/:id',authenticateToken , isAdmin, controller.update);
router.delete('/:id',authenticateToken, isAdmin, controller.delete);

module.exports = router;
