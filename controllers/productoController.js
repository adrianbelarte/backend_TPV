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
    const { nombre, precio, imagen, categoriaId } = req.body;

    if (!nombre || nombre.trim() === '' || precio === undefined || precio === null) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const nuevoProducto = await Producto.create({
      nombre,
      precio,
      imagen,
      categoriaId
    });

    res.status(201).json({ mensaje: '✅ Producto creado correctamente', producto: nuevoProducto });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al crear el producto' });
  }
};

// Crear producto con extras
exports.createWithExtras = async (req, res) => {
  try {
    const { nombre, precio, imagen, categoriaId, extras } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    // Crear el producto primero
    const nuevoProducto = await Producto.create({ nombre, precio, imagen, categoriaId });

    // Validar que extras sean un array y que cada extra exista en la BD
    if (Array.isArray(extras) && extras.length > 0) {
      // Buscar todos los extras con esos IDs
      const extrasExistentes = await Producto.findAll({
        where: { id: extras }
      });

      if (extrasExistentes.length !== extras.length) {
        return res.status(400).json({ error: 'Algunos extras no existen' });
      }

      // Si todos existen, agregarlos
      await nuevoProducto.addExtras(extras);
    }

    const productoConExtras = await Producto.findByPk(nuevoProducto.id, {
      include: ['extras', 'categoria']
    });

    res.status(201).json({ mensaje: 'Producto con extras creado correctamente', producto: productoConExtras });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al crear producto con extras' });
  }
};



exports.update = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const { nombre, precio, imagen, categoriaId } = req.body;

    if (nombre !== undefined && (nombre === null || nombre.trim() === '')) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }
    if (precio !== undefined && (precio === null || isNaN(precio))) {
      return res.status(400).json({ error: 'El precio debe ser un número válido' });
    }

    // Construimos un objeto con solo propiedades definidas
    const datosUpdate = {};
    if (nombre !== undefined) datosUpdate.nombre = nombre;
    if (precio !== undefined) datosUpdate.precio = precio;
    if (imagen !== undefined) datosUpdate.imagen = imagen;
    if (categoriaId !== undefined) datosUpdate.categoriaId = categoriaId;

    await producto.update(datosUpdate);
    res.json({ mensaje: '✅ Producto actualizado correctamente', producto });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al actualizar el producto' });
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
