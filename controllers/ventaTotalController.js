const { VentaTotal } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const ventas = await VentaTotal.findAll();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas totales' });
  }
};

exports.create = async (req, res) => {
  try {
    const venta = await VentaTotal.create(req.body);
    res.status(201).json(venta);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear venta' });
  }
};

exports.update = async (req, res) => {
  try {
    const venta = await VentaTotal.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

    await venta.update(req.body);
    res.json(venta);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar venta' });
  }
};

exports.delete = async (req, res) => {
  try {
    const venta = await VentaTotal.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

    await venta.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar venta' });
  }
};