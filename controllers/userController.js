const { user } = require('../models');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Crear usuario (con contraseña hasheada)
const { User } = require('../models');

exports.create = async (req, res) => {
  try {
    const usersCount = await User.count();

    if (usersCount === 0) {
      const { nombre, email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email y password son obligatorios' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const nuevoAdmin = await User.create({
        nombre,
        email,
        password: hashedPassword,
        rol: 'admin',
      });

      return res.status(201).json(nuevoAdmin);
    }

    // Para usuarios existentes, evitar crear sin autenticación
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

    await user.update(req.body);
    res.json(user);
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
