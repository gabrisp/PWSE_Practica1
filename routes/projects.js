const express = require('express');
const router = express.Router();
const { createProject, updateProject, deleteProject, getProjects, getArchivedProjects, getProjectById, archiveProject } = require('../controllers/projects');
const { isActiveUser } = require('../middleweare/users');
const authMiddleware = require('../middleweare/auth');
const validators = require('../validators/projectsValidator');

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
router.post('/', authMiddleware, isActiveUser, validators.createProjectValidator, createProject);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Actualizar un proyecto existente
 *     tags: [Projects]
 */
router.put('/:id', authMiddleware, isActiveUser, validators.updateProjectValidator, updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Projects]
 */
router.delete('/:id', authMiddleware, isActiveUser, deleteProject);

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

/**
 * @swagger
 * /projects/{id}/archive:
 *   put:
 *     summary: Archivar un proyecto
 *     tags: [Projects]
 */
router.put('/:id/archive', authMiddleware, isActiveUser, archiveProject);