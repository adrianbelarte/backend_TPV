// backend/utils/printer.js
const escpos = require('escpos');
escpos.Network = require('escpos-network');

const PRINTER_HOST = process.env.PRINTER_HOST || '192.168.1.50';
const PRINTER_PORT = parseInt(process.env.PRINTER_PORT || '9100', 10);

// encoding para tildes/ñ en muchas ESC/POS (prueba CP437/CP858)
const PRINTER_OPTIONS = { encoding: "CP437" };

function withPrinter(run) {
  const device = new escpos.Network(PRINTER_HOST, PRINTER_PORT);
  const printer = new escpos.Printer(device, PRINTER_OPTIONS);

  return new Promise((resolve, reject) => {
    device.open((err) => {
      if (err) return reject(err);
      Promise.resolve(run(printer))
        .then(() => { try { printer.close(); } catch(_){} resolve(); })
        .catch((e) => { try { printer.close(); } catch(_){} reject(e); });
    });
  });
}

module.exports = { withPrinter };
