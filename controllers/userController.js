const { User } = require('../models');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'rol'] // No devolvemos el pin por seguridad
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Crear usuario (solo si no existen usuarios)
exports.create = async (req, res) => {
  try {
    const usersCount = await User.count();

    if (usersCount === 0) {
      const { nombre, email, pin } = req.body;
      if (!email || !pin) {
        return res.status(400).json({ error: 'Email y PIN son obligatorios' });
      }

      const hashedPin = await bcrypt.hash(pin, 10);

      const nuevoAdmin = await User.create({
        nombre,
        email,
        pin: hashedPin,
        rol: 'admin',
      });

      return res.status(201).json({
        id: nuevoAdmin.id,
        nombre: nuevoAdmin.nombre,
        email: nuevoAdmin.email,
        rol: nuevoAdmin.rol,
      });
    }

    return res.status(403).json({ error: 'No autorizado para crear usuarios' });
  } catch (error) {
    res.status(400).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar usuario
exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { nombre, email, rol, pin } = req.body;

    if (pin) {
      const hashedPin = await bcrypt.hash(pin, 10);
      await user.update({ nombre, email, rol, pin: hashedPin });
    } else {
      await user.update({ nombre, email, rol });
    }

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
exports.delete = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar usuario' });
  }
};


