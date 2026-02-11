// backend/routes/printerConfig.js
const express = require('express');
const net = require('net');
const router = express.Router();
const { readConfig, writeConfig } = require('../utils/config');
const { abrirCajon, imprimirTicket, imprimirCierreCaja } = require('../services/printerService');

// GET config actual
router.get('/', (_req, res) => res.json(readConfig()));

// POST guardar IP/puerto
router.post('/', (req, res) => {
  const { host, port } = req.body || {};
  if (!host || !port) return res.status(400).json({ error: 'host y port son obligatorios' });
  writeConfig({ host, port: Number(port) });
  res.json({ ok: true });
});

// GET ping TCP a impresora
router.get('/ping', (_req, res) => {
  const { host, port } = readConfig();
  const socket = new net.Socket();
  const timeout = setTimeout(() => { socket.destroy(); res.status(504).json({ ok:false, error:'timeout' }); }, 2000);
  socket.connect(Number(port), host, () => { clearTimeout(timeout); socket.end(); res.json({ ok:true, host, port }); });
  socket.on('error', (e) => { clearTimeout(timeout); res.status(500).json({ ok:false, error:e.message }); });
});

// POST abrir cajón
router.post('/drawer', async (_req, res) => {
  try { await abrirCajon(); res.json({ ok:true }); }
  catch (e) { res.status(500).json({ ok:false, error: e.message }); }
});

// POST ticket de prueba
router.post('/test-ticket', async (_req, res) => {
  try {
    await imprimirTicket({
      fecha: new Date().toLocaleString(),
      tipo_pago: 'efectivo',
      total: 4.2,
      productos: [
        { nombre: 'Test Café', cantidad: 2, precio: 1.5 },
        { nombre: 'Test Croissant', cantidad: 1, precio: 1.2 }
      ],
      empresa: { nombre: 'TPV Grupo Manhattan' }
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

// POST cierre de prueba
router.post('/test-cierre', async (_req, res) => {
  try {
    await imprimirCierreCaja({
      fecha: new Date().toLocaleString(),
      resumen: { total_efectivo: 12.3, total_tarjeta: 45.7, total_general: 58.0 },
      productos: [{ nombre: 'Café', cantidad: 10 }, { nombre: 'Tostada', cantidad: 6 }]
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

module.exports = router;
