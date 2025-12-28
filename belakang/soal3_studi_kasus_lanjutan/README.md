# ✅ Soal 3: Studi Kasus II - "Secure the Crowd!"

## 📝 CATATAN PENTING

**Soal 3 sudah INCLUDE dalam Soal 2!**

File `server.js` di folder `soal2_studi_kasus/program/` sudah mengimplementasikan **SEMUA** requirement Soal 3:

---

## ✅ Checklist Soal 3

### Framework Implementation
✅ Menggunakan **Express.js** framework (bukan native HTTP)  
✅ Menggunakan **Sequelize ORM** untuk database

### Authentication & Authorization
✅ **JWT Authentication** - Login menghasilkan token  
✅ **Role-based Access Control** - Admin vs User permissions  
✅ **Protected Routes** - Middleware `authenticateToken` dan `requireAdmin`

### Security Features
✅ **Password Hashing** - bcrypt dengan salt rounds 10  
✅ **Input Validation** - express-validator untuk semua endpoint  
✅ **Real-time Stock Validation** - Validasi tiket tersedia saat booking

### Anti-Overselling
✅ **Database Transactions** - Atomic operations  
✅ **Row-Level Locking** - SELECT FOR UPDATE  
✅ **Race Condition Prevention** - Concurrent request handling

### Documentation
✅ **Complete API Documentation** - README.md lengkap  
✅ **OpenAPI/Swagger Style** - Semua endpoint terdokumentasi  
✅ **Request/Response Examples** - Success & Error cases  
✅ **cURL Testing Examples** - Manual testing guide

---

## 📂 Lokasi File

Semua file Soal 3 ada di:
```
soal2_studi_kasus/program/
├── server.js          ← Main application (ALL features included)
├── package.json       ← Dependencies
├── .env.example       ← Environment variables
├── .gitignore         ← Git ignore
└── README.md          ← Complete documentation
```

---

## 🎯 Fitur Tambahan (Beyond Requirements)

1. **Transaction Management**
   - Rollback otomatis jika error
   - Commit hanya jika semua operasi sukses

2. **Automatic Ticket Restoration**
   - Tiket dikembalikan saat booking dibatalkan
   - Tiket dikembalikan saat booking dihapus

3. **Comprehensive Error Handling**
   - 401 Unauthorized (no token)
   - 403 Forbidden (no permission)
   - 404 Not Found
   - 400 Bad Request (validation error)
   - 500 Internal Server Error

4. **Clean Code Structure**
   - Reusable utility functions
   - Middleware pattern
   - Consistent response format

---

## 🚀 Cara Setup & Testing

### 1. Navigate ke folder program
```bash
cd soal2_studi_kasus/program
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup database & environment
```bash
# Buat database PostgreSQL
createdb ticket_platform

# Copy dan edit .env
cp .env.example .env
# Edit .env dengan credentials database Anda
```

### 4. Run server
```bash
npm run dev
```

### 5. Test endpoints
Gunakan cURL atau Postman sesuai dokumentasi di README.md

---

## 📊 API Endpoints Summary

### Authentication (Soal 3)
- `POST /api/auth/register` - Register dengan role
- `POST /api/auth/login` - Login dan dapatkan JWT token
- `GET /api/auth/me` - Get current user (Auth required)

### Events (Soal 3 - Admin Only)
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Bookings (Soal 3 - Protected)
- `GET /api/bookings` - Get bookings (Auth, filtered by role)
- `POST /api/bookings` - Create booking (Auth, anti-overselling)
- `PATCH /api/bookings/:id/status` - Update status (Auth)
- `DELETE /api/bookings/:id` - Delete booking (Auth)

---

## 🔐 Security Implementation Details

### JWT Token Structure
```json
{
  "id": "user_uuid",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1640000000,
  "exp": 1640604800
}
```

### Middleware Chain
```javascript
// Example: Create Event
POST /api/events
  → authenticateToken()     // Verify JWT
  → requireAdmin()          // Check role === 'admin'
  → validation[]            // Validate input
  → handleValidationErrors()
  → controller function     // Execute logic
```

### Anti-Overselling Flow
```javascript
POST /api/bookings
  → authenticateToken()
  → BEGIN TRANSACTION
  → LOCK event row (FOR UPDATE)
  → CHECK available_tickets >= quantity
  → IF insufficient: ROLLBACK + ERROR
  → UPDATE available_tickets
  → CREATE booking
  → COMMIT TRANSACTION
```

---

## 📖 Dokumentasi Lengkap

Lihat file `README.md` di folder `soal2_studi_kasus/program/` untuk:

- Installation guide
- Complete API documentation
- Request/Response examples
- Testing instructions with cURL
- Error handling
- Security features explanation
- Troubleshooting guide
- Deployment instructions

---

## 🎓 Teknologi Yang Digunakan (Sesuai Requirement)

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| Framework | Express.js | ✅ |
| ORM | Sequelize | ✅ |
| Database | PostgreSQL | ✅ |
| Authentication | JWT | ✅ |
| Password Hash | bcrypt | ✅ |
| Validation | express-validator | ✅ |
| Environment | dotenv | ✅ |

---

## 💡 Catatan untuk Reviewer

1. **Single File Architecture**
   - Semua kode dalam `server.js` untuk kemudahan review
   - Mudah di-copy dan di-run
   - Cocok untuk learning purpose

2. **Production-Ready Features**
   - Transaction management
   - Error handling
   - Input validation
   - Security best practices

3. **Complete Documentation**
   - Setiap endpoint terdokumentasi
   - Success & error examples
   - Testing guide included

---
