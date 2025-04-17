const Client = require('../models/clientsScheme');

const createClient = async (req, res) => {
    const client = await Client.create({...req.body, user: req.user._id});
    res.status(201).json(client);
}

const getClients = async (req, res) => {
    const clients = await Client.find().where({user: req.user._id, isActive: true});
    res.status(200).json(clients);
}

const getClientById = async (req, res) => {
    const client = await Client.findById(req.params.id).where({user: req.user._id});
    if (!client) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json(client);
}

const deleteClient = async (req, res) => {
    const user = req.user;
    const { soft } = req.query;
    if (soft === 'false') {
        await Client.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Cliente eliminado correctamente (hard delete)' });
    } else {
        await Client.findByIdAndUpdate(req.params.id, { isActive: false });
        res.status(200).json({ message: 'Cliente eliminado correctamente (soft delete)' });
    }
};

const getArchivedClients = async (req, res) => {
    const clients = await Client.find().where({user: req.user._id, isActive: false});
    res.status(200).json(clients);
}

module.exports = { createClient, getClients, getClientById, getArchivedClients };