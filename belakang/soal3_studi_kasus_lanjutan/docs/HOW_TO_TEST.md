# Panduan Testing - Soal 3 (Studi Kasus II - with JWT)

## 📋 Prerequisites

1. **MySQL** terinstall dan running
2. **Node.js** v14+ terinstall
3. **npm** atau **yarn** terinstall
4. **curl** atau **Postman** untuk testing API (lebih recommend Postman)

## 🚀 Setup Database

```bash
# Masuk ke MySQL
mysql -u fullstack -p
# Password: ___

# Database sudah unified dengan Soal 2
USE gdgoc;

# Exit
exit;
```

**CATATAN**: Database sudah ada (`gdgoc.sql`). Jika belum import:
```bash
mysql -u fullstack -p gdgoc < gdgoc.sql
```

## 📦 Instalasi Dependencies

```bash
cd soal3_studi_kasus_lanjutan/program
npm install
```

## ⚙️ Konfigurasi Environment

Copy `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi Anda:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=gdgoc
DB_USER=fullstack
DB_PASSWORD=Rama1917

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

⚠️ **PENTING**: Soal 2 dan Soal 3 share database `gdgoc` yang sama (MySQL)

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
🔐 JWT Authentication enabled
🛡️  Anti-Overselling protection active
```

---

## 🧪 Testing Flow (Step by Step)

### Phase 1: AUTHENTICATION

#### 1.1 Register Regular User
```bash
curl -X POST http://localhost:3000/api/auth/register \
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
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

✅ **Save the token!** Anda akan menggunakan token ini untuk request selanjutnya.

#### 1.2 Register Admin User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

✅ **Save admin token!**

#### 1.3 Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 1.4 Get Profile (Protected)
```bash
# Ganti {TOKEN} dengan token yang Anda dapat dari register/login
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer {TOKEN}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### Phase 2: EVENT MANAGEMENT (Admin Only)

#### 2.1 Create Event (Admin Only)
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -d '{
    "name": "Music Festival 2024",
    "description": "Annual music festival with top artists",
    "location": "Jakarta Convention Center",
    "event_date": "2024-12-31T20:00:00Z",
    "ticket_price": 500000,
    "total_tickets": 100
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "event-uuid",
    "name": "Music Festival 2024",
    "available_tickets": 100,
    "ticket_price": "500000.00"
  }
}
```

#### 2.2 Try Create Event without Token (Should Fail)
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Event",
    "location": "Test Location",
    "event_date": "2024-12-31T20:00:00Z",
    "ticket_price": 100000,
    "total_tickets": 50
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Access token required"
}
```

#### 2.3 Try Create Event as Regular User (Should Fail)
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -d '{
    "name": "Test Event",
    "location": "Test Location",
    "event_date": "2024-12-31T20:00:00Z",
    "ticket_price": 100000,
    "total_tickets": 50
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Access forbidden: Insufficient permissions"
}
```

#### 2.4 Get All Events (Public)
```bash
curl http://localhost:3000/api/events
```

✅ No authentication required!

#### 2.5 Update Event (Admin Only)
```bash
curl -X PUT http://localhost:3000/api/events/{event_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -d '{
    "name": "Music Festival 2024 - Updated",
    "ticket_price": 550000
  }'
```

#### 2.6 Delete Event (Admin Only)
```bash
curl -X DELETE http://localhost:3000/api/events/{event_id} \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```

---

### Phase 3: BOOKING (Authentication Required)

#### 3.1 Create Booking (Regular User)
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -d '{
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
    "id": "booking-uuid",
    "quantity": 2,
    "total_price": "1000000.00",
    "status": "pending"
  }
}
```

#### 3.2 Try Create Booking without Token (Should Fail)
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "{event_id}",
    "quantity": 2
  }'
```

**Expected:** "Access token required"

#### 3.3 Get All Bookings (User sees only their own)
```bash
curl http://localhost:3000/api/bookings \
  -H "Authorization: Bearer {USER_TOKEN}"
```

**Expected:** Returns only bookings created by this user

#### 3.4 Get All Bookings (Admin sees all)
```bash
curl http://localhost:3000/api/bookings \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```

**Expected:** Returns all bookings from all users

#### 3.5 Update Booking Status
```bash
# Confirm booking
curl -X PATCH http://localhost:3000/api/bookings/{booking_id}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -d '{"status": "confirmed"}'

# Cancel booking (restores tickets)
curl -X PATCH http://localhost:3000/api/bookings/{booking_id}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -d '{"status": "cancelled"}'
```

#### 3.6 Try to Access Other User's Booking (Should Fail)
```bash
# User 1 creates booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {USER1_TOKEN}" \
  -d '{
    "event_id": "{event_id}",
    "quantity": 1
  }'

# User 2 tries to view User 1's booking
curl http://localhost:3000/api/bookings/{user1_booking_id} \
  -H "Authorization: Bearer {USER2_TOKEN}"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "You can only view your own bookings"
}
```

---

## 🔒 Role-Based Access Control Test Matrix

| Endpoint | No Auth | User Role | Admin Role |
|----------|---------|-----------|------------|
| GET /api/events | ✅ | ✅ | ✅ |
| GET /api/events/:id | ✅ | ✅ | ✅ |
| POST /api/events | ❌ 401 | ❌ 403 | ✅ |
| PUT /api/events/:id | ❌ 401 | ❌ 403 | ✅ |
| DELETE /api/events/:id | ❌ 401 | ❌ 403 | ✅ |
| POST /api/bookings | ❌ 401 | ✅ (own) | ✅ (any) |
| GET /api/bookings | ❌ 401 | ✅ (own) | ✅ (all) |
| GET /api/bookings/:id | ❌ 401 | ✅ (own) | ✅ (any) |
| PATCH /api/bookings/:id/status | ❌ 401 | ✅ (own) | ✅ (any) |
| DELETE /api/bookings/:id | ❌ 401 | ✅ (own) | ✅ (any) |

---

## 🧪 Testing Anti-Overselling with JWT

### Scenario 1: Normal Booking Flow
```bash
# 1. Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.com",
    "password": "test123"
  }'

# Save the token!

# 2. Create event as admin
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -d '{
    "name": "Test Event",
    "description": "Testing",
    "location": "Test Location",
    "event_date": "2024-12-31T20:00:00Z",
    "ticket_price": 100000,
    "total_tickets": 10
  }'

# 3. Book tickets as user
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -d '{
    "event_id": "{event_id}",
    "quantity": 5
  }'

# 4. Check event - should have 5 available tickets left
curl http://localhost:3000/api/events/{event_id}
```

### Scenario 2: Overselling Prevention
```bash
# Try to book more than available
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -d '{
    "event_id": "{event_id}",
    "quantity": 100
  }'
```

**Expected:** "Insufficient ticket stock"

### Scenario 3: Ticket Restoration
```bash
# 1. Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -d '{
    "event_id": "{event_id}",
    "quantity": 3
  }'

# 2. Check available tickets (should decrease by 3)
curl http://localhost:3000/api/events/{event_id}

# 3. Cancel booking
curl -X PATCH http://localhost:3000/api/bookings/{booking_id}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -d '{"status": "cancelled"}'

# 4. Check again - tickets should restore by 3
curl http://localhost:3000/api/events/{event_id}
```

---

## 🔍 JWT Token Testing

### Valid Token
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer {VALID_TOKEN}"
```

**Expected:** Returns user data

### Invalid Token
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid-token-123"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Missing Token
```bash
curl http://localhost:3000/api/auth/me
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Token Format Wrong (Missing "Bearer")
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: {TOKEN_WITHOUT_BEARER}"
```

**Expected:** "Access token required"

---

## 📊 Database Verification

```sql
-- Check users with roles
SELECT id, name, email, role FROM users;

-- Check events
SELECT id, name, total_tickets, available_tickets FROM events;

-- Check bookings with user info
SELECT b.id, u.name as user_name, u.role, e.name as event_name, 
       b.quantity, b.total_price, b.status
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN events e ON b.event_id = e.id;
```

---

## ✅ Complete Testing Checklist

### Authentication
- [ ] User can register with valid data
- [ ] Cannot register with duplicate email
- [ ] User can login with correct credentials
- [ ] Login fails with wrong credentials
- [ ] JWT token is returned on register/login
- [ ] Protected routes require valid token
- [ ] Invalid/expired token is rejected

### Authorization (Role-Based)
- [ ] Admin can create/update/delete events
- [ ] Regular user CANNOT create/update/delete events
- [ ] User can only see their own bookings
- [ ] Admin can see all bookings
- [ ] User can only update/delete their own bookings
- [ ] Admin can update/delete any booking

### Event Management
- [ ] Events can be viewed without authentication
- [ ] Admin can create event
- [ ] Available tickets initialized correctly
- [ ] Admin can update event
- [ ] Admin can delete event

### Booking & Anti-Overselling
- [ ] Authenticated user can create booking
- [ ] Booking reduces available_tickets
- [ ] Cannot book more than available tickets
- [ ] Cancelling booking restores tickets
- [ ] Deleting booking restores tickets
- [ ] Concurrent bookings handled correctly (no overselling)
- [ ] Transaction rollback on errors

### Security
- [ ] Password is hashed (not stored plain text)
- [ ] JWT secret is configurable
- [ ] Token expires after configured time
- [ ] Sensitive routes are protected

---

## 🐛 Common Issues

### "Access token required"
- Pastikan menggunakan header: `Authorization: Bearer {TOKEN}`
- Token harus diawali dengan "Bearer "

### "Invalid or expired token"
- Token mungkin sudah expired (check JWT_EXPIRES_IN)
- Token format salah atau corrupt
- JWT_SECRET tidak match

### "Access forbidden: Insufficient permissions"
- User role tidak sesuai (perlu admin role)
- Check role di JWT payload

### Database connection error
- Pastikan database `ticket_platform_jwt` sudah dibuat
- Check credentials di `.env`

---

## 📝 Perbedaan Soal 2 vs Soal 3

| Aspek | Soal 2 (Native) | Soal 3 (Framework + JWT) |
|-------|-----------------|--------------------------|
| **Authentication** | ❌ None | ✅ JWT-based |
| **Authorization** | ❌ None | ✅ Role-based (admin/user) |
| **Port** | 3000 | 3000 |
| **Database** | gdgoc | gdgoc |
| **Middleware** | None | authMiddleware, roleMiddleware |
| **Routes Protection** | Public | Protected with JWT |
| **Booking Access** | All bookings visible | Filtered by user role |
| **Event CRUD** | Public | Admin only |

---

## 🎯 Testing dengan Postman (Optional)

Import collection ini ke Postman:

**Environment Variables:**
- `base_url`: http://localhost:3000
- `user_token`: (akan diisi otomatis setelah login)
- `admin_token`: (akan diisi otomatis setelah register admin)

**Testing Order:**
1. Auth → Register User
2. Auth → Register Admin
3. Auth → Login
4. Events → Create Event (as admin)
5. Events → List Events
6. Bookings → Create Booking (as user)
7. Bookings → List Bookings

---

Selamat mencoba! 🚀
