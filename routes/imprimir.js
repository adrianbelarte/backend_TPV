const express = require("express");
const router = express.Router();
const { imprimirTicket } = require("../services/printerService");
const { getEmpresaOrFallback } = require("../utils/empresaHelper");

// POST /api/imprimir
router.post("/", async (req, res) => {
  try {
    const { fecha } = req.body || {};
    if (!fecha) return res.status(400).json({ error: "Falta 'fecha' en el body" });

    // normaliza productos a []
    if (!Array.isArray(req.body.productos)) req.body.productos = [];

    // empresa desde body o BD
    const empresa = await getEmpresaOrFallback(req.body.empresa);

    // payload final hacia el service
    const data = { ...req.body, empresa }; // 👈 OJO: se llama data, NO payload

    await imprimirTicket(data);
    return res.json({ mensaje: "✅ Ticket enviado a la impresora térmica" });
  } catch (error) {
    console.error("❌ Error en /api/imprimir:", error);
    const msg =
      process.env.NODE_ENV === "production"
        ? "No se pudo imprimir el ticket"
        : (error && error.message) || "Error desconocido";
    return res.status(500).json({ error: msg });
  }
});

module.exports = router;
