import { connectDB } from "../../src/config/db.js";
import mongoose from "mongoose";
import request from 'supertest';
import app from "../../src/app.js";
import User from "../../src/modules/users/userModel.js";

beforeAll(async () => {
  await connectDB();
})

afterEach(async () => {
  await User.deleteMany();
})

afterAll(async () => {
  await mongoose.connection.close();
})


// REGISTER
describe('POST /api/auth/register', () => {
  it('should create a new user with a token and return 201', async () => {
    const email = `test${Date.now()}@gmail.com`;

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'testregister',
        email,
        password: 'Testpassword'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Register successful');
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user).toMatchObject({
      name: 'testregister',
      email,
      role: 'user'
    });
    expect(res.body.data).toHaveProperty('token');
  });

  it('should fail if user already exists and return 400', async () => {
    const email = `test${Date.now()}@gmail.com`;

    const userExists = {
      name: 'testregister1',
      email,
      password: 'Testpassword'
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
});