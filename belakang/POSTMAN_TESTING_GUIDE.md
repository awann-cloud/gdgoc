# Postman Testing Guide - GDGoC Backend

**Author**: Nuredy Rahma Gunawan  
**Database**: MySQL (gdgoc)  
**Date**: December 28, 2025

---

## Prerequisites

1. **Install Postman**: Download dari [postman.com](https://www.postman.com/downloads/)
2. **MySQL Running**: Pastikan MySQL server berjalan
3. **Database Setup**: Import `gdgoc.sql` ke MySQL
4. **Install Dependencies**: 
   ```bash
   cd soal2_studi_kasus/program
   npm install
   
   cd soal3_studi_kasus_lanjutan/program
   npm install
   ```

---

## SOAL 2 - Anti-Overselling System

### Start Server

```bash
cd soal2_studi_kasus/program
node server.js
```

Server akan berjalan di: `http://localhost:3000`

### Test Scenarios

#### 1. Create User

**Method**: `POST`  
**URL**: `http://localhost:3000/api/users`  
**Body** (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "uuid-string"
  }
}
```

---

#### 2. Create Event (with Admin/Any User)

**Method**: `POST`  
**URL**: `http://localhost:3000/api/events`  
**Body** (JSON):
```json
{
  "name": "GDGoC Tech Conference 2025",
  "date": "2025-12-31",
  "location": "Jakarta Convention Center",
  "available_tickets": 5
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "eventId": "uuid-string"
  }
}
```

**NOTE**: Simpan `eventId` untuk testing booking!

---

#### 3. Test Normal Booking (Success)

**Method**: `POST`  
**URL**: `http://localhost:3000/api/bookings`  
**Body** (JSON):
```json
{
  "user_id": "uuid-dari-step-1",
  "event_id": "uuid-dari-step-2",
  "quantity": 3
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "bookingId": "uuid-string",
    "remaining_tickets": 2
  }
}
```

---

#### 4. Test Anti-Overselling (Should Fail)

**Method**: `POST`  
**URL**: `http://localhost:3000/api/bookings`  
**Body** (JSON):
```json
{
  "user_id": "uuid-dari-step-1",
  "event_id": "uuid-dari-step-2",
  "quantity": 10
}
```

**Expected Response** (400):
```json
{
  "success": false,
  "message": "Not enough tickets available"
}
```

**✅ PASS**: Anti-overselling bekerja dengan benar!

---

#### 5. Verify Event Tickets Updated

**Method**: `GET`  
**URL**: `http://localhost:3000/api/events/{event_id}`

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Event retrieved successfully",
  "data": {
    "id": "uuid-string",
    "name": "GDGoC Tech Conference 2025",
    "date": "2025-12-31",
    "location": "Jakarta Convention Center",
    "available_tickets": 2,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## SOAL 3 - JWT Authentication System

### Start Server

```bash
cd soal3_studi_kasus_lanjutan/program
node server.js
```

Server akan berjalan di: `http://localhost:3000`

**IMPORTANT**: Soal 2 dan Soal 3 menggunakan port yang sama. **Matikan server Soal 2** sebelum menjalankan Soal 3!

---

### Test Scenarios

#### 1. Register User

**Method**: `POST`  
**URL**: `http://localhost:3000/api/auth/register`  
**Body** (JSON):
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "securepass123",
  "role": "user"
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "user",
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**✅ COPY TOKEN** untuk test berikutnya!

**PENTING**: Copy token lengkap dari `data.token` (bukan hanya sebagian). Token biasanya 150+ karakter. Contoh token lengkap:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1LTY3ODkwLWFiY2RlIiwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM1MzcyMDAwLCJleHAiOjE3MzU0NTg0MDB9.Xk7N9mP2Qr5sT8vW1yZ3aB4cD6eF7gH9iJ0kL2mN4o
```

---

#### 2. Login User

**Method**: `POST`  
**URL**: `http://localhost:3000/api/auth/login`  
**Body** (JSON):
```json
{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-string",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 3. Get User Profile (Protected Route)

**Method**: `GET`  
**URL**: `http://localhost:3000/api/auth/me`  
**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ CARA SET HEADER DI POSTMAN**:
1. Tab **Headers**
2. Key: `Authorization`
3. Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI...` (paste token lengkap setelah "Bearer ")
4. Pastikan ada **spasi** setelah kata "Bearer"

**Expected Response** (200):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid-string",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**✅ JWT Authentication Working!**

---

#### 4. Test Without Token (Should Fail)

**Method**: `GET`  
**URL**: `http://localhost:3000/api/auth/me`  
**Headers**: *(No Authorization header)*

**Expected Response** (401):
```json
{
  "success": false,
  "message": "Access token required"
}
```

---

#### 5. Register Admin User

**Method**: `POST`  
**URL**: `http://localhost:3000/api/auth/register`  
**Body** (JSON):
```json
{
  "name": "Admin User",
  "email": "admin@gdgoc.com",
  "password": "adminpass123",
  "role": "admin"
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "name": "Admin User",
      "email": "admin@gdgoc.com",
      "role": "admin",
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**✅ COPY ADMIN TOKEN**

---

#### 6. Admin Create Event (with JWT)

**Method**: `POST`  
**URL**: `http://localhost:3000/api/events`  
**Headers**:
```
Authorization: Bearer {admin-token-dari-step-5}
Content-Type: application/json
```
**Body** (JSON):
```json
{
  "name": "GDGoC Workshop 2025",
  "date": "2025-12-30",
  "location": "Online Zoom",
  "available_tickets": 100
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "eventId": "uuid-string"
  }
}
```

**NOTE**: Jika endpoint ini memerlukan role admin, pastikan middleware `requireRole('admin')` aktif!

---

#### 7. User Create Booking (with JWT)

**Method**: `POST`  
**URL**: `http://localhost:3000/api/bookings`  
**Headers**:
```
Authorization: Bearer {user-token-dari-step-1}
Content-Type: application/json
```
**Body** (JSON):
```json
{
  "event_id": "uuid-dari-step-6",
  "quantity": 5
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "bookingId": "uuid-string",
    "remaining_tickets": 95
  }
}
```

---

## Testing Checklist

### Soal 2 - Anti-Overselling
- [ ] Create user berhasil
- [ ] Create event berhasil
- [ ] Booking normal berhasil (tiket cukup)
- [ ] Booking overselling **GAGAL** dengan error message
- [ ] Tiket event terupdate dengan benar
- [ ] Transaction rollback saat error (cek database)

### Soal 3 - JWT Authentication
- [ ] Register user berhasil + dapat token
- [ ] Login user berhasil + dapat token
- [ ] Access protected route dengan token berhasil
- [ ] Access protected route tanpa token **GAGAL 401**
- [ ] Register admin berhasil
- [ ] Admin dapat create event (jika ada role check)
- [ ] User dapat create booking dengan JWT

---

## Postman Collection Export (Optional)

### Cara Import Collection:

1. Buka Postman
2. Klik **Import** (top left)
3. Pilih **Raw Text**
4. Paste JSON collection di bawah
5. Klik **Import**

### Soal 2 Collection

```json
{
  "info": {
    "name": "GDGoC Soal 2 - Anti-Overselling",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create User",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {"raw": "http://localhost:3000/api/users", "host": ["localhost:3000"], "path": ["api", "users"]}
      }
    },
    {
      "name": "Create Event",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"GDGoC Tech Conference 2025\",\n  \"date\": \"2025-12-31\",\n  \"location\": \"Jakarta Convention Center\",\n  \"available_tickets\": 5\n}"
        },
        "url": {"raw": "http://localhost:3000/api/events", "host": ["localhost:3000"], "path": ["api", "events"]}
      }
    },
    {
      "name": "Create Booking (Success)",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"user_id\": \"{{userId}}\",\n  \"event_id\": \"{{eventId}}\",\n  \"quantity\": 3\n}"
        },
        "url": {"raw": "http://localhost:3000/api/bookings", "host": ["localhost:3000"], "path": ["api", "bookings"]}
      }
    },
    {
      "name": "Create Booking (Overselling)",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"user_id\": \"{{userId}}\",\n  \"event_id\": \"{{eventId}}\",\n  \"quantity\": 10\n}"
        },
        "url": {"raw": "http://localhost:3000/api/bookings", "host": ["localhost:3000"], "path": ["api", "bookings"]}
      }
    },
    {
      "name": "Get Event Details",
      "request": {
        "method": "GET",
        "url": {"raw": "http://localhost:3000/api/events/{{eventId}}", "host": ["localhost:3000"], "path": ["api", "events", "{{eventId}}"]}
      }
    }
  ]
}
```

### Soal 3 Collection

```json
{
  "info": {
    "name": "GDGoC Soal 3 - JWT Authentication",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Alice Johnson\",\n  \"email\": \"alice@example.com\",\n  \"password\": \"securepass123\",\n  \"role\": \"user\"\n}"
        },
        "url": {"raw": "http://localhost:3000/api/auth/register", "host": ["localhost:3000"], "path": ["api", "auth", "register"]}
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"alice@example.com\",\n  \"password\": \"securepass123\"\n}"
        },
        "url": {"raw": "http://localhost:3000/api/auth/login", "host": ["localhost:3000"], "path": ["api", "auth", "login"]}
      }
    },
    {
      "name": "Get Profile (Protected)",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": {"raw": "http://localhost:3000/api/auth/me", "host": ["localhost:3000"], "path": ["api", "auth", "me"]}
      }
    },
    {
      "name": "Get Profile (No Token)",
      "request": {
        "method": "GET",
        "url": {"raw": "http://localhost:3000/api/auth/me", "host": ["localhost:3000"], "path": ["api", "auth", "me"]}
      }
    },
    {
      "name": "Register Admin",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Admin User\",\n  \"email\": \"admin@gdgoc.com\",\n  \"password\": \"adminpass123\",\n  \"role\": \"admin\"\n}"
        },
        "url": {"raw": "http://localhost:3000/api/auth/register", "host": ["localhost:3000"], "path": ["api", "auth", "register"]}
      }
    },
    {
      "name": "Admin Create Event",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{adminToken}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"GDGoC Workshop 2025\",\n  \"date\": \"2025-12-30\",\n  \"location\": \"Online Zoom\",\n  \"available_tickets\": 100\n}"
        },
        "url": {"raw": "http://localhost:3000/api/events", "host": ["localhost:3000"], "path": ["api", "events"]}
      }
    },
    {
      "name": "User Create Booking",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"event_id\": \"{{eventId}}\",\n  \"quantity\": 5\n}"
        },
        "url": {"raw": "http://localhost:3000/api/bookings", "host": ["localhost:3000"], "path": ["api", "bookings"]}
      }
    }
  ]
}
```

---

## Tips Postman

1. **Environment Variables**: Buat environment baru dan set variable:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (auto-fill dari response register/login)
   - `adminToken`: (auto-fill dari response admin register)
   - `userId`: (auto-fill dari response create user)
   - `eventId`: (auto-fill dari response create event)

2. **Auto-Save Token**: Di tab **Tests** setiap request register/login, tambahkan:
   ```javascript
   if (pm.response.code === 200 || pm.response.code === 201) {
       const jsonData = pm.response.json();
       if (jsonData.token) {
           pm.environment.set("token", jsonData.token);
       }
       if (jsonData.userId) {
           pm.environment.set("userId", jsonData.userId);
       }
   }
   ```

3. **Test Scripts**: Di tab **Tests**, tambahkan assertion:
   ```javascript
   pm.test("Status code is 201", function () {
       pm.response.to.have.status(201);
   });
   
   pm.test("Response has token", function () {
       const jsonData = pm.response.json();
       pm.expect(jsonData.token).to.exist;
   });
   ```

---

## Troubleshooting

### "Invalid or expired token" Error

Jika kamu mendapat response:
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Penyebab & Solusi**:

1. **Token tidak di-copy lengkap**
   - Copy seluruh token dari response register/login
   - Token biasanya sangat panjang (100+ karakter)
   - Jangan copy hanya sebagian

2. **Format Authorization header salah**
   - ✅ Benar: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ❌ Salah: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (tanpa "Bearer ")
   - ❌ Salah: `bearer eyJhbG...` (huruf kecil)
   - Harus ada spasi setelah "Bearer"

3. **Token expired (sudah lewat 24 jam)**
   - Register/login ulang untuk dapat token baru
   - Token valid selama 24 jam (configurable di `.env`)

4. **Server restart dengan JWT_SECRET berbeda**
   - Token yang di-generate sebelum restart tidak valid
   - Check `.env` file, pastikan JWT_SECRET konsisten
   - Register/login ulang setelah restart server

5. **Environment mismatch (test Soal 2 token di Soal 3)**
   - Soal 2 tidak pakai JWT
   - Soal 3 yang pakai JWT authentication
   - Pastikan test di server yang benar

**Cara Test yang Benar**:
1. Start server Soal 3: `node server.js`
2. Register user → Copy token dari response `data.token`
3. Paste token ke Authorization header: `Bearer <paste-token-di-sini>`
4. Test endpoint protected `/api/auth/me`

---

### Server tidak bisa start
- Check apakah MySQL running: `mysql -u fullstack -p`
- Check port conflict: `netstat -ano | findstr :3000`
- Kill process: `taskkill /F /PID <pid>`

### Database error
- Import ulang `gdgoc.sql`
- Check credentials di `.env`

### JWT token invalid
- Check JWT_SECRET di `.env` Soal 3
- Token expired? Register/login ulang

### Anti-overselling tidak bekerja
- Check database isolation level
- Pastikan transaction menggunakan `LOCK.UPDATE`

---

**Happy Testing! 🚀**

*Guide ini dibuat untuk GDGoC Backend Development Assignment*
