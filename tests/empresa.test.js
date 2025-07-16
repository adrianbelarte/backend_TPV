const { Empresa, sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Modelo Empresa', () => {
  it('crea una empresa correctamente', async () => {
    const empresa = await Empresa.create({
      nombre: 'Mi Empresa S.L.',
      direccion: 'Calle Falsa 123',
      telefono: '123456789',
      correo: 'info@miempresa.com',
      cif: 'B12345678'
    });

    expect(empresa.nombre).toBe('Mi Empresa S.L.');
    expect(empresa.cif).toBe('B12345678');
  });
});
