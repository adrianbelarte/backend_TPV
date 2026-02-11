const express = require('express');
const router = express.Router();
const cierresController = require('../controllers/cierresController');

router.get('/', cierresController.list);
router.get('/:id', cierresController.getById);
router.post('/:id/reimprimir', cierresController.reimprimir);

module.exports = router;
