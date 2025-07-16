const { Empresa } = require('../models');

exports.get = async (req, res) => {
  try {
    const empresa = await Empresa.findOne();
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de empresa' });
  }
};

exports.create = async (req, res) => {
  try {
    const existente = await Empresa.findOne();
    if (existente) {
      return res.status(400).json({ error: 'Ya existe una empresa registrada' });
    }

    const empresa = await Empresa.create(req.body);
    res.status(201).json(empresa);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la empresa' });
  }
};


exports.update = async (req, res) => {
  try {
    const empresa = await Empresa.findOne();
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });

    await empresa.update(req.body);
    res.json(empresa);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar empresa' });
  }
};

exports.delete = async (req, res) => {
  try {
    const empresa = await Empresa.findOne();
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });

    await empresa.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar empresa' });
  }
};
