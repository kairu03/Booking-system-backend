import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Category from '../../src/modules/categories/categoryModel.js';
import Resource from '../../src/modules/resources/resourceModel.js';
import Booking from '../../src/modules/bookings/bookingModel.js';
import { testStore } from '../../src/middlewares/ratelimit/createLimiter.js';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  testStore.clear();
});

afterEach(async () => {
  await Category.deleteMany();
  await Resource.deleteMany();
  await Booking.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});


