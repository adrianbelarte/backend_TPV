const express = require("express");
const router = express.Router();
const { imprimirCierreCaja } = require("../services/printerService");
const { getEmpresaOrFallback } = require("../utils/empresaHelper");

// POST /cierre-caja/imprimir
router.post("/", async (req, res) => {
  try {
    const cierre = req.body;
    if (!cierre || !cierre.fecha || !cierre.resumen) {
      return res.status(400).json({ error: "Datos de cierre incompletos" });
    }

    const empresa = await getEmpresaOrFallback(req.body.empresa);
    const data = { ...cierre, empresa }; // 👈 data, NO payload

    await imprimirCierreCaja(data);
    return res.json({ mensaje: "Cierre de caja enviado a la impresora térmica" });
  } catch (error) {
    console.error("Error en /cierre-caja/imprimir:", error);
    const msg =
      process.env.NODE_ENV === "production"
        ? "No se pudo imprimir el cierre de caja"
        : (error && error.message) || "Error desconocido";
    return res.status(500).json({ error: msg });
  }
});

module.exports = router;
