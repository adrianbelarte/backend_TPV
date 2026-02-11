const { Empresa } = require("../models");

function normalizeEmpresa(src) {
  return {
    nombre: src?.nombre || "Mi Empresa",
    direccion: src?.direccion || "",
    telefono: src?.telefono || "",
    correo: src?.correo || "",
    cif: src?.cif || "",
    logo: src?.logo || null,
  };
}

async function getEmpresaOrFallback(bodyEmpresa) {
  if (bodyEmpresa && bodyEmpresa.nombre) return normalizeEmpresa(bodyEmpresa);
  const db = await Empresa.findOne();
  return normalizeEmpresa(db);
}

module.exports = { getEmpresaOrFallback };
