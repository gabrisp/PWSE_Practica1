const Project = require('../models/projectScheme');
const {handleHttpError} = require('../utils/handleHttpError');

const getProjects = async (req, res) => {
    const projects = await Project.find().where({user: req.user._id}).populate('client');
    res.status(200).json(projects);
};

const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id).where({user: req.user._id}).populate('client');
    if (!project) {
        handleHttpError(res, 'Project not found', 404);
    }
    res.status(200).json(project);
};

const createProject = async (req, res) => {
    try {
        const project = await Project.create({...req.body, user: req.user._id, client: req.body.clientId});
        console.log(project);
        res.status(201).json(project);
    } catch (error) {
        handleHttpError(res, 'Error creating project', 500);
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).where({user: req.user._id});
        if (!project) {
            handleHttpError(res, 'Project not found', 404);
        }

        if (!project.active) {
            handleHttpError(res, 'El proyecto no está activo', 403);
        }

        if (project.user.toString() !== req.user._id.toString()) {
            handleHttpError(res, 'No tienes permisos para actualizar este proyecto', 403);
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
        handleHttpError(res, 'Error updating project', 500);
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).where({user: req.user._id});
        if (!project) {
            handleHttpError(res, 'Project not found', 404);
        }
        await project.deleteOne(); // Hard delete
        res.status(200).json({ message: 'Proyecto eliminado permanentemente' });
    } catch (error) {
        handleHttpError(res, 'Error deleting project', 500);
    }
};

const archiveProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).where({user: req.user._id});
        if (!project) {
            handleHttpError(res, 'Project not found', 404);
        }
        await project.delete(); // Soft delete
        res.status(200).json({ message: 'Proyecto archivado correctamente' });
    } catch (error) {
        handleHttpError(res, 'Error archiving project', 500);
    }
};

const restoreProject = async (req, res) => {
    try {
        const project = await Project.findOneWithDeleted({ _id: req.params.id, user: req.user._id });
        if (!project) {
            handleHttpError(res, 'Project not found', 404);
        }
        await project.restore();
        res.status(200).json({ message: 'Proyecto restaurado correctamente' });
    } catch (error) {
        handleHttpError(res, 'Error restoring project', 500);
    }
};

const getArchivedProjects = async (req, res) => {
    try {
        const projects = await Project.findDeleted({user: req.user._id}).populate('client', 'name email').populate('user', 'name email');
        res.status(200).json(projects);
    } catch (error) {
        handleHttpError(res, 'Error getting archived projects', 500);
    }
};

module.exports = { 
    createProject, 
    updateProject, 
    deleteProject, 
    getProjects, 
    getArchivedProjects, 
    getProjectById, 
    archiveProject,
    restoreProject 
};
