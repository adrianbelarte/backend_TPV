const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username y password son requeridos' });

  try {
    const user = await User.findOne({ where: { nombre: username } }); // Aquí se busca por "nombre"

    if (!user)
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const payload = { id: user.id, rol: user.rol };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
