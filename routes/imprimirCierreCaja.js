const express = require("express");
const router = express.Router();
const { imprimirCierreCaja } = require("../services/printerService");

router.post("/", async (req, res) => {
  try {
    const cierre = req.body;

    if (!cierre || !cierre.fecha || !cierre.resumen) {
      return res.status(400).json({ error: "Datos de cierre incompletos" });
    }

    await imprimirCierreCaja(cierre);
    res.json({ mensaje: "Cierre de caja enviado a la impresora térmica" });
  } catch (error) {
    console.error("Error en /api/imprimir-cierre:", error);
    res.status(500).json({ error: "No se pudo imprimir el cierre de caja" });
  }
});

module.exports = router;
