async function imprimirTicket(ticket) {
  // Puedes usar ticket.tipo_pago aquí si quieres imprimirlo
  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: "usb",
  });

  printer.alignCenter();
  printer.println("GRUPO MANHATTAN");
  printer.println("VALENCIA");
  printer.println(ticket.fecha);
  printer.drawLine();

  ticket.productos.forEach((p) => {
    printer.println(`${p.cantidad} x ${p.nombre}`);
  });

  printer.drawLine();
  printer.println(`TOTAL: ${ticket.total} €`);
  if(ticket.tipo_pago) {
    printer.println(`Pago con: ${ticket.tipo_pago.toUpperCase()}`);
  }
  printer.newLine();
  printer.println("Gracias por confiar en");
  printer.println("Grupo Manhattan");
  printer.cut();

  await printer.execute();
}

async function imprimirCierreCaja(cierre) {
  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: "usb",
  });

  printer.alignCenter();
  printer.println("GRUPO MANHATTAN");
  printer.println("VALENCIA");
  printer.println("CIERRE DE CAJA");
  printer.println(cierre.fecha);
  printer.drawLine();

  printer.println("Productos vendidos:");
  if (cierre.productos && cierre.productos.length > 0) {
    cierre.productos.forEach((p) => {
      printer.println(`${p.cantidad} x ${p.nombre}`);
    });
  } else {
    printer.println("(No hay productos)");
  }

  printer.drawLine();
  printer.println(`Total efectivo: ${cierre.resumen.total_efectivo.toFixed(2)} €`);
  printer.println(`Total tarjeta: ${cierre.resumen.total_tarjeta.toFixed(2)} €`);
  printer.println(`TOTAL GENERAL: ${cierre.resumen.total_general.toFixed(2)} €`);

  printer.newLine();
  printer.println("Gracias por confiar en");
  printer.println("Grupo Manhattan");
  printer.cut();

  await printer.execute();
}

module.exports = { imprimirTicket, imprimirCierreCaja };

