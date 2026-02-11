// backend/services/printerService.js

// ---- Imports de ESC/POS y utilidades
const { Printer, Image } = require('escpos');   // librería base
const Network = require('escpos-network');      // driver de red
const path = require('path');
const fs = require('fs');

// ---- Configuración
const PRINTER_ENCODING = process.env.PRINTER_ENCODING || 'CP437';
const PRINTER_OPTIONS = { encoding: PRINTER_ENCODING };
const PRINTER_MOCK = String(process.env.PRINTER_MOCK || '').toLowerCase() === 'true';

// papel 58mm ~ 32 cols
const LINE_WIDTH = Number(process.env.PRINTER_LINE_WIDTH || 32);
const line = () => '-'.repeat(LINE_WIDTH);

// Lee host/port desde variables de entorno (sin dependencias externas)
function getPrinterConfig() {
  const host = process.env.PRINTER_HOST || '192.168.1.100'; // <-- pon aquí tu IP por defecto
  const port = Number(process.env.PRINTER_PORT || 9100);
  return { host, port };
}

// ---- Helpers de formato
function wrapText(text = '', width = LINE_WIDTH) {
  const out = [];
  const words = String(text).split(/\s+/);
  let ln = '';
  for (const w of words) {
    if (!ln.length) {
      if (w.length <= width) ln = w;
      else for (let i = 0; i < w.length; i += width) out.push(w.slice(i, i + width));
    } else if ((ln + ' ' + w).length <= width) {
      ln += ' ' + w;
    } else {
      out.push(ln);
      if (w.length <= width) ln = w;
      else { for (let i = 0; i < w.length; i += width) out.push(w.slice(i, i + width)); ln = ''; }
    }
  }
  if (ln) out.push(ln);
  return out;
}
function printWrappedLines(p, text = '') { wrapText(text).forEach(l => p.text(l)); }
function fmtMoney(n) { const v = Number.isFinite(+n) ? +n : 0; return `${v.toFixed(2)}€`; }
function fmtDate(d) { if (typeof d === 'string') return d; try { return new Date(d).toLocaleString(); } catch { return String(d); } }

// ---- Apertura y gestión de impresora
function withPrinter(run, openTimeoutMs = 4000) {
  if (PRINTER_MOCK) {
    const fake = {
      align(){return this}, style(){return this}, size(){return this},
      text(){return this}, feed(){return this}, cut(){return this},
      cashdraw(){return this}, raster(){return this}, image(){return this},
      close(){},
    };
    return Promise.resolve(run(fake));
  }

  const { host, port } = getPrinterConfig();
  if (!host || !port) throw new Error('Configuración de impresora inválida (PRINTER_HOST/PRINTER_PORT)');

  const device = new Network(host, Number(port));
  const printer = new Printer(device, PRINTER_OPTIONS);

  return new Promise((resolve, reject) => {
    let timedOut = false;
    const t = setTimeout(() => {
      timedOut = true;
      try { device.close && device.close(); } catch {}
      reject(new Error(`Timeout abriendo impresora ${host}:${port}`));
    }, openTimeoutMs);

    device.open((err) => {
      if (timedOut) return;
      clearTimeout(t);
      if (err) return reject(new Error(`Error abriendo impresora ${host}:${port}: ${err.message}`));
      Promise.resolve(run(printer))
        .then(() => { try { printer.close(); } catch {} resolve(); })
        .catch((e) => { try { printer.close(); } catch {} reject(e); });
    });
  });
}

// ---- Logo y cabecera de empresa
async function printLogoIfAny(p, empresa) {
  try {
    const logoUrl = empresa?.logo;
    if (!logoUrl) return;
    if (!logoUrl.startsWith('/uploads/')) return; // sólo locales

    const abs = path.join(process.cwd(), logoUrl.replace(/^\//, ''));
    if (!fs.existsSync(abs)) return;

    await new Promise((resolve, reject) => {
      Image.load(abs, (image) => {
        try {
          // según versión: prueba raster o image
          if (typeof p.raster === 'function') {
            p.align('ct').raster(image, 'dwdh');
          } else if (typeof p.image === 'function') {
            p.align('ct').image(image, 's8');
          } else {
            // si no existe ningún método, no hacemos nada
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  } catch (e) {
    console.warn('[print] logo skip:', e.message);
  }
}

function printEmpresaHeader(p, empresa) {
  const nombre = empresa?.nombre || 'TPV Grupo Manhattan';
  const direccion = empresa?.direccion;
  const telefono  = empresa?.telefono;
  const correo    = empresa?.correo;
  const cif       = empresa?.cif;

  p.align('ct').style('b').size(1,1).text(nombre);
  p.style('normal').size(0,0);

  if (direccion) printWrappedLines(p, direccion);
  if (telefono || correo) {
    const l = [telefono ? `Tel: ${telefono}` : '', correo].filter(Boolean).join('  ·  ');
    printWrappedLines(p, l);
  }
  if (cif) p.text(`CIF: ${cif}`);
}

// ---- Impresión de ticket
async function imprimirTicket(ticket) {
  const { fecha, productos = [], total = 0, tipo_pago = '', empresa } = ticket;
  console.log('[print] ticket', { MOCK: PRINTER_MOCK, fecha, total, tipo_pago, items: productos.length });

  await withPrinter(async (p) => {
    await printLogoIfAny(p, empresa);   // 👈 ahora sí imprimimos logo si existe
    printEmpresaHeader(p, empresa);
    p.text(line());
    p.align('ct').text(fmtDate(fecha));
    p.text(line()).align('lt');

    productos.forEach((x) => {
      const nombre = x.nombre ?? '';
      const cantidad = Number(x.cantidad || 1);
      const precio = Number(x.precio || 0);
      const importe = cantidad * precio;

      printWrappedLines(p, `${cantidad} x ${nombre}`);
      p.align('rt').text(fmtMoney(importe)).align('lt');
    });

    p.text(line());
    p.align('rt').style('b').text(`TOTAL ${fmtMoney(total)}`);
    p.align('lt').style('normal').text(`Pago: ${tipo_pago || '-'}`);
    p.feed(2).cut();
  });
}

// ---- Impresión de cierre de caja
async function imprimirCierreCaja(cierre) {
  const { fecha, resumen = {}, productos = [], empresa } = cierre;
  const te = Number(resumen.total_efectivo || 0);
  const tt = Number(resumen.total_tarjeta  || 0);
  const tg = Number(resumen.total_general  || te + tt);

  console.log('[print] cierre', { MOCK: PRINTER_MOCK, fecha, te, tt, tg, items: productos.length });

  await withPrinter(async (p) => {
    await printLogoIfAny(p, empresa);
    printEmpresaHeader(p, empresa);
    p.text(line());
    p.align('ct').style('b').size(1,1).text('CIERRE DE CAJA');
    p.style('normal').size(0,0).text(fmtDate(fecha));
    p.text(line()).align('lt');

    p.text(`Efectivo: ${fmtMoney(te)}`);
    p.text(`Tarjeta:  ${fmtMoney(tt)}`);
    p.text(line()).style('b').text(`TOTAL:    ${fmtMoney(tg)}`);
    p.style('normal').text(line());

    if (Array.isArray(productos) && productos.length) {
      p.text('Unidades vendidas:');
      productos.forEach((pv) => {
        const nombre = pv?.nombre ?? '';
        const cantidad = Number(pv?.cantidad || 0);
        printWrappedLines(p, `${nombre}  x${cantidad}`);
      });
    }

    p.feed(2).cut();
  });
}

// ---- Cajón
async function abrirCajon() {
  console.log('[print] abrir cajón', { MOCK: PRINTER_MOCK });
  await withPrinter(async (p) => p.cashdraw(2));
}

module.exports = { imprimirTicket, imprimirCierreCaja, abrirCajon };
