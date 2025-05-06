const Client = require('../models/clientsScheme');

const createClient = async (req, res) => {
    try {
        const client = await Client.create({...req.body, user: req.user._id});
        res.status(201).json(client);
    } catch (error) {
        handleHttpError(res, 'Error creating client', 500);
    }
}


const getClients = async (req, res) => {
    try {
        const clients = await Client.find().populate('user', '-password');
        res.status(200).json(clients);
    } catch (error) {
        handleHttpError(res, 'Error getting clients', 500);
    }
};

const getArchivedClients = async (req, res) => {
    try {
        const clients = await Client.findDeleted({user: req.user._id}).populate('user', '-password');
        res.status(200).json(clients);
    } catch (error) {
        handleHttpError(res, 'Error getting archived clients', 500);
    }
};

const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).populate('user', '-password');
        if (!client) {
            return handleHttpError(res, 'Client not found', 404);
        }
        res.status(200).json(client);
    } catch (error) {
        handleHttpError(res, 'Error getting client', 500);
    }
};

const deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return handleHttpError(res, 'Client not found', 404);
        }
        await client.deleteOne(); // Hard delete
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        handleHttpError(res, 'Error deleting client', 500);
    }
};

const archiveClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return handleHttpError(res, 'Client not found', 404);
        }
        await client.delete(); // Soft delete
        res.status(200).json({ message: 'Client archived successfully' });
    } catch (error) {
        handleHttpError(res, 'Error archiving client', 500);
    }
};

const restoreClient = async (req, res) => {
    try {
        const client = await Client.findOneDeleted({ _id: req.params.id });
        if (!client) {
            return handleHttpError(res, 'Archived client not found', 404);
        }
        await client.restore();
        res.status(200).json({ message: 'Client restored successfully' });
    } catch (error) {
        handleHttpError(res, 'Error restoring client', 500);
    }
};

module.exports = {
    createClient,
    getClients,
    getArchivedClients,
    getClientById,
    deleteClient,
    archiveClient,
    restoreClient
};