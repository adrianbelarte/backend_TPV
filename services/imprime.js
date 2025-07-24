// server.js (o imprime.js)

const express = require('express');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const app = express();
app.use(express.json());

const device = new escpos.USB();
const printer = new escpos.Printer(device);

app.post('/imprimir-ticket', (req, res) => {
  const { ticket, tipoPago } = req.body;

  device.open(() => {
    printer
      .encode('UTF-8')
      .text('TPV Hostelería')
      .text('---------------------')
      .text(`Ticket: ${ticket.id}`)
      .text(`Fecha: ${new Date(ticket.fecha).toLocaleString()}`)
      .text('---------------------');

    ticket.productos.forEach(p => {
      printer.text(`${p.nombre} x ${p.cantidad} = ${p.precio.toFixed(2)}€`);
    });

    printer
      .text('---------------------')
      .text(`TOTAL: ${ticket.total.toFixed(2)} €`)
      .text(`Pago: ${ticket.tipo_pago}`)
      .text('Gracias por su compra')
      .cut();

    if (tipoPago === 'efectivo') {
      printer.cashdraw(); // abre el cajón
    }

    printer.close();
    res.json({ status: 'ok', message: 'Ticket impreso y cajón abierto' });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor de impresión escuchando en puerto ${PORT}`);
});
