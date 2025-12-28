# 🎫 Ticket Platform API

Platform manajemen tiket event online dengan fitur authentication, authorization, dan anti-overselling.

**Author:** Nuredy Rahma Gunawan 
**Assignment:** GDGoC UNSRI Backend Development

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
  - [Authentication](#authentication)
  - [Users](#users-crud)
  - [Events](#events-crud)
  - [Bookings](#bookings-crud)
- [Security Features](#-security-features)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Assignment Coverage](#-assignment-coverage)

---

## 🚀 Tech Stack

- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Environment:** dotenv

---

## ✨ Features

### Soal 2: Native Implementation
✅ Complete CRUD operations for Users, Events, and Bookings  
✅ Database relationships (1:N, N:1)  
✅ ERD and Flowchart documentation  
✅ Anti-overselling mechanism with transactions  

### Soal 3: Framework + Security
✅ JWT-based authentication  
✅ Role-based authorization (User/Admin)  
✅ Password hashing with bcrypt  
✅ Input validation  
✅ Real-time stock validation  
✅ Complete API documentation  

### Advanced Features
🔒 Transaction-based booking (prevents race condition)  
🔒 Row-level locking (SELECT FOR UPDATE)  
🔒 Automatic ticket restoration on cancellation  
🔒 Token expiration management  

---

## 📦 Installation

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd ticket-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=gdgoc
DB_USER=fullstack
DB_PASSWORD=

JWT_SECRET=your_super_secret_key_min_32_characters
JWT_EXPIRES_IN=7d
```

---

## 🗄️ Database Setup

### Install MySQL
- **Windows:** Download from https://dev.mysql.com/downloads/mysql/
- **macOS:** `brew install mysql`
- **Linux:** `sudo apt-get install mysql-server`

### Create Database
```bash
# Login to MySQL
mysql -u fullstack -p

# Create database
CREATE DATABASE gdgoc;

# Exit
exit
```

### Auto Migration
Database tables akan otomatis dibuat saat aplikasi pertama kali dijalankan menggunakan Sequelize sync.

---

## 🏃 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server akan berjalan di: **http://localhost:3000**

Cek API status:
```bash
curl http://localhost:3000
```

---

## 📚 API Documentation

Base URL: `http://localhost:3000`

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": {...}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": null | object | array
}
```

---

## 🔐 Authentication

### Register
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `name`: Required
- `email`: Required, valid email format
- `password`: Required, min 6 characters
- `role`: Optional, default "user" (values: "user" | "admin")

---

### Login
Authenticate and get access token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

---

### Get Current User
Get authenticated user information.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Data user",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## 👥 Users (CRUD)

### Get All Users
**Endpoint:** `GET /api/users`

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data users",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get User by ID
**Endpoint:** `GET /api/users/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data user",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```

---

### Create User
**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User berhasil dibuat",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "admin"
  }
}
```

---

### Update User
**Endpoint:** `PUT /api/users/:id`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "user"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User berhasil diupdate",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "user"
  }
}
```

---

### Delete User
**Endpoint:** `DELETE /api/users/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "User berhasil dihapus"
}
```

---

## 🎪 Events (CRUD)

### Get All Events
**Endpoint:** `GET /api/events`

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data events",
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "organizer_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "GDGoC Tech Talk 2025",
      "description": "Workshop backend development",
      "location": "UNSRI Palembang",
      "event_date": "2025-02-15T14:00:00.000Z",
      "ticket_price": "50000.00",
      "total_tickets": 100,
      "available_tickets": 85,
      "organizer": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Admin User",
        "email": "admin@gdgoc.com"
      },
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Event by ID
**Endpoint:** `GET /api/events/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data event",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "GDGoC Tech Talk 2025",
    "description": "Workshop backend development",
    "location": "UNSRI Palembang",
    "event_date": "2025-02-15T14:00:00.000Z",
    "ticket_price": "50000.00",
    "total_tickets": 100,
    "available_tickets": 85,
    "organizer": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Admin User",
      "email": "admin@gdgoc.com"
    }
  }
}
```

---

### Create Event (Admin Only)
**Endpoint:** `POST /api/events`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "name": "GDGoC Tech Talk 2025",
  "description": "Workshop backend development",
  "location": "UNSRI Palembang",
  "event_date": "2025-02-15T14:00:00.000Z",
  "ticket_price": 50000,
  "total_tickets": 100
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Event berhasil dibuat",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "organizer_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "GDGoC Tech Talk 2025",
    "description": "Workshop backend development",
    "location": "UNSRI Palembang",
    "event_date": "2025-02-15T14:00:00.000Z",
    "ticket_price": "50000.00",
    "total_tickets": 100,
    "available_tickets": 100
  }
}
```

**Error (403) - Not Admin:**
```json
{
  "success": false,
  "message": "Akses ditolak. Hanya admin yang dapat melakukan aksi ini"
}
```

**Validation Rules:**
- `name`: Required
- `location`: Required
- `event_date`: Required, ISO8601 format
- `ticket_price`: Required, number >= 0
- `total_tickets`: Required, integer >= 1
- `description`: Optional

---

### Update Event (Admin Only)
**Endpoint:** `PUT /api/events/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "name": "GDGoC Tech Talk 2025 (Updated)",
  "ticket_price": 75000
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event berhasil diupdate",
  "data": {...}
}
```

---

### Delete Event (Admin Only)
**Endpoint:** `DELETE /api/events/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event berhasil dihapus"
}
```

---

## 🎟️ Bookings (CRUD)

### Get All Bookings
**Endpoint:** `GET /api/bookings`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Behavior:**
- **User:** Returns only their own bookings
- **Admin:** Returns all bookings

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data bookings",
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "event_id": "770e8400-e29b-41d4-a716-446655440000",
      "quantity": 2,
      "total_price": "100000.00",
      "status": "confirmed",
      "booking_date": "2025-01-15T08:30:00.000Z",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "event": {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "name": "GDGoC Tech Talk 2025",
        "location": "UNSRI Palembang",
        "event_date": "2025-02-15T14:00:00.000Z"
      }
    }
  ]
}
```

---

### Get Booking by ID
**Endpoint:** `GET /api/bookings/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Berhasil mengambil data booking",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "quantity": 2,
    "total_price": "100000.00",
    "status": "confirmed",
    "user": {...},
    "event": {...}
  }
}
```

**Error (403) - Not Owner:**
```json
{
  "success": false,
  "message": "Akses ditolak"
}
```

---

### Create Booking (Anti-Overselling)
**Endpoint:** `POST /api/bookings`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "event_id": "770e8400-e29b-41d4-a716-446655440000",
  "quantity": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking berhasil dibuat",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "event_id": "770e8400-e29b-41d4-a716-446655440000",
    "quantity": 2,
    "total_price": "100000.00",
    "status": "confirmed",
    "booking_date": "2025-01-15T08:30:00.000Z"
  }
}
```

**Error (400) - Insufficient Stock:**
```json
{
  "success": false,
  "message": "Stok tiket tidak mencukupi",
  "errors": {
    "available": 1,
    "requested": 2
  }
}
```

**Validation Rules:**
- `event_id`: Required, valid UUID
- `quantity`: Required, integer >= 1

**Anti-Overselling Mechanism:**
1. Uses database transaction
2. Locks event row with `SELECT FOR UPDATE`
3. Validates stock availability
4. Updates stock and creates booking atomically
5. Rollback on any error

---

### Update Booking Status
**Endpoint:** `PATCH /api/bookings/:id/status`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "status": "cancelled"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Status booking berhasil diupdate",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "status": "cancelled"
  }
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `cancelled`

**Behavior:**
- Changing status to `cancelled` automatically restores tickets to `available_tickets`
- Users can only update their own bookings
- Admins can update any booking

---

### Delete Booking
**Endpoint:** `DELETE /api/bookings/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking berhasil dihapus"
}
```

**Behavior:**
- Automatically restores tickets if status is not `cancelled`
- Users can only delete their own bookings
- Admins can delete any booking

---

## 🛡️ Security Features

### 1. Anti-Overselling Mechanism

**Problem:** Multiple users booking the last ticket simultaneously.

**Solution:** Database transactions with row-level locking.

```javascript
// Pseudo-code
BEGIN TRANSACTION
  LOCK Event row (SELECT FOR UPDATE)
  CHECK available_tickets >= quantity
  IF insufficient:
    ROLLBACK
    RETURN error
  END IF
  UPDATE available_tickets -= quantity
  CREATE booking
COMMIT TRANSACTION
```

**Race Condition Prevention:**
```
Event: 1 ticket available

User A (Request 1):          User B (Request 2):
├─ BEGIN TRANSACTION         ├─ BEGIN TRANSACTION
├─ LOCK event row ✅          ├─ Wait for lock...
├─ Check: 1 >= 1 ✅           │
├─ Update: available = 0     │
├─ Create booking            │
├─ COMMIT ✅                  ├─ LOCK event row ✅
                             ├─ Check: 0 >= 1 ❌
                             ├─ ROLLBACK
                             └─ Return error
```

---

### 2. JWT Authentication

**Token Structure:**
```json
{
  "id": "user_uuid",
  "email": "user@example.com",
  "role": "user",
  "iat": 1640000000,
  "exp": 1640604800
}
```

**Usage:**
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expiration:** 7 days (configurable in `.env`)

---

### 3. Password Security

**Hashing Algorithm:** bcrypt  
**Salt Rounds:** 10

**Process:**
1. User registers with plain password
2. bcrypt hashes password with salt
3. Only hash stored in database
4. Login compares hashed passwords

**Password never exposed in API responses.**

---

### 4. Role-Based Access Control

| Endpoint | Public | User | Admin |
|----------|--------|------|-------|
| GET /api/events | ✅ | ✅ | ✅ |
| POST /api/events | ❌ | ❌ | ✅ |
| PUT /api/events/:id | ❌ | ❌ | ✅ |
| DELETE /api/events/:id | ❌ | ❌ | ✅ |
| GET /api/bookings | ❌ | ✅ (own) | ✅ (all) |
| POST /api/bookings | ❌ | ✅ | ✅ |
| PATCH /api/bookings/:id | ❌ | ✅ (own) | ✅ (all) |
| DELETE /api/bookings/:id | ❌ | ✅ (own) | ✅ (all) |

---

### 5. Input Validation

Using `express-validator` for:
- Email format validation
- Password length (min 6 chars)
- Required fields
- Data type validation (UUID, Integer, Float)
- ISO8601 date format

---

## 🧪 Testing

### Manual Testing with cURL

#### 1. Register Admin
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@gdgoc.com",
    "password": "admin123",
    "role": "admin"
  }'
```

#### 2. Login Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gdgoc.com",
    "password": "admin123"
  }'
```
**Save the token from response!**

#### 3. Create Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "GDGoC Tech Talk 2025",
    "description": "Workshop backend development",
    "location": "UNSRI Palembang",
    "event_date": "2025-02-15T14:00:00.000Z",
    "ticket_price": 50000,
    "total_tickets": 100
  }'
```
**Save the event_id from response!**

#### 4. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "user123"
  }'
```

#### 5. Login User & Create Booking
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "user123"
  }'

# Create booking (use user token and event_id)
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "event_id": "YOUR_EVENT_ID",
    "quantity": 2
  }'
```

#### 6. Get Bookings
```bash
curl -X GET http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

#### 7. Cancel Booking
```bash
curl -X PATCH http://localhost:3000/api/bookings/YOUR_BOOKING_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "status": "cancelled"
  }'
```

---

### Testing with Postman

1. Import Collection:
   - Create new collection "Ticket Platform API"
   - Add environment variables:
     - `base_url`: http://localhost:3000
     - `admin_token`: (will be set after login)
     - `user_token`: (will be set after login)
     - `event_id`: (will be set after creating event)

2. Test Sequence:
   - ✅ Register Admin
   - ✅ Login Admin → Save token
   - ✅ Create Event → Save event_id
   - ✅ Register User
   - ✅ Login User → Save token
   - ✅ Create Booking
   - ✅ Get Bookings
   - ✅ Cancel Booking

---

## 📂 Project Structure

```
ticket-platform/
├── server.js              # Main application file (all-in-one)
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This documentation
```

**All-in-One Architecture:**
- Single `server.js` file contains all code
- Easy to understand and deploy
- Suitable for learning and small projects

**For production, consider splitting into:**
```
src/
├── models/               # Sequelize models
├── controllers/          # Route handlers
├── middleware/           # Custom middleware
├── routes/               # API routes
├── config/               # Configuration files
└── utils/                # Helper functions
```

---

## 📝 Assignment Coverage

### ✅ Soal 1: Pemrograman
- [x] Python solution for "Kode Rahasia GDGoC"
- [x] Time complexity: O(n)
- [x] Space complexity: O(1)

### ✅ Soal 2: Studi Kasus I
- [x] ERD (Entity Relationship Diagram)
- [x] Flowchart pemesanan tiket
- [x] CRUD lengkap: Users, Events, Bookings
- [x] Relasi antar entity (1:N, N:1)
- [x] Anti-overselling mechanism
- [x] Native implementation (Express + Sequelize)

### ✅ Soal 3: Studi Kasus II (Opsional)
- [x] JWT Authentication
- [x] Role-based Authorization
- [x] Password hashing (bcrypt)
- [x] Input validation
- [x] Real-time stock validation
- [x] Complete API documentation
- [x] Framework implementation (Express.js)

---

## 🎯 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

---

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Server port | 3000 | No |
| NODE_ENV | Environment | development | No |
| DB_HOST | MySQL host | localhost | Yes |
| DB_PORT | MySQL port | 3306 | Yes |
| DB_NAME | Database name | gdgoc | Yes |
| DB_USER | Database user | fullstack | Yes |
| DB_PASSWORD | Database password | (empty) | No* |
| JWT_SECRET | JWT signing key | - | Yes |
| JWT_EXPIRES_IN | Token expiration | 7d | No |

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:**
1. Check if MySQL is running: `mysql -u root -p -e "SELECT 1"`
2. Verify database credentials in `.env`
3. Create database if not exists: `mysql -u fullstack -p -e "CREATE DATABASE gdgoc;"`

### JWT Token Error
```
Error: Token tidak valid atau expired
```
**Solution:**
1. Check if token is included in Authorization header
2. Verify JWT_SECRET matches between login and verification
3. Check token expiration date

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
1. Change PORT in `.env` to different number
2. Kill process using port: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

---

## 📈 Performance Tips

1. **Database Indexes:**
   ```sql
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_events_event_date ON events(event_date);
   CREATE INDEX idx_bookings_user_id ON bookings(user_id);
   ```

2. **Connection Pooling:**
   Already configured in Sequelize (max: 5 connections)

3. **Pagination:**
   Add `limit` and `offset` to list endpoints

4. **Caching:**
   Consider Redis for frequently accessed data

---

## 🚀 Deployment

### Heroku
```bash
# Login
heroku login

# Create app
heroku create ticket-platform-api

# Add MySQL (using ClearDB)
heroku addons:create cleardb:ignite

# Get database URL and set to .env
heroku config

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main

# Open app
heroku open
```

### Railway
1. Connect GitHub repository
2. Add MySQL plugin
3. Set environment variables
4. Deploy automatically

---

## 👨‍💻 Author

**Nuredy Rahma Gunawan**
- Email: nuredy.rahma@example.com
- GitHub: github.com/nuredy
- Assignment: GDGoC UNSRI Backend Development

---

## 📄 License

This project is for educational purposes (GDGoC UNSRI Backend Assignment).

---

## 🙏 Acknowledgments

- GDGoC UNSRI Team
- Node.js & Express.js Community
- Sequelize ORM Documentation

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check troubleshooting section
2. Review API documentation
3. Contact: [email@example.com]

---

**Happy Coding! 🎉**
