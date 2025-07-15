const { Ticket, sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Modelo Ticket', () => {
  it('crea un ticket correctamente', async () => {
    const ticket = await Ticket.create({
      producto: 'Hamburguesa',
      cantidad: 2,
      fecha: new Date(),
      hora: '14:30',
      tipo_pago: 'efectivo',
      total: 10.0
    });

    expect(ticket.producto).toBe('Hamburguesa');
    expect(ticket.total).toBeCloseTo(10.0);
  });
});
