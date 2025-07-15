const { Producto, Categoria, sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Modelo Producto', () => {
  it('crea un producto correctamente', async () => {
    const categoria = await Categoria.create({ nombre: 'Bebidas', imagen: 'bebidas.png' });
    const producto = await Producto.create({
      nombre: 'Coca Cola',
      precio: 2.5,
      imagen: 'coca.png',
      categoriaId: categoria.id
    });

    expect(producto.nombre).toBe('Coca Cola');
    expect(producto.precio).toBe(2.5);
  });
});
