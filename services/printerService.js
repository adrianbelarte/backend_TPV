// backend/services/printerService.js
const escpos = require('escpos');
escpos.Network = require('escpos-network');

const PRINTER_HOST = process.env.PRINTER_HOST || '192.168.1.50';
const PRINTER_PORT = parseInt(process.env.PRINTER_PORT || '9100', 10);
const PRINTER_OPTIONS = { encoding: process.env.PRINTER_ENCODING || 'CP437' };

function withPrinter(run) {
  const device = new escpos.Network(PRINTER_HOST, PRINTER_PORT);
  const printer = new escpos.Printer(device, PRINTER_OPTIONS);

  return new Promise((resolve, reject) => {
    device.open((err) => {
      if (err) return reject(err);
      Promise.resolve(run(printer))
        .then(() => { try { printer.close(); } catch (_) {} resolve(); })
        .catch((e) => { try { printer.close(); } catch (_) {} reject(e); });
    });
  });
}

function line() { return '-------------------------------'; }

async function imprimirTicket(ticket) {
  const { fecha, productos = [], total = 0, tipo_pago = '', empresa } = ticket;

  await withPrinter(async (printer) => {
    printer
      .align('ct').style('b').size(1, 1)
      .text((empresa?.nombre || 'TPV Grupo Manhattan'))
      .style('normal').size(0, 0)
      .text(String(fecha))
      .text(line())
      .align('lt');

    productos.forEach((p) => {
      const nombre   = p.nombre ?? '';
      const cantidad = Number(p.cantidad || 1);
      const precio   = Number(p.precio || 0);
      const importe  = (cantidad * precio).toFixed(2);

      // línea: "2 x Café" y al dcha el importe
      printer.text(`${cantidad} x ${nombre}`);
      printer.align('rt').text(`${importe}€`).align('lt');
    });

    printer.text(line());
    printer.align('rt').style('b').text(`TOTAL ${Number(total).toFixed(2)}€`);
    printer.align('lt').style('normal').text(`Pago: ${tipo_pago}`);
    printer.feed(2);

    // Abrir cajón (opcional, RJ11 en la impresora):
    // printer.cashdraw(2);

    printer.cut();
  });
}

async function imprimirCierreCaja(cierre) {
  const { fecha, resumen = {}, productos = [] } = cierre;

  await withPrinter(async (printer) => {
    printer
      .align('ct').style('b').size(1, 1)
      .text('CIERRE DE CAJA')
      .style('normal').size(0, 0)
      .text(String(fecha))
      .text(line())
      .align('lt');

    const te = Number(resumen.total_efectivo || 0);
    const tt = Number(resumen.total_tarjeta  || 0);
    const tg = Number(resumen.total_general  || (te + tt));

    printer
      .text(`Efectivo: ${te.toFixed(2)}€`)
      .text(`Tarjeta:  ${tt.toFixed(2)}€`)
      .text(line())
      .style('b').text(`TOTAL:    ${tg.toFixed(2)}€`).style('normal')
      .text(line())
      .text('Unidades vendidas:');

    productos.forEach((p) => {
      printer.text(`${p.nombre}  x${p.cantidad}`);
    });

    printer.feed(2);
    printer.cut();
  });
}

async function abrirCajon() {
  await withPrinter(async (printer) => {
    printer.cashdraw(2); // pulso ESC/POS estándar
  });
}

module.exports = { imprimirTicket, imprimirCierreCaja, abrirCajon };
