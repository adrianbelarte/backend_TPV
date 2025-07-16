const { Producto, Ticket, TicketProducto, sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Modelo TicketProducto', () => {
  it('asocia un producto con un ticket correctamente', async () => {
    const producto = await Producto.create({
      nombre: 'Cerveza',
      precio: 2.5,
      imagen: 'cerveza.jpg'
    });

    const ticket = await Ticket.create({
      producto: 'Ticket temporal',
      cantidad: 1,
      fecha: new Date(),
      hora: '13:00',
      tipo_pago: 'efectivo',
      total: 2.5
    });

    const tp = await TicketProducto.create({
      ticketId: ticket.id,
      productoId: producto.id,
      cantidad: 1
    });

    expect(tp.ticketId).toBe(ticket.id);
    expect(tp.productoId).toBe(producto.id);
    expect(tp.cantidad).toBe(1);
  });
});
