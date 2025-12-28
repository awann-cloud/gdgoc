# GDGoC UNSRI Backend Assignment - Soal 3

## 📝 Deskripsi

Implementasi **Ticket Booking Platform** menggunakan **Express.js framework** dengan fitur:
- ✅ **JWT Authentication** (Login & Register)
- ✅ **Role-Based Authorization** (Admin & User)
- ✅ **Anti-Overselling** dengan Sequelize Transaction
- ✅ **MVC Architecture** (Models, Controllers, Routes, Middleware)
- ✅ **MySQL** dengan Sequelize ORM

---

## 🏗️ Arsitektur

```
soal3_studi_kasus_lanjutan/program/
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── User.js              # User model with bcrypt hooks
│   ├── Event.js             # Event model
│   ├── Booking.js           # Booking model
│   └── index.js             # Model relationships
├── controllers/
│   ├── authController.js    # Register, Login, Profile
│   ├── eventController.js   # Event CRUD (Admin only)
│   └── bookingController.js # Booking with role filtering
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── eventRoutes.js       # Event endpoints
│   └── bookingRoutes.js     # Booking endpoints
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   └── roleMiddleware.js    # Role-based access control
├── utils/
│   ├── jwt.js               # Token generation & verification
│   └── response.js          # Response helpers
├── server.js                # Main application entry
├── package.json
├── .env.example
├── .gitignore
├── HOW_TO_TEST.md           # Panduan testing lengkap
└── README.md                # This file
```

---

## 🔑 Fitur Utama

### 1. Authentication (JWT)
- **Register**: User baru mendapat JWT token
- **Login**: Verifikasi credentials, return JWT token
- **Protected Routes**: Middleware `authenticateToken` untuk validasi token

### 2. Authorization (Role-Based)
- **Admin**:
  - Create/Update/Delete events
  - View all bookings dari semua users
  - Manage any booking
- **User**:
  - View events (public)
  - Create bookings
  - View/Update/Delete only their own bookings

### 3. Anti-Overselling
```javascript
// Menggunakan Sequelize Transaction + Row Locking
const transaction = await sequelize.transaction();
const event = await Event.findByPk(event_id, {
  lock: transaction.LOCK.UPDATE,  // Lock row
  transaction
});

if (event.available_tickets < quantity) {
  await transaction.rollback();
  return error;
}

// Update tickets atomically
await event.update({ 
  available_tickets: event.available_tickets - quantity 
}, { transaction });

await transaction.commit();
```

### 4. Security Features
- Password hashing dengan **bcrypt** (10 salt rounds)
- JWT dengan configurable expiry (default: 24h)
- Token verification pada setiap protected route
- Role-based middleware untuk authorization

---

## 📊 Database Schema

### Users Table
```sql
id              UUID PRIMARY KEY
name            VARCHAR(255) NOT NULL
email           VARCHAR(255) UNIQUE NOT NULL
password        VARCHAR(255) NOT NULL  -- bcrypt hashed
role            ENUM('user', 'admin') DEFAULT 'user'
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

### Events Table
```sql
id                 UUID PRIMARY KEY
organizer_id       UUID FOREIGN KEY (users.id)
name               VARCHAR(255) NOT NULL
description        TEXT
location           VARCHAR(255) NOT NULL
event_date         TIMESTAMP NOT NULL
ticket_price       DECIMAL(10,2) NOT NULL
total_tickets      INTEGER NOT NULL
available_tickets  INTEGER NOT NULL
createdAt          TIMESTAMP
updatedAt          TIMESTAMP
```

### Bookings Table
```sql
id              UUID PRIMARY KEY
user_id         UUID FOREIGN KEY (users.id)
event_id        UUID FOREIGN KEY (events.id)
quantity        INTEGER NOT NULL
total_price     DECIMAL(10,2) NOT NULL
status          ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending'
booking_date    TIMESTAMP DEFAULT NOW()
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd soal3_studi_kasus_lanjutan/program
npm install
```

### 2. Setup Database
```bash
mysql -u fullstack -p
# Password: ____

# Database sudah unified dengan Soal 2
USE gdgoc;
exit;

# Atau import dari file
mysql -u fullstack -p gdgoc < database_setup.sql
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env sesuai:
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gdgoc
DB_USER=fullstack
DB_PASSWORD=____
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Run Server
```bash
npm start
```

Server berjalan di: **http://localhost:3000**

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
GET    /api/auth/me           # Get current user (🔒 Protected)
```

### Events
```
GET    /api/events            # List all events (Public)
GET    /api/events/:id        # Get event detail (Public)
POST   /api/events            # Create event (🔒 Admin only)
PUT    /api/events/:id        # Update event (🔒 Admin only)
DELETE /api/events/:id        # Delete event (🔒 Admin only)
```

### Bookings
```
GET    /api/bookings          # List bookings (🔒 Role-filtered)
GET    /api/bookings/:id      # Get booking (🔒 Owner or Admin)
POST   /api/bookings          # Create booking (🔒 Protected)
PATCH  /api/bookings/:id/status  # Update status (🔒 Owner or Admin)
DELETE /api/bookings/:id      # Delete booking (🔒 Owner or Admin)
```

🔒 = Requires JWT token in `Authorization: Bearer {token}` header

---

## 📖 Cara Testing

Lihat **[HOW_TO_TEST.md](./HOW_TO_TEST.md)** untuk panduan testing lengkap dengan:
- Setup environment
- Testing authentication flow
- Testing role-based access
- Testing anti-overselling
- cURL commands untuk setiap endpoint
- Expected responses

---

## 🔐 JWT Token Usage

### 1. Register/Login
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Use Token in Requests
```bash
curl http://localhost:3001/api/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🛡️ Security Best Practices

1. **JWT_SECRET**: Gunakan string random yang kuat di production
2. **Password**: Minimum 6 karakter, di-hash dengan bcrypt
3. **Token Expiry**: Set sesuai kebutuhan (default 24h)
4. **HTTPS**: Gunakan HTTPS di production untuk secure token transmission
5. **Environment Variables**: Jangan commit `.env` ke git

---

## 🆚 Perbedaan dengan Soal 2

| Fitur | Soal 2 | Soal 3 |
|-------|--------|--------|
| Authentication | ❌ | ✅ JWT |
| Authorization | ❌ | ✅ Role-based |
| Protected Routes | ❌ | ✅ Middleware |
| Event Creation | Public | Admin only |
| Booking Access | All visible | Role-filtered |
| Middleware Layer | None | Auth + Role |
| Port | 3000 | 3001 |

---

## 🧪 Testing Scenarios

### ✅ Authentication
- [x] Register dengan valid data
- [x] Login dengan correct credentials
- [x] Access protected route dengan valid token
- [x] Reject invalid/expired token

### ✅ Authorization
- [x] Admin dapat CRUD events
- [x] User tidak dapat CRUD events
- [x] User hanya lihat own bookings
- [x] Admin lihat all bookings

### ✅ Anti-Overselling
- [x] Booking mengurangi available_tickets
- [x] Reject booking jika stock tidak cukup
- [x] Cancel/Delete booking restore tickets
- [x] Concurrent bookings handled correctly

---

## 📚 Tech Stack

- **Runtime**: Node.js v14+
- **Framework**: Express.js v4.18
- **ORM**: Sequelize v6.35
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken v9.0)
- **Password**: bcryptjs v2.4
- **Validation**: express-validator v7.0

---

## 📞 Troubleshooting

### Error: "Access token required"
✅ Pastikan header: `Authorization: Bearer {TOKEN}`

### Error: "Access forbidden"
✅ Role tidak sesuai, perlu admin role

### Error: "Insufficient ticket stock"
✅ Anti-overselling bekerja, stock habis

### Error: "Database connection failed"
✅ Check PostgreSQL running dan credentials di `.env`

---

## 👨‍💻 Author

**[Nama Anda]**  
GDGoC UNSRI Backend Development Assignment

---

## 📄 License

ISC
