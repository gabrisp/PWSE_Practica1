const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('../routes/users');
const User = require('../models/userSchema');
const { connectDB, closeDB } = require('../utils/dbConnect');
const { tokenSign } = require('../utils/handleJwt');
const { encrypt } = require('../utils/handlePassword');
const app = express();
app.use(express.json());
app.use('/user', userRouter);



describe('Rutas para el Usuario', () => {
  beforeAll(async () => {
    await connectDB(); // Esto debe conectar a la BD de testing
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // Limpiar después de todos los tests
    await closeDB(); // Cerrar conexión
  });

  afterEach(async () => {
    await User.deleteMany({}); // Limpiar usuarios tras cada test
  });

  describe('POST /user/register', () => {
    it('Debería registrar un nuevo usuario con datos válidos', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({
          name: 'Test',
          email: 'testuser@example.com',
          password: 'securePass123'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty('email', 'testuser@example.com');

      const userInDB = await User.findOne({ email: 'testuser@example.com' });
      expect(userInDB).not.toBeNull();
    });

    it('Debería fallar si faltan campos requeridos', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({
          email: 'incomplete@example.com'
          // falta name y password
        });
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('errors');
    });

    it('Debería fallar si el email ya existe', async () => {
      // Primero creamos un usuario
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      });

      // Intentamos crear otro con el mismo email
      const res = await request(app)
        .post('/user/register')
        .send({
          name: 'New User',
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('error', 'Email ya esta en uso');
    });
  });

  describe('PUT /user/register', () => {
    let userId;
    let token;

    beforeEach(async () => {
      // Crear usuario y obtener token para las pruebas
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        status: 1
      });
      userId = user._id;
      // Aquí deberías generar un token válido para el usuario
      token =  tokenSign(user);
    });

    it('Debería actualizar los datos del usuario con éxito', async () => {
      const res = await request(app)
        .put('/user/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          email: 'updated@example.com',
          nif: '123456789',
          surnames: 'Updated Surnames'
        });
      console.log("res.body->update", res.body);
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Updated Name');
      expect(res.body.email).toBe('updated@example.com');
    });

    it('Debería fallar si no está autenticado', async () => {
      const res = await request(app)
        .put('/user/register')
        .send({
          name: 'Updated Name',
          email: 'updated@example.com'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /user/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'gabriel@gmail.com',
        password: await encrypt('password123'),
        status: 1
      });
    });

    it('Debería iniciar sesión con credenciales correctas', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({
            email: 'gabriel@gmail.com',
            password: 'password123',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'gabriel@gmail.com');
    });

    it('Debería fallar con contraseña incorrecta', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({
          email: 'gabriel@gmail.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'INVALID_PASSWORD');
    });

  });

  describe('PUT /user/verify', () => {
    beforeEach(async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        status: 0,
        verificationCode: '123456',
        attempts: 3
      });
    });

    it('Debería verificar el usuario con éxito con el código correcto', async () => {
        const user = await User.findOne({email: 'test@example.com'});
        const code = user.verificationCode;
        const token = tokenSign(user);
        console.log("code->", code, "token->", token);
        
        const res = await request(app)
          .put('/user/verify')
          .set('Authorization', `Bearer ${token}`)
          .send({
            code: code,
          });
        
        expect(res.statusCode).toBe(200);
        
        // Use the user's _id that we already have
        const updatedUser = await User.findById(user._id);
        expect(updatedUser.status).toBe(1);
    });

    it('Debería bloquear el usuario después de 3 intentos fallidos', async () => {
      // Intentar verificar 3 veces con código incorrecto
      const user = await User.findOne({email: 'test@example.com'});
      const token = tokenSign(user);    

      // First attempt
      await request(app)
        .put('/user/verify')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: '555555'
        });

      // Second attempt
      await request(app)
        .put('/user/verify')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: '555555'
        });

      // Third attempt
      await request(app)
        .put('/user/verify')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: '555555'
        });

      // Fourth attempt (should be blocked)
      const res = await request(app)
        .put('/user/verify')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: '555555'
        });

      console.log("res.body->verify", res.body);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'USER_LOCKED');
    });
  });
});
