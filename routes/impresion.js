// routes/impresion.js
const router = require("express").Router();
const c = require("../controllers/impresionController");

router.post("/imprimir", c.imprimirTicket);
router.post("/cierre-caja/imprimir", c.imprimirCierreCaja);

module.exports = router;
