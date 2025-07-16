const { Categoria } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

exports.create = async (req, res) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear categoría' });
  }
};

exports.update = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    await categoria.update(req.body);
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
