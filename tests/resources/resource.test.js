import { connectDB } from "../../src/config/db.js";
import mongoose from "mongoose";
import request from 'supertest';
import app from "../../src/app.js";
import User from "../../src/modules/users/userModel.js";
import Category from "../../src/modules/categories/categoryModel.js";
import Resource from "../../src/modules/resources/resourceModel.js";
import jwt from 'jsonwebtoken';

describe('Resource routes', () => {

  let user, token, category, resource, nonAdminUser, nonAdminToken, nonAdminResource;

  beforeAll(async () => {
    await connectDB();

    user = await User.create({
      name: 'usermain',
      email: `usermain${Date.now()}@gmail.com`,
      password: 'Password1234',
      role: 'admin'
    });

    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    nonAdminUser = await User.create({
      name: 'nonadmin',
      email: `nonadmin${Date.now()}@gmail.com`,
      password: 'Password12345',
      role: 'user'
    });

    nonAdminToken = jwt.sign(
      { id: nonAdminUser._id, role: nonAdminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  });

  beforeEach(async () => {
    category = await Category.create({
      name: 'Resource Test Category',
      description: 'Resource Test Description',
      image: 'http://example.com/resourcetest.jpg',
      user: user._id
    });

    resource = await Resource.create({
      name: "Conference Room C",
      description: "Sample description C",
      capacity: 200,
      price: 15000,
      pricingType: "hourly",
      amenities: ["Projector", "Whiteboard"],
      images: ["https://example.com/conference-room2.png"],
      category: category._id
    });

    nonAdminResource = {
      name: "Conference Room A",
      description: "Sample description",
      capacity: 20,
      price: 1500,
      pricingType: "hourly",
      amenities: ["Projector", "Whiteboard", "WiFi", "Conference Phone"],
      images: ["https://example.com/conference-room.png"],
      category: category._id
    };
  });

  afterEach(async () => {
    await Category.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });


  describe('POST /api/categories/:categoryId/resources', () => { // POST 
    it('should create resource sucessfully (admin) and return 201', async () => {
      const newResource = {
        name: "Conference Room A",
        description: "Sample description",
        capacity: 20,
        price: 1500,
        pricingType: "hourly",
        amenities: ["Projector", "Whiteboard", "WiFi", "Conference Phone"],
        images: ["https://example.com/conference-room.png"],
        category: category._id
      };

      const res = await request(app)
        .post(`/api/categories/${category._id}/resources`)
        .set('Authorization', `Bearer ${token}`)
        .send(newResource)

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Resource Created Successfully');
      expect(res.body.data).toMatchObject({
        ...newResource,
        category: category._id.toString()
      });
    });


    it('should not allow non-admin to create resource and return 403', async () => {
      const res = await request(app)
        .post(`/api/categories/${category._id}/resources`)
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send(nonAdminResource)

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('You do not have permission to access this resource');
    });


    it('should fail with missing required fields and return 400', async () => {
      const missingField = {
        name: "Conference Room B",
        capacity: 20,
        price: 1500,
        category: category._id
      }

      const res = await request(app)
        .post(`/api/categories/${category._id}/resources`)
        .set('Authorization', `Bearer ${token}`)
        .send(missingField)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Pricing type is required');
    });
  }); // DESCRIBE POST RESOURCE


  describe('GET /api/categories/:categoryId/resources', () => { // GET ALL
    it('should get all resources by category successfully and return 200', async () => {
      const res = await request(app)
        .get(`/api/categories/${category._id}/resources`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true)
      expect(res.body.message).toBe('All resources for the category fetched successfully');
      expect(res.body.count).toBe(res.body.data.length);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  }); // DESCRIBE GET ALL RESOURCE


  describe('GET /api/categories/:categoryId/resources/:resourceId', () => { // GET BY ID
    it('should get resource by id successfully and return 200', async () => {
      const res = await request(app)
        .get(`/api/categories/${category._id}/resources/${resource._id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Resource Fetched Successfully');
    });


    it('should fail with invalid resource id and return 400', async () => {
      const res = await request(app)
        .get(`/api/categories/${category._id}/resources/76ausdh`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid Id');
    });
  }); // DESCRIBE GET BY ID


  describe('PATCH /api/categories/:categoryId/resources/:resourceId', () => { // PATCH 
    it('should update resource successfully and return 200', async () => {
      const res = await request(app)
        .patch(`/api/categories/${category._id}/resources/${resource._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ price: 15000, })

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Resource Updated Successfully');
        expect(res.body.data.price).toBe(15000);
    });


    it('should not allow non-admin to update resource and return 403', async () => {
      const res = await request(app)
      .patch(`/api/categories/${category._id}/resources/${resource._id}`)
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({ capacity: 50 })

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('You do not have permission to access this resource');
    });


    it('should fail with invalid resource id and return 400', async () => {
      const res = await request(app)
      .patch(`/api/categories/${category._id}/resources/324asd`)
      .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid Id');
    });
  }) // DESCRIBE PATCH RESOURCE


  describe('DELETE /api/categories/:categoryId/resources/:resourceId', () => { // DELETE
    it('should delete resource successfully and return 200', async () => {
      const res = await request(app)
      .delete(`/api/categories/${category._id}/resources/${resource._id}`)
      .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Resource Deleted Successfully');

      // verify if resource is deleted
      const deletedResource = await Resource.findById(resource._id);
      expect(deletedResource.isActive).toBe(false);
    });


    it('should not allow non-admin to delete resource and return 403', async () => {
      const res = await request(app)
      .delete(`/api/categories/${category._id}/resources/${resource._id}`)
      .set('Authorization', `Bearer ${nonAdminToken}`)

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('You do not have permission to access this resource');
    });


    it('should fail with invalid resource id and return 400', async () => {
      const res = await request(app)
      .delete(`/api/categories/${category._id}/resources/asdawe23`)
      .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid Id');
    });
  }); // DESCRIBE DELETE RESOURCE
}); // root 