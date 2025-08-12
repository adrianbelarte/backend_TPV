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
