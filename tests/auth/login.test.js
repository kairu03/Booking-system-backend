import { connectDB } from "../../src/config/db.js";
import mongoose from "mongoose";
import request from 'supertest';
import app from "../../src/app.js";
import User from "../../src/modules/users/userModel.js";
import { clearRatelimitKeys } from "../../src/utils/clearRatelimitKeys.js";

beforeAll(async () => {
  await connectDB();
})

beforeEach(async () => {
  await User.deleteMany();
  email = `testlogin${Date.now()}@gmail.com`
  await User.create({
    name: 'testlogin',
    email,
    password: 'Testpassword'
  });
});

afterEach(async () => {
  await clearRatelimitKeys();
})

afterAll(async () => {
  await mongoose.connection.close();
})

// LOGIN
describe('POST /api/auth/login', () => {
  it('should login successfully and return 200', async () => {
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


  it('should fail if userEmail does not exists and return 400', async () => {
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


  it('should fail with missing email and return 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'Testpassword' })

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email is required');
  });


  it('should fail with missing password and return 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email })

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Password is required');
  });


  it('should block requests exceeding the rate limit and return 429', async () => {
    for (let i = 1; i <= 3; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({
          email,
          password: 'Testpassword'
        })
    }

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email,
        password: 'Testpassword'
      })

    expect(res.statusCode).toBe(429);
    expect(res.body.message).toBe('Too many login attempts, try again later');
  });
});