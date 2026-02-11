const { VentaTotal } = require('../models');
const { imprimirCierreCaja } = require('../services/printerService');

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

exports.list = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '30', 10), 1), 200);
    const offset = (page - 1) * limit;

    const { rows, count } = await VentaTotal.findAndCountAll({
      order: [['id', 'DESC']],
      limit,
      offset
    });

    res.json({
      page,
      limit,
      total: count,
      items: rows
    });
  } catch (e) {
    console.error('❌ Error list cierres:', e);
    res.status(500).json({ error: 'Error listando cierres' });
  }
};

exports.getById = async (req, res) => {
  try {
    const cierre = await VentaTotal.findByPk(req.params.id);
    if (!cierre) return res.status(404).json({ error: 'Cierre no encontrado' });

    const data = cierre.toJSON();
    data.productos = safeJsonParse(data.productos_json || '[]', []);
    res.json(data);
  } catch (e) {
    console.error('❌ Error get cierre:', e);
    res.status(500).json({ error: 'Error obteniendo cierre' });
  }
};

exports.reimprimir = async (req, res) => {
  try {
    const cierre = await VentaTotal.findByPk(req.params.id);
    if (!cierre) return res.status(404).json({ error: 'Cierre no encontrado' });

    const productos = safeJsonParse(cierre.productos_json || '[]', []);

    const payload = {
      fecha: cierre.fecha, // DATEONLY
      resumen: {
        total_tarjeta: cierre.total_tarjeta,
        total_efectivo: cierre.total_efectivo,
        total_general: cierre.total_general,
        export_xlsx: cierre.export_xlsx || null
      },
      productos
    };

    await imprimirCierreCaja(payload);

    // opcional: contar reimpresiones
    await cierre.update({
      reprinted_count: (cierre.reprinted_count || 0) + 1,
      printed_at: new Date()
    });

    res.json({ mensaje: 'Cierre reimpreso correctamente' });
  } catch (e) {
    console.error('❌ Error reimprimir cierre:', e);
    res.status(500).json({ error: 'No se pudo reimprimir el cierre' });
  }
};
