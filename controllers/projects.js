const Project = require('../models/projectScheme');


const createProject = async (req, res) => {
    const project = await Project.create({...req.body, user: req.user._id});
    res.status(201).json(project);
};

const updateProject = async (req, res) => {
    try {
        
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        if (!project.active) {
            return res.status(403).json({ error: 'El proyecto no está activo' });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'No tienes permisos para actualizar este proyecto' });
        }

        // Actualizamos los campos del proyecto existente
        Object.assign(project, req.body);
        
        // Guardamos los cambios y obtenemos el documento actualizado
        const updatedProject = await project.save();

        res.status(200).json({
            message: 'Proyecto actualizado correctamente',
            data: updatedProject
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).where({user: req.user._id});
        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProjects = async (req, res) => {
    const projects = await Project.find().where({user: req.user._id, isActive: true});
    res.status(200).json(projects);
};

const getArchivedProjects = async (req, res) => {
    const projects = await Project.find().where({user: req.user._id, isActive: false});
    res.status(200).json(projects);
};

const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id).where({user: req.user._id});
    res.status(200).json(project);
};

const archiveProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, {isActive: false});
        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.status(200).json({ message: 'Proyecto archivado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const restoreProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, {isActive: true});
        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.status(200).json({ message: 'Proyecto restaurado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { createProject, updateProject, deleteProject, getProjects, getArchivedProjects, getProjectById, archiveProject };
