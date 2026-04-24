# 📌 Booking System Backend

[![Backend CI](https://github.com/kairu03/Booking-system-backend/actions/workflows/ci-backend.yml/badge.svg?branch=main&event=push)](https://github.com/kairu03/Booking-system-backend/actions/workflows/ci-backend.yml)

A scalable RESTful Booking System API built with **Node.js, Express, MongoDB, and JWT authentication**, engineered for real-world performance, security, and maintainability.

Implements production-grade backend practices including role-based access control, modular service architecture, centralized error handling, robust request validation, rate limiting, and automated testing with parallel execution to optimize test performance, alongside CI/CD pipelines for continuous integration and deployment.

---

## 🌐 Live Demo

- Base API URL:
https://booking-system-backend-09yj.onrender.com

--- 

## 🚀 Tech Stack

- Node.js – Runtime environment
- Express.js – Web framework for building RESTful APIs
- MongoDB – NoSQL database
- Mongoose – ODM for MongoDB data modeling
- JSON Web Token (JWT) – Authentication & Authorization
- bcrypt – Secure password hashing
- Joi – Request validation
- Jest & Supertest – Automated API testing
- MongoMemoryServer – In-memory database for isolated testing
- GitHub Actions – Continuous Integration (CI)
- Render – Deployment & Hosting

---

## 📂 Project Structure

```plaintext
booking-system-backend/
├── 📁 .github
│   └── 📁 workflows
│       └── ⚙️ ci-backend.yml
├── 📁 src
│   ├── 📁 config
│   ├── 📁 middlewares
│   │   ├── 📁 ratelimit
│   ├── 📁 modules
│   │   ├── 📁 auth
│   │   ├── 📁 bookings
│   │   ├── 📁 categories
│   │   ├── 📁 common
│   │   │   └── 📁 validators
│   │   ├── 📁 resources
│   │   └── 📁 users
│   ├── 📁 utils
│   ├── 📄 app.js
│   └── 📄 server.js
├── 📁 tests
│   ├── 📁 auth
│   ├── 📁 bookings
│   ├── 📁 categories
│   ├── 📁 resources
│   └── 📁 testSetup
│
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ package-lock.json
└── ⚙️ package.json
```

---

## 🔑 Authentication Flow

0. All protected routes require authentication via JWT.
1. User registers with name, email, and password.
2. Password is securely hashed using bcrypt before being stored in the database.
3. Upon successful login, the server generates a signed JWT containing the user ID and role.
4. The client includes the token in the request header: Authorization: `Bearer <token>`
5. Authentication middleware verifies the token signature and:
  - Extracts the user ID and role from the payload
  - Validates the user exists in the database
  - Attaches the authenticated user to req.user
6. Protected routes enforce role-based access control:
  - Admin users can manage categories, resources, and bookings
  - Regular users can only access and manage their own bookings
7. Authorization logic ensures:
  - Users cannot modify or cancel other users’ bookings
  - Admins can access and manage resources belonging to all users

---

## 📅 Booking Flow

1. A user selects a **resource** under a specific category.
2. The system retrieves the resource details and availability.
3. The user submits a booking request with:
  - selected `resourceId`
  - `startDate`
  - `endDate`
4. The backend validates the request:
  - Ensures the resource exists and is active
  - Validates that `startDate < endDate`
  - Checks for **overlapping bookings** to prevent scheduling conflicts
5. If validation passes:
  - A booking record is created with status `pending` (the default status)
  - The booking is linked to the authenticated user
6. Authorization rules are enforced:
  - Users can only view, cancel, or manage their own bookings
  - Admins can view all bookings and update booking status
7. Cancellation logic:
  - Users may cancel their own bookings
  - Admins can cancel or manage any booking

---

## 🔐 Security Considerations

- **Password Hashing**:
User passwords are securely hashed using bcrypt before being stored, protecting sensitive credentials in case of data breaches.

- **JWT Authentication**:
Authentication tokens are signed using a secret stored in environment variables and verified on every protected request to ensure request integrity.

- **Role-Based Authorization (RBAC)**:
Access to critical operations is restricted based on user roles:
  - Admins can manage categories, resources, and bookings
  - Users can only manage their own bookings

- **Ownership & Access Control**:
Authorization checks ensure users cannot access, modify, or cancel bookings that do not belong to them, while admins retain elevated permissions.

- **Rate Limiting**:
Rate limiting is applied to sensitive endpoints (e.g., authentication and booking) to mitigate brute-force and abuse attacks.

- **Request Validation**:
All incoming requests are validated using Joi to prevent malformed or malicious data from entering the system.

- **Centralized Error Handling**:
Errors are handled through a global middleware to standardize responses and avoid leaking internal implementation details.

- **Environment Variable Protection**:
Sensitive configurations (e.g., JWT secrets, database URIs) are stored in `.env` files and excluded from version control.

- **Test Environment Isolation**:
Automated tests run using an in-memory database to ensure isolation from development and production data.

---

## ✨ Features
- 🔐 JWT-based Authentication (Register & Login)
- 🛡 Role-Based Authorization (Admin & User Access Control)
- 📅 Booking System with Overlap Prevention Logic
- 🏢 Category & Resource Management (Admin-controlled)
- 🔒 Secure Password Hashing using bcrypt
- ✅ Request Validation Middleware for Data Integrity
- ⚠️ Centralized Global Error Handling with Async Wrapper
- 🚦 Rate Limiting for Authentication & Booking Endpoints
- 🧪 Automated Integration Testing using Jest & Supertest
- ⚡ In-Memory Database Testing (MongoMemoryServer) for Fast, Isolated Tests
- ⚙️ Parallel Test Execution for Improved Performance
- 🔄 Continuous Integration via GitHub Actions (Automated Test Runs on Push)
- 🚀 Continuous Deployment with Automatic Redeploy on Render
- 🛡 Security Best Practices (Environment Variables, Protected Routes)

---

## ⚠️ Error Handling
- **Custom `ApiError` Class**
Standardizes error creation with status codes and messages for consistent handling across the application.

- **Async Handler Wrapper**
Eliminates repetitive try-catch blocks by automatically catching rejected promises in async controllers.

- **Global Error Middleware**
Centralized error handler that processes all errors and sends structured responses to the client.

- **Validation Error Handling**
Request validation errors (from Joi) are properly caught and returned with meaningful messages.
Consistent Error Response Format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 📡 API Endpoints

### 🔐 Auth Routes
| Method | Endpoint           | Description              | Access |
|--------|--------------------|--------------------------|--------|
| POST   | /api/auth/register | Register new user        | Public |
| POST   | /api/auth/login    | Login user & get token   | Public |

### 📂 Category Routes
| Method | Endpoint                              | Description                   | Access |
|--------|---------------------------------------|-------------------------------|--------|
| GET    | /api/categories                       | Get all categories            | Public |
| GET    | /api/categories/:categoryId           | Get category by ID            | Public |
| POST   | /api/categories                       | Create category               | Admin  |
| PATCH  | /api/categories/:categoryId           | Update category               | Admin  |
| DELETE | /api/categories/:categoryId           | Delete category               | Admin  |
| GET    | /api/categories/:categoryId/resources | Get all resource by category  | Public |

### 🏢 Resource Routes
| Method | Endpoint                              | Description                   | Access |
|--------|---------------------------------------|-------------------------------|--------|
| GET    | /api/resources/:resourceId            | Get resource by ID            | Public |
| POST   | /api/resources                        | Create resource               | Admin  |
| PATCH  | /api/resources/:resourceId            | Update resource               | Admin  |
| DELETE | /api/resources/:resourceId            | Delete resource               | Admin  |

### 📅 Booking Routes
| Method | Endpoint                              | Description                   | Access     |
|--------|---------------------------------------|-------------------------------|------------|
| GET    | /api/bookings                         | Get user bookings             | User       |
| GET    | /api/bookings/admin                   | Get all bookings              | Admin      |
| POST   | /api/bookings                         | Create booking                | User/Admin |
| PATCH  | /api/bookings/:bookingId              | Update booking status         | Admin      |
| DELETE | /api/bookings/:bookingId              | Cancel booking                | User/Admin |

---

## 🔧 Installation & Setup

1. Clone the repository

- git clone https://github.com/kairu03/Booking-system-backend.git
- cd Booking-system-backend

2. Install dependencies

- npm install

3. Create a .env file in the root directory with the following variables:

- PORT - The port your server runs on (e.g., `5000`)
- MONGO_URI - Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
- JWT_SECRET - Secret key for signing JWT tokens
- CLIENT_URL - Frontend URL(s) for CORS (optional, e.g., `http://localhost:3000`)
- NODE_ENV - Environment mode (`development` or `production`)

4. Run the server

- npm run dev

5. Run tests

- npm test

6. Access the API

- Base URL: http://localhost:5001
- Health Check: http://localhost:5001/health

---

### 👨‍💻 Author<br>
Khylemikel Francisco<br>
Aspiring Full-Stack Developer specializing in Backend
