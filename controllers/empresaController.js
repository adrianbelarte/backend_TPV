// controllers/empresaController.js
const { Empresa } = require("../models");

exports.get = async (_req, res) => {
  const empresa = await Empresa.findOne();
  res.json(empresa || null);
};

exports.create = async (req, res) => {
  try {
    const { nombre, direccion, telefono, correo, cif, logo } = req.body;
    let logoUrl = null;

    if (req.file) logoUrl = `/uploads/${req.file.filename}`;
    else if (logo && typeof logo === "string" && logo.trim()) logoUrl = logo.trim();

    const empresa = await Empresa.create({
      nombre,
      direccion,
      telefono,
      correo,
      cif,
      logo: logoUrl,
    });
    res.status(201).json(empresa);
  } catch (e) {
    res.status(400).json({ error: e.message || "Error al crear empresa" });
  }
};

exports.update = async (req, res) => {
  try {
    const empresa = await Empresa.findOne();
    if (!empresa) return res.status(404).json({ error: "No existe empresa" });

    const { nombre, direccion, telefono, correo, cif, logo } = req.body;
    let logoUrl = empresa.logo;

    if (req.file) logoUrl = `/uploads/${req.file.filename}`;
    else if (logo && typeof logo === "string") logoUrl = logo.trim() || null;

    await empresa.update({ nombre, direccion, telefono, correo, cif, logo: logoUrl });
    res.json(empresa);
  } catch (e) {
    res.status(400).json({ error: e.message || "Error al actualizar empresa" });
  }
};
