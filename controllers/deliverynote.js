const DeliveryNote = require('../models/deliveryNoteScheme');
const handlePDF = require('../utils/handlePdf');
const handlePinata = require('../utils/handlePinata');

const createDeliveryNote = async (req, res) => {
    const { clientId, projectId, format, material, hours, description, workdate } = req.body;
    const user = req.user;
    const deliveryNote = await DeliveryNote.create({ clientId, projectId, format, material, hours, description, workdate, user });
    res.status(200).json(deliveryNote);
}

const getDeliveryNotes = async (req, res) => {
    const deliveryNotes = await DeliveryNote.find({ user: req.user._id });
    res.status(200).json(deliveryNotes);
}

const getDeliveryNote = async (req, res) => {
    const deliveryNote = await DeliveryNote.findOne({ _id: req.params.id, user: req.user._id }).populate('clientId').populate('projectId').populate('user');
    if (!deliveryNote) {
        return res.status(404).json({ message: 'Delivery note not found' });
    }
    res.status(200).json(deliveryNote);
}

const getDeliveryNotePDF = async (req, res) => {
   const deliveryNote = await DeliveryNote.findOne({ _id: req.params.id, user: req.user._id, signed: true }).populate('user').populate('clientId').populate('projectId');
   if (!deliveryNote) {
    return res.status(404).json({ message: 'Delivery note not found' });
   }
   const pdf = await handlePinata.getFile(`${deliveryNote._id}.pdf`);
   res.status(200).json({ message: 'Delivery note pdf', pdf });
}

const signDeliveryNote = async (req, res) => {
    const deliveryNote = await DeliveryNote.findOne({ _id: req.params.id, user: req.user._id }).populate('user').populate('clientId').populate('projectId');
    if (!deliveryNote) {
        return res.status(404).json({ message: 'Delivery note not found' });
    }    
    await handlePDF(deliveryNote);
    await deliveryNote.updateOne({ signed: true });
    res.status(200).json({ message: 'Delivery note signed', deliveryNote });
}

const getSignedDeliveryNotes = async (req, res) => {
    const deliveryNotes = await DeliveryNote.find({ user: req.user._id, signed: true });
    res.status(200).json(deliveryNotes);
}

const getUnsignedDeliveryNotes = async (req, res) => {  
    const deliveryNotes = await DeliveryNote.find({ user: req.user._id, signed: false });
    res.status(200).json(deliveryNotes);
}

const deleteDeliveryNote = async (req, res) => {
    const deliveryNote = await DeliveryNote.findOne({ _id: req.params.id, user: req.user._id, signed: false });
    if (!deliveryNote) {
        return res.status(404).json({ message: 'Delivery note not found' });
    }
    await DeliveryNote.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Delivery note permanently deleted' });
}

const archiveDeliveryNote = async (req, res) => {
    const deliveryNote = await DeliveryNote.findOne({ _id: req.params.id, user: req.user._id, signed: false });
    if (!deliveryNote) {
        return res.status(404).json({ message: 'Delivery note not found' });
    }
    await deliveryNote.delete();
    res.status(200).json({ message: 'Delivery note archived' });
}

const restoreDeliveryNote = async (req, res) => {
    const deliveryNote = await DeliveryNote.findOneWithDeleted({ _id: req.params.id, user: req.user._id });
    if (!deliveryNote) {
        return res.status(404).json({ message: 'Delivery note not found' });
    }
    await deliveryNote.restore();
    res.status(200).json({ message: 'Delivery note restored' });
}

const getArchivedDeliveryNotes = async (req, res) => {  
    const deliveryNotes = await DeliveryNote.findWithDeleted({ 
        user: req.user._id,
        deleted: true 
    });
    res.status(200).json(deliveryNotes);
}

module.exports = { createDeliveryNote, getDeliveryNotes, getDeliveryNote, getDeliveryNotePDF, signDeliveryNote, getSignedDeliveryNotes, getUnsignedDeliveryNotes, deleteDeliveryNote, archiveDeliveryNote, restoreDeliveryNote, getArchivedDeliveryNotes };
