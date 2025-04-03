const Client = require('../models/clientsScheme');

const createClient = async (req, res) => {
    const client = await Client.create({...req.body, user: req.user._id});
    res.status(201).json(client);
}

const getClients = async (req, res) => {
    const clients = await Client.find().where({user: req.user._id});
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
    }
};

module.exports = { createClient, getClients, getClientById };