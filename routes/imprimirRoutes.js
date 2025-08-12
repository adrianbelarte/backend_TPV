const express = require("express");
const router = express.Router();
const { imprimirTicket } = require("../services/printerService");

router.post("/", async (req, res) => {
  try {
    const ticket = req.body;

    if (!ticket || !ticket.fecha || !ticket.productos) {
      return res.status(400).json({ error: "Datos de ticket incompletos" });
    }

    await imprimirTicket(ticket);
    res.json({ mensaje: "Ticket enviado a la impresora térmica" });
  } catch (error) {
    console.error("Error en /api/imprimir:", error);
    res.status(500).json({ error: "No se pudo imprimir el ticket" });
  }
});

module.exports = router;
