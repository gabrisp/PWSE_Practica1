const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const projectRouter = require('../routes/projects');
const Project = require('../models/projectScheme');
const Client = require('../models/clientsScheme');
const User = require('../models/userSchema');
const { connectDB, closeDB } = require('../utils/dbConnect');
const { tokenSign } = require('../utils/handleJwt');
const { encrypt } = require('../utils/handlePassword');

const app = express();
app.use(express.json());
app.use('/projects', projectRouter);

describe('Rutas de Proyectos', () => {
  let token;
  let userId;
  let clientId;

  beforeAll(async () => {
    await connectDB();
    const password = await encrypt('password123');
    const user = await User.create({
      name: 'Test User',
      email: 'testproject@example.com',
      password,
      status: 1
    });
    userId = user._id;
    token = tokenSign(user);
    console.log("token", token);
    const client = await Client.create({
      name: 'Test Client',
      email: 'clientproject@example.com',
      password: 'clientpass',
      cif: 'A12345678',
      user: userId
    });
    clientId = client._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await closeDB();
  });

  afterEach(async () => {
    await Project.deleteMany({});
  });

  describe('POST /projects', () => {
    it('debería crear un nuevo proyecto con datos válidos', async () => {
      const res = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Project Test',
          projectCode: 'PRJ001',
          email: 'project@example.com',
          address: {
            street: 'Main St',
            number: 1,
            postal: 12345,
            city: 'TestCity',
            province: 'TestProvince'
          },
          code: 'INT001',
          clientId: clientId,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('email', 'project@example.com');
      const projectInDB = await Project.findOne({ email: 'project@example.com' });
      expect(projectInDB).not.toBeNull();
    });

    it('debería fallar si no está autenticado', async () => {
      const res = await request(app)
        .post('/projects')
        .send({
          name: 'Project Test',
          projectCode: 'PRJ002',
          email: 'project2@example.com',
          address: {
            street: 'Main St',
            number: 1,
            postal: 12345,
            city: 'TestCity',
            province: 'TestProvince'
          },
          code: 'INT002',
          clientId: clientId,
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /projects', () => {
    it('debería obtener solo los proyectos activos', async () => {
      const activeProject = await Project.create({
        name: 'Active Project',
        projectCode: 'PRJ003',
        email: 'activeproject@example.com',
        address: {
          street: 'Main St',
          number: 1,
          postal: 12345,
          city: 'TestCity',
          province: 'TestProvince'
        },
        code: 'INT003',
        client: clientId,
        user: userId
      });
      console.log("activeProject", activeProject);
      const archivedProject = await Project.create({
        name: 'Archived Project',
        projectCode: 'PRJ003A',
        email: 'archivedproject@example.com',
        address: {
          street: 'Main St',
          number: 2,
          postal: 12345,
          city: 'TestCity',
          province: 'TestProvince'
        },
        code: 'INT003A',
        client: clientId,
        user: userId
      });
      console.log("archivedProject", archivedProject);
      await archivedProject.delete();

      const res = await request(app)
        .get('/projects')
        .set('Authorization', `Bearer ${token}`);

      console.log("res.body", res.body);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some(p => p.email === 'activeproject@example.com')).toBe(true);
      expect(res.body.some(p => p.email === 'archivedproject@example.com')).toBe(false);
    });
  });

  describe('GET /projects/:id', () => {
    it('debería obtener un proyecto por id', async () => {
      const project = await Project.create({
        name: 'Project2',
        projectCode: 'PRJ004',
        email: 'project2@example.com',
        address: {
          street: 'Main St',
          number: 1,
          postal: 12345,
          city: 'TestCity',
          province: 'TestProvince'
        },
        code: 'INT004',
        client: clientId,
        user: userId
      });
      const res = await request(app)
        .get(`/projects/${project._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email', 'project2@example.com');
    });
  });

  describe('DELETE /projects/:id', () => {
    it('debería eliminar permanentemente un proyecto', async () => {
      const project = await Project.create({
        name: 'Project3',
        projectCode: 'PRJ005',
        email: 'project3@example.com',
        address: {
          street: 'Main St',
          number: 1,
          postal: 12345,
          city: 'TestCity',
          province: 'TestProvince'
        },
        code: 'INT005',
        client: clientId,
        user: userId
      });
      const res = await request(app)
        .delete(`/projects/${project._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      const projectInDB = await Project.findById(project._id);
      expect(projectInDB).toBeNull();
    });
  });

  describe('DELETE /projects/archive/:id', () => {
    it('debería eliminar suavemente (archivar) un proyecto', async () => {
      const project = await Project.create({
        name: 'Project4',
        projectCode: 'PRJ006',
        email: 'project4@example.com',
        address: {
          street: 'Main St',
          number: 1,
          postal: 12345,
          city: 'TestCity',
          province: 'TestProvince'
        },
        code: 'INT006',
        client: clientId,
        user: userId
      });
      const res = await request(app)
        .delete(`/projects/archive/${project._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      const projectInDB = await Project.findOneWithDeleted({ _id: project._id });
      expect(projectInDB.deleted).toBe(true);
    });
  });

  describe('PATCH /projects/restore/:id', () => {
    it('debería restaurar un proyecto archivado', async () => {
      const project = await Project.create({
        name: 'Project5',
        projectCode: 'PRJ007',
        email: 'project5@example.com',
        address: {
          street: 'Main St',
          number: 1,
          postal: 12345,
          city: 'TestCity',
          province: 'TestProvince'
        },
        code: 'INT007',
        client: clientId,
        user: userId
      });
      await project.delete();
      const res = await request(app)
        .patch(`/projects/restore/${project._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      const projectInDB = await Project.findOne({ _id: project._id });
      expect(projectInDB.deleted).toBe(false);
    });
  });

  describe('GET /projects/archived', () => {
    it('debería obtener solo los proyectos archivados', async () => {
      const activeProject = await Project.create({
        name: 'Active Project',
        projectCode: 'PRJ008A',
        email: 'activeproject2@example.com',
        address: {
          street: 'Main St',
          number: 3,
          postal: 12345,
          city: 'TestCity',
          province: 'TestProvince'
        },
        code: 'INT008A',
        client: clientId,
        user: userId
      });
      const archivedProject = await Project.create({
        name: 'Archived Project',
        projectCode: 'PRJ008',
        email: 'archivedproject2@example.com',
        address: {
          street: 'Main St',
          number: 4,
          postal: 12345,
          city: 'TestCity',
          province: 'TestProvince'
        },
        code: 'INT008B',
        client: clientId,
        user: userId
      });
      await archivedProject.delete();

      const res = await request(app)
        .get('/projects/archived')
        .set('Authorization', `Bearer ${token}`);


      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some(p => p.email === 'archivedproject2@example.com')).toBe(true);
      expect(res.body.some(p => p.email === 'activeproject2@example.com')).toBe(false);
      res.body.forEach(p => expect(p.deleted).toBe(true));
    });
  });
});