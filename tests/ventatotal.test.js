const { VentaTotal, sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Modelo VentaTotal', () => {
  it('crea un registro de venta correctamente', async () => {
    const venta = await VentaTotal.create({
      producto: 'Empanada',
      cantidad: 3,
      total_targeta: 0,
      total_efectivo: 9,
      total: 9,
      fecha: new Date(),
      hora: '12:00'
    });

    expect(venta.producto).toBe('Empanada');
    expect(venta.total_efectivo).toBe(9);
  });
});
