const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

async function imprimirTicket(ticket) {
  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON, // Cambia si tu impresora es STAR
    interface: "usb",         // O "tcp://IP" o "bluetooth"
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
  printer.newLine();
  printer.println("Gracias por confiar en");
  printer.println("Grupo Manhattan");
  printer.cut();

  await printer.execute();
}

module.exports = { imprimirTicket };
