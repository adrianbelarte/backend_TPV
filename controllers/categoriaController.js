const { Categoria, Producto } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

exports.getProductosPorCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findByPk(id, {
      include: {
        model: Producto,
        as: 'productos',
      },
    });

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(categoria.productos);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
  }
};


exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body; // imagen es URL

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El campo nombre es obligatorio' });
    }

    // Aquí guardamos directamente la URL que venga en imagen
    const categoria = await Categoria.create({ nombre, descripcion, imagen: imagen?.trim() || null });
    res.status(201).json(categoria);
  } catch (error) {
    console.error('Error en create:', error);
    res.status(400).json({ error: error.message || 'Error al crear categoría' });
  }
};

exports.update = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    const { nombre, descripcion } = req.body;
    let imagenUrl = categoria.imagen;

    if (req.file) {
      imagenUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imagen && typeof req.body.imagen === 'string' && req.body.imagen.trim() !== '') {
      imagenUrl = req.body.imagen.trim();
    }

    await categoria.update({ nombre, descripcion, imagen: imagenUrl });
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar categoría' });
  }
};

exports.delete = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    await categoria.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar categoría' });
  }
};
