// controllers/impresionController.js
const { Empresa } = require("../models");

async function getEmpresaOrFallback(bodyEmpresa) {
  if (bodyEmpresa && bodyEmpresa.nombre) return bodyEmpresa;
  const db = await Empresa.findOne();
  return db ? {
    nombre: db.nombre,
    direccion: db.direccion || "",
    telefono: db.telefono || "",
    correo: db.correo || "",
    cif: db.cif || "",
  } : { nombre: "Mi Empresa", direccion: "", telefono: "", correo: "", cif: "" };
}

exports.imprimirTicket = async (req, res) => {
  try {
    const empresa = await getEmpresaOrFallback(req.body.empresa);
    const ticket = req.body; // incluye lineas, total, tipo_pago, etc.

    // TODO: render / enviar a impresora con empresa + ticket
    // printTicket({ empresa, ...ticket });

    return res.json({ ok: true });
  } catch (e) {
    console.error("imprimirTicket error:", e);
    return res.status(500).json({ error: "No se pudo imprimir ticket" });
  }
};

exports.imprimirCierreCaja = async (req, res) => {
  try {
    const empresa = await getEmpresaOrFallback(req.body.empresa);
    const payload = req.body; // totales, rango fechas, etc.

    // TODO: render / enviar a impresora con empresa + cierre
    // printCierreCaja({ empresa, ...payload });

    return res.json({ ok: true });
  } catch (e) {
    console.error("imprimirCierreCaja error:", e);
    return res.status(500).json({ error: "No se pudo imprimir cierre de caja" });
  }
};
