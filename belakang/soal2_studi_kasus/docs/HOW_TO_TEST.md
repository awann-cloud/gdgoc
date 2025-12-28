# Panduan Testing - Soal 2 (Studi Kasus I)

## 📋 Prerequisites

1. **MySQL** terinstall dan running (XAMPP/WAMP/standalone)
2. **Node.js** v14+ terinstall
3. **npm** atau **yarn** terinstall

## 🚀 Setup Database

### Option 1: Via MySQL Command Line
```bash
# Masuk ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE gdgoc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
exit;
```

### Option 2: Via phpMyAdmin (XAMPP/WAMP)
1. Buka http://localhost/phpmyadmin
2. Klik tab "SQL"
3. Copy-paste isi file `gdgoc.sql`
4. Klik "Go"

### Option 3: Import SQL File
```bash
mysql -u root -p < gdgoc.sql
```

## 📦 Instalasi Dependencies

```bash
cd soal2_studi_kasus/program
npm install
```

## ⚙️ Konfigurasi Environment

Copy `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi database Anda:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gdgoc
DB_USER=root
DB_PASSWORD=
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

## 🏃 Menjalankan Server

```bash
npm start
```

Output yang diharapkan:
```
✅ Database connection successful!
✅ Database models synced successfully
🚀 Server running on http://localhost:3000
📚 API Documentation: http://localhost:3000/
```

---

## 🧪 Testing API Endpoints

### 1. USER ENDPOINTS

#### 1.1 Create User (POST /api/users)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 1.2 Create Admin User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

#### 1.3 Get All Users (GET /api/users)
```bash
curl http://localhost:3000/api/users
```

#### 1.4 Get User by ID (GET /api/users/:id)
```bash
# Ganti {user_id} dengan ID user yang sudah dibuat
curl http://localhost:3000/api/users/{user_id}
```

#### 1.5 Update User (PUT /api/users/:id)
```bash
curl -X PUT http://localhost:3000/api/users/{user_id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com"
  }'
```

#### 1.6 Delete User (DELETE /api/users/:id)
```bash
curl -X DELETE http://localhost:3000/api/users/{user_id}
```

---

### 2. EVENT ENDPOINTS

#### 2.1 Create Event (POST /api/events)
```bash
# Gunakan organizer_id dari user yang sudah dibuat (admin)
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Music Festival 2024",
    "description": "Annual music festival with top artists",
    "organizer_id": "{admin_user_id}",
    "event_date": "2024-12-31T20:00:00Z",
    "location": "Jakarta Convention Center",
    "ticket_price": 500000,
    "total_tickets": 1000
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "uuid-here",
    "name": "Music Festival 2024",
    "available_tickets": 1000,
    "ticket_price": "500000.00"
  }
}
```

#### 2.2 Get All Events (GET /api/events)
```bash
curl http://localhost:3000/api/events
```

#### 2.3 Get Event by ID (GET /api/events/:id)
```bash
curl http://localhost:3000/api/events/{event_id}
```

#### 2.4 Update Event (PUT /api/events/:id)
```bash
curl -X PUT http://localhost:3000/api/events/{event_id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Music Festival 2024 - Updated",
    "ticket_price": 550000
  }'
```

#### 2.5 Delete Event (DELETE /api/events/:id)
```bash
curl -X DELETE http://localhost:3000/api/events/{event_id}
```

---

### 3. BOOKING ENDPOINTS (Anti-Overselling)

#### 3.1 Create Booking (POST /api/bookings)
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "{user_id}",
    "event_id": "{event_id}",
    "quantity": 2
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "uuid-here",
    "user_id": "uuid",
    "event_id": "uuid",
    "quantity": 2,
    "total_price": "1000000.00",
    "status": "pending"
  }
}
```

#### 3.2 Get All Bookings (GET /api/bookings)
```bash
curl http://localhost:3000/api/bookings
```

#### 3.3 Get Booking by ID (GET /api/bookings/:id)
```bash
curl http://localhost:3000/api/bookings/{booking_id}
```

#### 3.4 Update Booking Status (PATCH /api/bookings/:id/status)
```bash
# Confirm booking
curl -X PATCH http://localhost:3000/api/bookings/{booking_id}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'

# Cancel booking (akan restore available_tickets)
curl -X PATCH http://localhost:3000/api/bookings/{booking_id}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled"
  }'
```

#### 3.5 Delete Booking (DELETE /api/bookings/:id)
```bash
curl -X DELETE http://localhost:3000/api/bookings/{booking_id}
```

---

## 🧪 Testing Anti-Overselling Feature

### Scenario 1: Normal Booking
```bash
# 1. Create event with 10 tickets
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Event",
    "description": "Testing anti-overselling",
    "organizer_id": "{admin_id}",
    "event_date": "2024-12-31T20:00:00Z",
    "location": "Test Location",
    "ticket_price": 100000,
    "total_tickets": 10
  }'

# 2. Book 5 tickets
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "{user_id}",
    "event_id": "{event_id}",
    "quantity": 5
  }'

# 3. Check event - should have 5 available_tickets
curl http://localhost:3000/api/events/{event_id}
```

### Scenario 2: Overselling Prevention
```bash
# 1. Try to book more than available
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "{user_id}",
    "event_id": "{event_id}",
    "quantity": 20
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Insufficient ticket stock"
}
```

### Scenario 3: Concurrent Booking (Simulation)
Buka 2 terminal dan jalankan bersamaan:

**Terminal 1:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "{user_id_1}",
    "event_id": "{event_id}",
    "quantity": 5
  }'
```

**Terminal 2:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "{user_id_2}",
    "event_id": "{event_id}",
    "quantity": 5
  }'
```

✅ Dengan transaction dan row locking, salah satu request akan berhasil, yang lain akan gagal jika stock tidak cukup.

### Scenario 4: Cancellation Restores Tickets
```bash
# 1. Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "{user_id}",
    "event_id": "{event_id}",
    "quantity": 3
  }'

# 2. Check available tickets (should decrease by 3)
curl http://localhost:3000/api/events/{event_id}

# 3. Cancel booking
curl -X PATCH http://localhost:3000/api/bookings/{booking_id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "cancelled"}'

# 4. Check again - available tickets should restore by 3
curl http://localhost:3000/api/events/{event_id}
```

---

## 🔍 Testing Error Handling

### Invalid Data
```bash
# Missing required fields
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test"
  }'
```

**Expected:** Validation error message

### Duplicate Email
```bash
# Create user with same email twice
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User1",
    "email": "duplicate@test.com",
    "password": "pass123"
  }'

curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User2",
    "email": "duplicate@test.com",
    "password": "pass456"
  }'
```

**Expected:** "Email already exists" error

### Invalid UUID
```bash
curl http://localhost:3000/api/users/invalid-uuid
```

**Expected:** "Invalid user ID format" error

---

## 📊 Database Verification

Check data langsung di database:

```sql
-- Check users
SELECT id, name, email, role FROM users;

-- Check events with available tickets
SELECT id, name, total_tickets, available_tickets FROM events;

-- Check bookings
SELECT b.id, u.name as user_name, e.name as event_name, 
       b.quantity, b.total_price, b.status
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN events e ON b.event_id = e.id;
```

---

## ✅ Checklist Testing

- [ ] User CRUD operations work
- [ ] Event CRUD operations work
- [ ] Booking creation reduces available_tickets
- [ ] Cannot book more than available tickets
- [ ] Cancelling booking restores tickets
- [ ] Deleting booking restores tickets
- [ ] Duplicate email prevention works
- [ ] Password is hashed (not stored plain text)
- [ ] Transaction rollback on errors
- [ ] Concurrent bookings handled correctly

---

## 🐛 Common Issues

### Error: "Database connection failed"
- Pastikan MySQL running (cek di XAMPP/WAMP control panel)
- Check credentials di `.env` (user, password)
- Pastikan database `gdgoc` sudah dibuat
- Coba: `mysql -u root -p` untuk test koneksi manual

### Error: "Port already in use"
- Ganti PORT di `.env`
- Atau kill process di port 3000: `netstat -ano | findstr :3000`

### Error: "Cannot find module"
- Jalankan `npm install` lagi
- Delete `node_modules` dan `package-lock.json`, lalu install ulang

---

## 📝 Notes

- **Database**: MySQL (bukan PostgreSQL)
- **Database Name**: `gdgoc`
- **Anti-Overselling** menggunakan Sequelize Transaction + Row Locking (`LOCK.UPDATE`)
- **Password Security** menggunakan bcrypt dengan 10 salt rounds
- **UUID** digunakan untuk semua primary keys (CHAR(36))
- **Cascade Delete** diaktifkan untuk relasi (hapus user → hapus bookings)
- **Test Script**: Gunakan `test-anti-overselling.ps1` untuk testing lengkap
