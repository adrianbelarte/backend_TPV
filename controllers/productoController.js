const { Producto, Categoria, ProductoExtra } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: ['categoria', 'extras']
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el producto' });
  }
};

exports.update = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await producto.update(req.body);
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el producto' });
  }
};

exports.delete = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar el producto' });
  }
};
