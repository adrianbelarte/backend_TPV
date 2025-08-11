const { Ticket, Producto, VentaTotal, TicketProducto } = require('../models');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

exports.cerrarCaja = async (req, res) => {
  try {
    // Obtener todos los tickets sin filtrar por fecha
    const tickets = await Ticket.findAll({
      include: [{
        model: Producto,
        as: 'productos',
        through: { attributes: ['cantidad'] }
      }]
    });

    console.log('Tickets encontrados:', tickets.length);

    if (tickets.length === 0) {
      return res.status(400).json({ error: 'No hay tickets para cerrar.' });
    }

    let total_tarjeta = 0;
    let total_efectivo = 0;

    tickets.forEach(ticket => {
      if (ticket.tipo_pago === 'tarjeta') total_tarjeta += ticket.total;
      else if (ticket.tipo_pago === 'efectivo') total_efectivo += ticket.total;
    });

    const total_general = total_tarjeta + total_efectivo;
    const hastaFecha = new Date();

    // Guardar resumen del cierre con la fecha y hora actual
    const ventaTotal = await VentaTotal.create({
      fecha: hastaFecha,
      total_tarjeta,
      total_efectivo,
      total_general
    });

    // Acumular productos vendidos de todos los tickets
const productosVendidosMap = {};

tickets.forEach(ticket => {
  ticket.productos.forEach(producto => {
    const cantidad = producto.TicketProducto ? producto.TicketProducto.cantidad : 1;
    if (productosVendidosMap[producto.nombre]) {
      productosVendidosMap[producto.nombre] += cantidad;
    } else {
      productosVendidosMap[producto.nombre] = cantidad;
    }
  });
});

// Transformar el mapa en array [{nombre, cantidad}, ...]
const productosVendidos = Object.entries(productosVendidosMap).map(([nombre, cantidad]) => ({
  nombre,
  cantidad,
}));

    
    // Crear Excel con tickets cerrados
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Tickets cerrados');

    sheet.columns = [
      { header: 'ID Ticket', key: 'id', width: 10 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Hora', key: 'hora', width: 10 },
      { header: 'Tipo de Pago', key: 'tipo_pago', width: 15 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Productos', key: 'productos', width: 50 },
    ];

    tickets.forEach(ticket => {
      const productosStr = ticket.productos.map(p => {
        const cantidad = p.TicketProducto ? p.TicketProducto.cantidad : 1;
        return `${p.nombre} (${cantidad})`;
      }).join(', ');

      sheet.addRow({
        id: ticket.id,
        fecha: ticket.fecha.toISOString().split('T')[0],
        hora: ticket.hora,
        tipo_pago: ticket.tipo_pago,
        total: ticket.total,
        productos: productosStr,
      });
    });

    const exportPath = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(exportPath)) fs.mkdirSync(exportPath);

    const fileName = `Tickets_${hastaFecha.toISOString().split('T')[0]}_${hastaFecha.getHours()}-${hastaFecha.getMinutes()}.xlsx`;
    const fullPath = path.join(exportPath, fileName);

    await workbook.xlsx.writeFile(fullPath);

    // Borrar tickets y sus relaciones ya cerrados
    const ticketIds = tickets.map(t => t.id);
    await TicketProducto.destroy({ where: { ticketId: ticketIds } });
    await Ticket.destroy({ where: { id: ticketIds } });

   res.json({
  mensaje: 'Caja cerrada correctamente, tickets exportados y base limpia',
  archivo: `/exports/${fileName}`,
  resumen: ventaTotal,
  productos: productosVendidos
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cerrar caja', details: error.message });
  }
};
