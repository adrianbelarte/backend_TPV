const { Ticket, Producto } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: ['productos']
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tickets' });
  }
};

exports.create = async (req, res) => {
  try {
    const { productos, ...ticketData } = req.body;

    const ticket = await Ticket.create(ticketData);

    if (productos && productos.length) {
      await ticket.setProductos(productos); // ids de productos
    }

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear ticket' });
  }
};


exports.update = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

    await ticket.update(req.body);
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar ticket' });
  }
};

exports.delete = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

    await ticket.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar ticket' });
  }
};