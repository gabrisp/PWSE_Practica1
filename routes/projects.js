const express = require('express');
const router = express.Router();
const { createProject, updateProject, deleteProject, getProjects, getArchivedProjects, getProjectById, archiveProject, restoreProject } = require('../controllers/projects');

const authMiddleware = require('../middleweare/authMiddleweare');
const validators = require('../validators/projectsValidator');
const { isActiveUser } = require('../middleweare/users');
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Gestión de proyectos
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
 */
router.post('/', authMiddleware, isActiveUser, validators.projectValidator, createProject);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Actualizar un proyecto existente
 *     tags: [Projects]
 */
router.put('/:id', authMiddleware, isActiveUser, validators.projectValidator, updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Eliminar permanentemente un proyecto
 *     tags: [Projects]
 */
router.delete('/:id', authMiddleware, isActiveUser, deleteProject);

/**
 * @swagger
 * /projects/archive/{id}:
 *   delete:
 *     summary: Archivar un proyecto (soft delete)
 *     tags: [Projects]
 */
router.delete('/archive/:id', authMiddleware, isActiveUser, archiveProject);

/**
 * @swagger
 * /projects/restore/{id}:
 *   patch:
 *     summary: Restaurar un proyecto archivado
 *     tags: [Projects]
 */
router.patch('/restore/:id', authMiddleware, isActiveUser, restoreProject);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Projects]
 */
router.get('/', authMiddleware, isActiveUser, getProjects);

/**
 * @swagger
 * /projects/archived:
 *   get:
 *     summary: Obtener todos los proyectos archivados
 *     tags: [Projects]
 */
router.get('/archived', authMiddleware, isActiveUser, getArchivedProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Projects]
 */
router.get('/:id', authMiddleware, isActiveUser, getProjectById);

module.exports = router;