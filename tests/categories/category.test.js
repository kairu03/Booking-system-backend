import { connectDB } from "../../src/config/db.js";
import mongoose from "mongoose";
import request from 'supertest';
import app from "../../src/app.js";
import User from "../../src/modules/users/userModel.js";
import Category from "../../src/modules/categories/categoryModel.js";
import jwt from 'jsonwebtoken';


describe('Category Routes', () => {

  let user, token, category, nonAdminUser, nonAdminToken;

  beforeAll(async () => {
    await connectDB();

    user = await User.create({
      name: 'test1',
      email: `testcategory${Date.now()}@gmail.com`,
      password: 'TestPass',
      role: 'admin'
    });

    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    nonAdminUser = await User.create({
      name: 'non admin',
      email: `notadmin${Date.now()}@gmail.com`,
      password: 'TestPassword123',
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
      name: 'Test Category',
      description: 'Test Description',
      image: 'http://example.com/test.jpg',
      user: user._id
    });
  });

  afterEach(async () => {
    await Category.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });


  describe('POST /api/categories', () => { // POST
    it('should create category successfully (admin) and return 201', async () => {
      const newCategory = {
        name: 'category1',
        description: 'category description1',
        image: 'http://example.com/category1.jpg'
      }

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory)

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Category Created Successfully');
      expect(res.body.data).toMatchObject({
        ...newCategory
      });
    });


    it('should fail if category already exists and return 400', async () => {
      await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Category' })

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Category' })

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Category already exists')
    });


    it('should not allow non-admin to create category and return 403', async () => {
      const nonAdminCategory = {
        name: 'category3',
        description: 'category description3',
        image: 'http://example.com/category3.jpg'
      }

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send(nonAdminCategory)

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('You do not have permission to access this resource');
    });


    it('should fail with invalid image URL and return 400', async () => {
      const invalidCategoryUrl = {
        name: 'category4',
        description: 'category description4',
        image: 'htp://example.com/category4.j'
      }

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidCategoryUrl)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Image must be a valid URL ending with .jpg, .jpeg, .png, or .webp');
    });


    it('should fail with missing required fields and return 400', async () => {
      const missingField = {
        description: 'category description5',
        image: 'http://example.com/category5.jpg'
      }

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(missingField)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Category name is required');
    });
  }); // DESCRIBE POST


  describe('GET /api/categories', () => { // GET ALL
    it('should get all categories successfully and return 200', async () => {
      const res = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('All Categories Fetched Successfully');
      expect(res.body.count).toBe(res.body.data.length);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  }); // DESCRIBE GET ALL


  describe('GET /api/categories/:categoryId', () => { // GET BY ID
    it('should get category by id and return 200', async () => {

      const res = await request(app)
        .get(`/api/categories/${category._id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true)
      expect(res.body.message).toBe('Category Fetched Successfully');
      expect(res.body.data).toMatchObject(JSON.parse(JSON.stringify(category)));
    });


    it('should fail with invalid category id and return 400', async () => {
      const res = await request(app)
        .get('/api/categories/123123sd')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid Id');
    });
  }); // DESCRIBE GET BY ID


  describe('PATCH /api/categories/:categoryId', () => {
    it('should update category successfully and return 200', async () => {
      const res = await request(app)
        .patch(`/api/categories/${category._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Update Test Category',
          description: 'UpdateTest Description',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Category Updated Successfully');
      expect(res.body.data).toMatchObject({
        name: 'Update Test Category',
        description: 'UpdateTest Description',
      });
    });


    it('should fail with invalid category id and return 400', async () => {
      const res = await request(app)
        .patch('/api/categories/hhj2321j')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid Id')
    });


    it('should not allow non-admin to update category and return 403', async () => {
      const res = await request(app)
        .patch(`/api/categories/${category._id}`)
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send({ name: 'Test Category updated' })

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('You do not have permission to access this resource');
    });
  }); // DESCRIBE PATCH


  describe('DELETE /api/categories/:categoryId', () => {
    it('should delete category successfully and return 200', async () => {
      const res = await request(app)
        .delete(`/api/categories/${category._id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Category Deleted Successfully');

      //verify if category is deleted
      const deletedCategory = await Category.findById(category._id);
      expect(deletedCategory.isActive).toBe(false);
    });


    it('should fail with invalid category id and return 400', async () => {
      const res = await request(app)
        .delete('/api/categories/asda323')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid Id');
    });


    it('should not allow non-admin to delete category and return 403', async () => {
      const res = await request(app)
        .delete(`/api/categories/${category._id}`)
        .set('Authorization', `Bearer ${nonAdminToken}`)

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('You do not have permission to access this resource');
    });
  }); // DESCRIBE DELETE

}); // root 