const { Categoria, Producto, sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Limpia y sincroniza
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modelo Categoria', () => {
  it('crea una categoría y asocia productos', async () => {
    const categoria = await Categoria.create({ nombre: 'Bebidas', imagen: null });

    const producto = await Producto.create({
      nombre: 'Ron Cacique',
      precio: 7.5,
      imagen: null,
      categoriaId: categoria.id,
    });

    const found = await Categoria.findByPk(categoria.id, {
      include: [{ model: Producto, as: 'productos' }],
    });

    expect(found).toBeTruthy();
    expect(found.productos.length).toBe(1);
    expect(found.productos[0].nombre).toBe('Ron Cacique');
  });
});
