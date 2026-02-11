const { Producto, Categoria } = require('../models');

// 🔹 Obtener todos los productos (con su categoría asociada)
exports.getAll = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: ['categoria'] // 👈 solo categoría, sin extras
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// 🔹 Crear producto
exports.create = async (req, res) => {
  try {
    const { nombre, precio, categoriaId } = req.body;
    let imagenUrl = null;

    if (req.file) {
      imagenUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imagen && typeof req.body.imagen === 'string' && req.body.imagen.trim() !== '') {
      imagenUrl = req.body.imagen.trim();
    }

    if (!nombre || nombre.trim() === '' || precio === undefined || precio === null) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const nuevoProducto = await Producto.create({
      nombre,
      precio,
      imagen: imagenUrl,
      categoriaId
    });

    res.status(201).json({
      mensaje: '✅ Producto creado correctamente',
      producto: nuevoProducto
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al crear el producto' });
  }
};

// 🔹 Actualizar producto
exports.update = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const { nombre, precio, categoriaId } = req.body;
    let imagenUrl = null;

    if (req.file) {
      imagenUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imagen && typeof req.body.imagen === 'string' && req.body.imagen.trim() !== '') {
      imagenUrl = req.body.imagen.trim();
    }

    if (nombre !== undefined && (nombre === null || nombre.trim() === '')) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }

    if (precio !== undefined && (precio === null || isNaN(precio))) {
      return res.status(400).json({ error: 'El precio debe ser un número válido' });
    }

    const datosUpdate = {};
    if (nombre !== undefined) datosUpdate.nombre = nombre;
    if (precio !== undefined) datosUpdate.precio = precio;
    if (imagenUrl !== null) datosUpdate.imagen = imagenUrl;
    if (categoriaId !== undefined) datosUpdate.categoriaId = categoriaId;

    await producto.update(datosUpdate);
    res.json({ mensaje: '✅ Producto actualizado correctamente', producto });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al actualizar el producto' });
  }
};

// 🔹 Eliminar producto
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
