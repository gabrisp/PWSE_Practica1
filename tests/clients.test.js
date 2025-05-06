const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const clientRouter = require('../routes/clients');
const Client = require('../models/clientsScheme');
const User = require('../models/userSchema');
const { connectDB, closeDB } = require('../utils/dbConnect');
const { tokenSign } = require('../utils/handleJwt');
const { encrypt } = require('../utils/handlePassword');

const app = express();
app.use(express.json());
app.use('/clients', clientRouter);

describe('Rutas de Clientes', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await connectDB();
    // Crear usuario activo para autenticación
    const password = await encrypt('password123');
    const user = await User.create({
      name: 'Test User',
      email: 'testclient@example.com',
      password,
      status: 1 // activo
    });
    userId = user._id;
    token = tokenSign(user);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await closeDB();
  });

  afterEach(async () => {
    await Client.deleteMany({});
  });

  describe('POST /clients', () => {
    it('debería crear un nuevo cliente con datos válidos', async () => {
      const res = await request(app)
        .post('/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Client Test',
          email: 'client@example.com',
          password: 'clientpass',
          cif: 'A12345678',
          address: {
            street: 'Main St',
            number: 1,
            postal: 12345,
            city: 'TestCity',
            province: 'TestProvince'
          }
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('email', 'client@example.com');
      const clientInDB = await Client.findOne({ email: 'client@example.com' });
      expect(clientInDB).not.toBeNull();
    });

    it('debería fallar si no está autenticado', async () => {
      const res = await request(app)
        .post('/clients')
        .send({
          name: 'Client Test',
          email: 'client2@example.com',
          password: 'clientpass',
          cif: 'A12345678',
          address: {
            street: 'Main St',
            number: 1,
            postal: 12345,
            city: 'TestCity',
            province: 'TestProvince'
          }
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /clients', () => {
    it('debería obtener todos los clientes activos', async () => {
      await Client.create({
        name: 'Client1',
        email: 'client1@example.com',
        password: 'clientpass',
        cif: 'A12345678',
        user: userId
      });
      const res = await request(app)
        .get('/clients')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /clients/:id', () => {
    it('debería obtener un cliente por id', async () => {
      const client = await Client.create({
        name: 'Client2',
        email: 'client2@example.com',
        password: 'clientpass',
        cif: 'A12345678',
        user: userId
      });
      const res = await request(app)
        .get(`/clients/${client._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email', 'client2@example.com');
    });
  });

  describe('DELETE /clients/:id', () => {
    it('debería eliminar permanentemente un cliente', async () => {
      const client = await Client.create({
        name: 'Client3',
        email: 'client3@example.com',
        password: 'clientpass',
        cif: 'A12345678',
        user: userId
      });
      const res = await request(app)
        .delete(`/clients/${client._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      const clientInDB = await Client.findById(client._id);
      expect(clientInDB).toBeNull();
    });
  });

  describe('DELETE /clients/archive/:id', () => {
    it('should archive (soft delete) a client', async () => {
      const client = await Client.create({
        name: 'Client4',
        email: 'client4@example.com',
        password: 'clientpass',
        cif: 'A12345678',
        user: userId
      });
      const res = await request(app)
        .delete(`/clients/archive/${client._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      const clientInDB = await Client.findOneWithDeleted({ _id: client._id });
      expect(clientInDB.deleted).toBe(true);
    });
  });

  describe('PATCH /clients/restore/:id', () => {
    it('should restore an archived client', async () => {
      const client = await Client.create({
        name: 'Client5',
        email: 'client5@example.com',
        password: 'clientpass',
        cif: 'A12345678',
        user: userId
      });
      // Primero archivamos el cliente
      await client.delete();
      // Ahora intentamos restaurarlo
      const res = await request(app)
        .patch(`/clients/restore/${client._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      const restoredClient = await Client.findById(client._id);
      expect(restoredClient.deleted).toBe(false);
    });
  });

  describe('GET /clients/archived', () => {
    it('should get all archived clients', async () => {
      const notArchivedClient = await Client.create({
        name: 'Not Archived Client',
        email: 'notarchived@example.com',
        password: 'clientpass',
        cif: 'A12345678',
        user: userId
      });

      const client = await Client.create({
        name: 'Archived Client',
        email: 'archived@example.com',
        password: 'clientpass',
        cif: 'A12345678',
        user: userId
      });
      // Archivamos el cliente
      await client.delete();
      const res = await request(app)
        .get('/clients/archived')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0].deleted).toBe(true);
      res.body.forEach(p => expect(p.deleted).toBe(true));
    });
  });
});

