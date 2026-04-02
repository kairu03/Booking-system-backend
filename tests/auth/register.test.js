import { connectDB } from "../../src/config/db.js";
import mongoose from "mongoose";
import request from 'supertest';
import app from "../../src/app.js";
import User from "../../src/modules/users/userModel.js";
import { clearRatelimitKeys } from "../../src/utils/clearRatelimitKeys.js";

beforeAll(async () => {
  await connectDB();
})

afterEach(async () => {
  await User.deleteMany();
  await clearRatelimitKeys();
})

afterAll(async () => {
  await mongoose.connection.close();
})


// REGISTER
describe('POST /api/auth/register', () => {
  it('should register successfully and return 201', async () => {
    const email = `test${Date.now()}@gmail.com`;

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'testregister1',
        email,
        password: 'Testpassword1'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Register successful');
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user).toMatchObject({
      name: 'testregister1',
      email,
      role: 'user'
    });
    expect(res.body.data).toHaveProperty('token');
  });


  it('should fail if user already exists and return 400', async () => {
    const email = `test${Date.now()}@gmail.com`;

    const userExists = {
      name: 'testregister2',
      email,
      password: 'Testpassword2'
    }

    await request(app)
      .post('/api/auth/register')
      .send(userExists)

    const res = await request(app)
      .post('/api/auth/register')
      .send(userExists)

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });


  it('should fail with missing email and return 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'testregister3',
        password: 'Testpassword3'
      })

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email is required');
  });


  it('should fail with invalid email format and return 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'testregister4',
        email: 'testgmailcom',
        password: 'Testpassword4'
      })

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email must be in valid format');
  });


  it('should fail with missing password and return 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'testregister5',
        email: 'test5@gmail.com',
      })

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Password is required');
  });


  it('should block requests exceeding the rate limit and return 429', async () => {
    for (let i = 1; i <= 5; i++) {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'testregister6',
          email: 'test6@gmail.com',
          password: 'Testpassword6'
        })
    }

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'testregister6',
        email: 'test6@gmail.com',
        password: 'Testpassword6'
      })

    expect(res.statusCode).toBe(429);
    expect(res.body.message).toBe('Too many register attempts, try again later');
  });
}); 