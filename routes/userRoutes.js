const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');


router.get('/', authenticateToken, isAdmin, controller.getAll);
router.post('/', controller.create);
router.put('/:id',authenticateToken, isAdmin, controller.update);
router.delete('/:id',authenticateToken, isAdmin, controller.delete);

module.exports = router;
