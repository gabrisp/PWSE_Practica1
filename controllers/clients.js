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

module.exports = { createClient, getClients, getClientById };