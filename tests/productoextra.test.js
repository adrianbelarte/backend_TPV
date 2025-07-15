const { Producto, sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Modelo ProductoExtra (subproductos)', () => {
  it('asocia un producto con un extra correctamente', async () => {
    const producto = await Producto.create({
      nombre: 'Ron',
      precio: 10.0,
      imagen: 'ron.png'
    });

    const extra = await Producto.create({
      nombre: 'Coca-Cola',
      precio: 2.0,
      imagen: 'cocacola.png'
    });

    // Añadir extra a producto usando la asociación many-to-many
    await producto.addExtra(extra);

    // Buscar producto con extras incluidos
    const productoConExtras = await Producto.findByPk(producto.id, {
      include: 'extras'
    });

    expect(productoConExtras.extras.length).toBe(1);
    expect(productoConExtras.extras[0].nombre).toBe('Coca-Cola');
  });
});
