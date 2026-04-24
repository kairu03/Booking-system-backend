import mongoose from "mongoose";
import request from 'supertest';
import app from "../../src/app.js";
import User from "../../src/modules/users/userModel.js";
import Category from "../../src/modules/categories/categoryModel.js";
import Resource from "../../src/modules/resources/resourceModel.js";
import Booking from "../../src/modules/bookings/bookingModel.js";
import jwt from 'jsonwebtoken';
import { clearRatelimitKeys } from "../../src/utils/clearRatelimitKeys.js";

jest.setTimeout(20000);
describe('Booking routes', () => {

  let user, token, category, resource, newBooking, booking, nonAdminUser, nonAdminToken;

  beforeAll(async () => {
    user = await User.create({
      name: 'usermain1',
      email: `usermain1${Date.now()}@gmail.com`,
      password: 'Password12345',
      role: 'admin'
    });

    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    nonAdminUser = await User.create({
      name: 'nonadmin2',
      email: `nonadmin2${Date.now()}@gmail.com`,
      password: 'Password12',
      role: 'user'
    });

    nonAdminToken = jwt.sign(
      { id: nonAdminUser._id, role: nonAdminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  })

  beforeEach(async () => {
    await clearRatelimitKeys();

    category = await Category.create({
      name: 'Booking Test Category',
      description: 'Booking Test Description',
      image: 'http://example.com/bookingtest.jpg',
      user: user._id
    });

    resource = await Resource.create({
      name: "Conference Room D",
      description: "Sample description D",
      capacity: 50,
      price: 10000,
      pricingType: "day",
      amenities: ["Projector", "Whiteboard"],
      images: ["https://example.com/conference-roomwe.png"],
      category: category._id
    });

    newBooking = {
      resourceId: resource._id.toString(),
      startDate: '2026-04-04T10:00:00.000Z',
      endDate: '2026-04-04T12:00:00.000Z',
    };

    booking = await Booking.create({
      user: nonAdminUser._id,
      resource: resource._id,
      startDate: '2026-05-05T12:00:00.000Z',
      endDate: '2026-05-05T15:00:00.000Z',
    });
  });

  // afterEach(async () => {
  //   await clearRatelimitKeys();
  // });


  describe('POST /api/bookings', () => { // POST BOOKINGS (admin)
    it('should create booking successfully (admin) and return 201', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(newBooking)

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Booking Created Successfully');
      expect(res.body.data).toMatchObject({
        resource: resource._id.toString(),
        startDate: '2026-04-04T10:00:00.000Z',
        endDate: '2026-04-04T12:00:00.000Z'
      });
    });


    it('should create booking successfully (non-admin) and return 201', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send(newBooking)

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Booking Created Successfully');
      expect(res.body.data).toMatchObject({
        resource: resource._id.toString(),
        startDate: '2026-04-04T10:00:00.000Z',
        endDate: '2026-04-04T12:00:00.000Z'
      });
    });


    it('should prevent creation of overlapping bookings and return 400', async () => {
      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resourceId: resource._id.toString(),
          startDate: "2026-04-04T10:00:00.000Z",
          endDate: "2026-04-04T12:00:00.000Z",
        })

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resourceId: resource._id.toString(),
          startDate: "2026-04-04T08:00:00.000Z",
          endDate: "2026-04-04T15:00:00.000Z",
        })

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('This resource is already booked');
    });


    it('should fail with invalid booking dates and return 400', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resourceId: resource._id.toString(),
          startDate: "ber months",
          endDate: "2026-04-04T15:00:00.000Z"
        })

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Start date must be a valid date');
    });


    it('should fail if resource does not exist and return 404', async () => {
      const fakeResourceId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .post(`/api/bookings`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          resourceId: fakeResourceId,
          startDate: "2026-04-04T16:00:00.000Z",
          endDate: "2026-04-04T17:00:00.000Z",
        })

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Resource not found');
    });


    it('should fail if startDate is > endDate and return 400', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resourceId: resource._id.toString(),
          startDate: "2026-04-04T20:00:00.000Z",
          endDate: "2026-04-04T18:00:00.000Z",
        })

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('End date must be greater than start date');
    });


    it('should fail if resource is inactive and return 403', async () => {
      const inActiveResource = await Resource.create({
        name: "inActive Resource name",
        description: "Sample description E",
        capacity: 40,
        price: 13000,
        pricingType: "day",
        amenities: ["Projector", "Whiteboard", "Tables"],
        images: ["https://example.com/conference-room1.png"],
        category: category._id,
        isActive: false
      });

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resourceId: inActiveResource._id.toString(),
          startDate: "2026-04-04T22:00:00.000Z",
          endDate: "2026-04-04T23:00:00.000Z",
        })

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('Resource is inactive');
    });


    it('should block requests exceeding the rate limit and return 429', async () => {
      const ratelimitBooking = {
        resourceId: resource._id.toString(),
        startDate: '2026-07-07T10:00:00.000Z',
        endDate: '2026-07-07T12:00:00.000Z'
      }
      
      for (let i = 1; i <= 5; i++) {
        await request(app)
          .post('/api/bookings')
          .set('Authorization', `Bearer ${nonAdminToken}`)
          .send(ratelimitBooking)
      }

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send(ratelimitBooking)

      expect(res.statusCode).toBe(429);
      expect(res.body.message).toBe('Too many booking attempts, try again later');
    });
  }); // DESCRIBE POST BOOKING


  describe('GET /api/bookings/admin', () => { // GET ALL (admin)
    it('should allow admins to view all bookings and return 200', async () => {
      const res = await request(app)
        .get('/api/bookings/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('All Bookings Fetched Successfully');
      expect(res.body.count).toBe(res.body.data.length);
      expect(res.body.data).toBeInstanceOf(Array);
    });


    it('should not allow non-admin to view all bookings and return 403', async () => {
      const res = await request(app)
        .get('/api/bookings/admin')
        .set('Authorization', `Bearer ${nonAdminToken}`)

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('You do not have permission to access this resource');
    });
  }); // DESCRIBE GET ALL BOOKINGS (admin)


  describe('GET /api/bookings', () => { // GET ALL (user)
    it('should get current users bookings', async () => {
      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send(newBooking)

      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${nonAdminToken}`)

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('My Bookings Fetched Successfully');
      expect(res.body.count).toBe(res.body.data.length);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  }); // GET ALL BOOKINGS (user)


  describe('PATCH /api/bookings/:bookingId', () => { // PATCH BOOKINGS (admin)
    it('should allow admin to update booking status and return 200', async () => {
      const newBook = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(newBooking)

      const bookingId = newBook.body.data._id;

      const res = await request(app)
        .patch(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'approved' })

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Booking Status Updated Succcessfully');
      expect(res.body.data.status).toBe('approved');
    });


    it('should not allow non-admin to update booking status and return 403', async () => {
      const newBook = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(newBooking)

      const bookingId = newBook.body.data._id;

      const res = await request(app)
        .patch(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send({ status: 'rejected' })

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('You do not have permission to access this resource');
    });
  }); // DESCRIBE PATCH BOOKINGS


  describe('DELETE /api/bookings/:bookingId', () => { // DELETE BOOKINGS (user & admin)
    it('should cancel own booking successfully and return 200', async () => {
      const res = await request(app)
        .delete(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${nonAdminToken}`)

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Booking Cancelled Successfully')

      const deletedBooking = await Booking.findById(booking._id);
      expect(deletedBooking.status).toBe('cancelled');
    });


    it('should not allow cancelling another users booking and return 403', async () => {
      const userB = await User.create({
        name: 'userb',
        email: `userb${Date.now()}@gmail.com`,
        password: 'Password123456',
        role: 'user'
      });

      const userBToken = jwt.sign(
        { id: userB._id, role: userB.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      const res = await request(app)
        .delete(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${userBToken}`)

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('Not authorized');
    });


    it('should allow admin to cancel users booking and return 200', async () => {
      const res = await request(app)
        .delete(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Booking Cancelled Successfully');
    });
  }); // DESCRIBE DELETE/CANCEL BOOKINGS 
}); // root