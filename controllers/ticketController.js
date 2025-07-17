const { Ticket, Producto, TicketProducto } = require('../models');
const { Op } = require('sequelize');


exports.getAll = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: {
        deletedAt: null // solo los no eliminados
      },
      include: {
        model: Producto,
        as: 'productos'
      }
    });
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tickets' });
  }
};

exports.getOnlyDeleted = async (req, res) => {
  try {
    const ticketsEliminados = await Ticket.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null
        }
      },
      paranoid: false,
      include: {
        model: Producto,
        as: 'productos'
      }
    });
    res.json(ticketsEliminados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tickets eliminados' });
  }
};

exports.create = async (req, res) => {
  try {
    const { productos, ...ticketData } = req.body;

    const productosDB = await Producto.findAll({
      where: {
        id: productos.map(p => p.productoId)
      }
    });

    const totalCalculado = productos.reduce((total, prod) => {
      const productoDB = productosDB.find(p => p.id === prod.productoId);
      if (!productoDB) return total;
      return total + (productoDB.precio * prod.cantidad);
    }, 0);

    ticketData.total = totalCalculado;

    const ticket = await Ticket.create(ticketData);

    if (productos && Array.isArray(productos)) {
      const ticketProductosData = productos.map(({ productoId, cantidad }) => ({
        ticketId: ticket.id,
        productoId,
        cantidad
      }));
      await TicketProducto.bulkCreate(ticketProductosData);
    }

    const ticketCreado = await Ticket.findByPk(ticket.id, {
      include: {
        model: Producto,
        as: 'productos'
      }
    });

    res.status(201).json({ mensaje: '✅ Ticket creado correctamente', ticket: ticketCreado });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || 'Error al crear ticket' });
  }
};

exports.update = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

    const { productos, ...ticketData } = req.body;

    let totalCalculado = ticket.total;

    if (productos && Array.isArray(productos) && productos.length > 0) {
      // Obtener productos para calcular total
      const productosDB = await Producto.findAll({
        where: {
          id: productos.map(p => p.productoId)
        }
      });

      totalCalculado = productos.reduce((total, prod) => {
        const productoDB = productosDB.find(p => p.id === prod.productoId);
        if (!productoDB) return total;
        return total + (productoDB.precio * prod.cantidad);
      }, 0);

      // Borrar relaciones actuales
      await TicketProducto.destroy({ where: { ticketId: ticket.id } });

      // Crear nuevas relaciones con cantidades
      const ticketProductosData = productos.map(({ productoId, cantidad }) => ({
        ticketId: ticket.id,
        productoId,
        cantidad
      }));

      await TicketProducto.bulkCreate(ticketProductosData);
    }

    ticketData.total = totalCalculado;

    await ticket.update(ticketData);

    const ticketActualizado = await Ticket.findByPk(ticket.id, {
      include: {
        model: Producto,
        as: 'productos'
      }
    });

    res.json({ mensaje: '✅ Ticket actualizado correctamente', ticket: ticketActualizado });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar ticket' });
  }
};

exports.delete = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

    // Soft delete: actualizar deletedAt con fecha actual
    await ticket.update({ deletedAt: new Date() });

    res.json({ mensaje: '✅ Ticket eliminado (soft delete) correctamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al eliminar ticket' });
  }
};
