const { Categoria, Producto, sequelize } = require('../models');
const { fn, col } = require('sequelize');

// GET /categorias -> todas las categorías (sin contar)
exports.getAll = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      order: [['nombre', 'ASC']],
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

// GET /categorias/with-counts -> categorías con contador de productos
exports.getAllWithCounts = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      attributes: {
        include: [[fn('COUNT', col('productos.id')), 'productosCount']],
      },
      include: [
        {
          model: Producto,
          as: 'productos',
          attributes: [], // no necesitamos campos del producto, solo contar
          required: false, // LEFT JOIN para contar también las que no tienen productos
        },
      ],
      group: ['Categoria.id'],
      order: [['nombre', 'ASC']],
    });

    // Además, devuelve el conteo de "general" (productos sin categoría)
    const [result] = await Producto.findAll({
      attributes: [[fn('COUNT', col('Producto.id')), 'count']],
      where: { categoriaId: null },
      raw: true,
    });

    res.json({
      categorias,
      generalCount: Number(result?.count ?? 0),
    });
  } catch (error) {
    console.error('getAllWithCounts error:', error);
    res.status(500).json({ error: 'Error al obtener categorías con conteo' });
  }
};

// GET /categorias/:id/productos -> productos de una categoría
// Soporta id = "general" para productos sin categoría
exports.getProductosPorCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === 'general') {
      const productos = await Producto.findAll({
        where: { categoriaId: null },
        order: [['nombre', 'ASC']],
      });
      return res.json(productos);
    }

    const categoria = await Categoria.findByPk(id, {
      include: {
        model: Producto,
        as: 'productos',
        order: [['nombre', 'ASC']],
      },
    });

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(categoria.productos ?? []);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
  }
};

// POST /categorias
exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El campo nombre es obligatorio' });
    }

    const categoria = await Categoria.create({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null,
      imagen: imagen?.trim() || null, // URL opcional
    });

    res.status(201).json(categoria);
  } catch (error) {
    console.error('Error en create:', error);
    res.status(400).json({ error: error.message || 'Error al crear categoría' });
  }
};

// PUT /categorias/:id
exports.update = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    const { nombre, descripcion } = req.body;
    let imagenUrl = categoria.imagen;

    if (req.file) {
      imagenUrl = `/uploads/${req.file.filename}`;
    } else if (typeof req.body.imagen === 'string' && req.body.imagen.trim() !== '') {
      imagenUrl = req.body.imagen.trim();
    }

    await categoria.update({
      ...(nombre !== undefined ? { nombre: nombre?.trim() } : {}),
      ...(descripcion !== undefined ? { descripcion: descripcion?.trim() } : {}),
      imagen: imagenUrl,
    });

    res.json(categoria);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar categoría' });
  }
};

// DELETE /categorias/:id
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
