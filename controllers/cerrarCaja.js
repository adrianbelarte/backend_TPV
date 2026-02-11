const { Op } = require('sequelize');
const { Ticket, Producto, VentaTotal, TicketProducto } = require('../models');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

function toSafeDate(value, fallback = null) {
  if (!value) return fallback;
  const d = new Date(value);
  return isNaN(d) ? fallback : d;
}

function toIsoDateOnly(d) {
  return d ? d.toISOString().split('T')[0] : '';
}

function toHHMM(d) {
  if (!d) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

exports.cerrarCaja = async (req, res) => {
  try {
    const hastaFecha = new Date();

    // Trae todos los tickets abiertos con sus productos
    const tickets = await Ticket.findAll({
      include: [{
        model: Producto,
        as: 'productos',
        through: { attributes: ['cantidad'] }
      }]
    });

    // Totales
    let total_tarjeta = 0;
    let total_efectivo = 0;

    for (const ticket of tickets) {
      if (ticket.tipo_pago === 'tarjeta') total_tarjeta += Number(ticket.total) || 0;
      else if (ticket.tipo_pago === 'efectivo') total_efectivo += Number(ticket.total) || 0;
    }

    const total_general = total_tarjeta + total_efectivo;

    // Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Tickets cerrados');

    sheet.columns = [
      { header: 'ID Ticket',    key: 'id',         width: 10 },
      { header: 'Fecha',        key: 'fecha',      width: 15 },
      { header: 'Hora',         key: 'hora',       width: 10 },
      { header: 'Tipo de Pago', key: 'tipo_pago',  width: 15 },
      { header: 'Total',        key: 'total',      width: 12 },
      { header: 'Productos',    key: 'productos',  width: 50 },
    ];

    for (const ticket of tickets) {
      // Fecha segura: ticket.fecha -> createdAt -> hastaFecha
      const baseDate =
        toSafeDate(ticket.fecha) ||
        toSafeDate(ticket.createdAt) ||
        hastaFecha;

      const fechaStr = toIsoDateOnly(baseDate);
      const horaStr  = ticket.hora || toHHMM(baseDate);

      const productosStr = (ticket.productos || []).map(p => {
        const cantidad = p.TicketProducto ? p.TicketProducto.cantidad : 1;
        return `${p.nombre} (${cantidad})`;
      }).join(', ');

      sheet.addRow({
        id: ticket.id,
        fecha: fechaStr,
        hora: horaStr,
        tipo_pago: ticket.tipo_pago || '',
        total: Number(ticket.total) || 0,
        productos: productosStr,
      });
    }

    // Carpeta de exportación
    const exportPath = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(exportPath)) fs.mkdirSync(exportPath, { recursive: true });

    const fechaNombre = toIsoDateOnly(hastaFecha);
    const fileName = `Tickets_${fechaNombre}_${String(hastaFecha.getHours()).padStart(2,'0')}-${String(hastaFecha.getMinutes()).padStart(2,'0')}.xlsx`;
    const fullPath = path.join(exportPath, fileName);

    await workbook.xlsx.writeFile(fullPath);

    // Acumular productos vendidos
    const productosVendidos = {};
    for (const ticket of tickets) {
      for (const producto of (ticket.productos || [])) {
        const cantidad = producto.TicketProducto ? producto.TicketProducto.cantidad : 1;
        productosVendidos[producto.nombre] = (productosVendidos[producto.nombre] || 0) + (Number(cantidad) || 0);
      }
    }

    const productosArray = Object.entries(productosVendidos).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));

        const ventaTotal = await VentaTotal.create({
  fecha: hastaFecha,
  total_tarjeta,
  total_efectivo,
  total_general,
  productos_json: JSON.stringify(productosArray),
  export_xlsx: `/exports/${fileName}`
});



    // Borrar tickets y relaciones si hay algo
    const ticketIds = tickets.map(t => t.id).filter(Boolean);

    if (ticketIds.length > 0) {
      await TicketProducto.destroy({ where: { ticketId: { [Op.in]: ticketIds } } });
      await Ticket.destroy({ where: { id: { [Op.in]: ticketIds } } });
    }

    res.json({
      mensaje: 'Caja cerrada correctamente, tickets exportados y base limpia',
      archivo: `/exports/${fileName}`,
      resumen: ventaTotal,   // objeto Sequelize; si prefieres JSON plano usa ventaTotal.toJSON()
      productos: productosArray
    });

  } catch (error) {
    console.error('❌ Error en /api/cerrar-caja:', error);
    res.status(500).json({ error: 'Error al cerrar caja', details: error.message });
  }
};
