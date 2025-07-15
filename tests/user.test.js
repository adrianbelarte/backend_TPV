const { User, sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Modelo User', () => {
  it('crea un usuario correctamente', async () => {
    const user = await User.create({
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      password: '123456',
      rol: 'admin'
    });

    expect(user.email).toBe('juan@example.com');
    expect(user.rol).toBe('admin');
  });
});
