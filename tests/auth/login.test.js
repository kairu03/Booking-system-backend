import { connectDB } from "../../src/config/db.js";
import mongoose from "mongoose";
import request from 'supertest';
import app from "../../src/app.js";
import User from "../../src/modules/users/userModel.js";
import bcrypt from "bcryptjs";

beforeAll(async () => {
  await connectDB();
})

afterAll(async () => {
  await mongoose.connection.close();
})

// LOGIN
describe('POST /api/auth/login', () => {

  email = `testlogin${Date.now()}@gmail.com`

  beforeEach(async () => {
    await User.deleteMany();
    await User.create({
      name: 'testlogin',
      email,
      password: 'Testpassword'
    });
  })

  it('should logged in the user with a token and return 200', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email,
        password: 'Testpassword'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user).toMatchObject({
      name: 'testlogin',
      email,
      role: 'user'
    });
    expect(res.body.data).toHaveProperty('token');
  });

  it('should fail if user does not exists and return 400', async () => {
    const invalidUserEmail = {
      email: 'invalidEmail@gmail.com',
      password: 'Testpassword'
    };

    const res = await request(app)
      .post('/api/auth/login')
      .send(invalidUserEmail)

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid input');
  });

  it('should fail if password do not match and return 400', async () => {
    const invalidUserPassword = {
      email,
      password: 'invalidpassword'
    };

    const res = await request(app)
      .post('/api/auth/login')
      .send(invalidUserPassword)

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid password');
  });

});