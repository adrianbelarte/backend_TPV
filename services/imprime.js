import escpos from 'escpos';

export function imprimir(ticket, tipoPago) {
  const device = new escpos.USB();
  const printer = new escpos.Printer(device);

  device.open(() => {
    printer
      .align('ct')
      .image('../assets/1000132003.jpg', 's8') 
      .then(() => {
        printer
          .text(ticket.fecha)
          .text(ticket.empresa)
          .drawLine()
          .align('lt');

        ticket.productos.forEach(p => {
          printer.text(`x ${p.nombre}`);
        });

        printer
          .drawLine()
          .align('rt')
          .text(`TOTAL: ${ticket.total.toFixed(2)} €`)
          .align('ct')
          .text('Gracias por confiar en Grupo Manhattan')
          .text('Valencia')
          .cut()
          .close();
      });
  });
}
