require("dotenv").config();

const StaticModel = require('../models/staticScheme.js')
const httpError = require('../utils/handleHttpError.js');
const { deleteFile } = require('../utils/handleStorage.js');
const createStatic = async (req, res) => {
    const { filename } = req.file;
    const user = req.user;
    try {
        let newLogo;
        const existingLogo = await StaticModel.findOne({ _id: user.logo });
        if (existingLogo) { // Si hay logo, borramos el archivo y retornamos el logo
            deleteFile(existingLogo.filename);
            existingLogo.filename = filename;
            existingLogo.url = `${process.env.PUBLIC_URL}/static/${filename}`;
            newLogo = await existingLogo.save();
        }else{
            // Si no hay logo, creamos el objeto y lo guardamos en el usuario
            newLogo = new StaticModel({ filename, url: `${process.env.PUBLIC_URL}/static/${filename}` });
            await newLogo.save();
            user.logo = newLogo._id;
            await user.save();
        }
        return res.status(201).json({ message: existingLogo ? 'Logo updated successfully' : 'Logo uploaded successfully', logo: newLogo });
        
    } catch (error) {
        return httpError(res, error);
    }
}

module.exports = { createStatic };