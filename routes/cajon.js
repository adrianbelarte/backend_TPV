// En tu servidor Express/Node (ejemplo)
// routes/cajon.js o routes/impresora.js

router.post('/abrir-cajon', async (req, res) => {
  try {
    // Comando ESC/POS para abrir cajón portamonedas
    // ESC p m t1 t2
    const comando = Buffer.from([0x1B, 0x70, 0x00, 0x19, 0xFA]);
    
    // Aquí envías el comando a tu impresora térmica
    // Ejemplo con el paquete 'escpos':
    // await impresora.write(comando);
    
    console.log('✅ Cajón abierto');
    res.json({ success: true, message: 'Cajón abierto' });
  } catch (error) {
    console.error('Error al abrir cajón:', error);
    res.status(500).json({ success: false, message: 'Error al abrir cajón' });
  }
});
