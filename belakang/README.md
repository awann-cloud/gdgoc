# 🎓 GDGoC UNSRI - Backend Development Assignment
## Submission oleh: Nuredy Rahma Gunawan

---

## 📦 Isi Submission

Assignment ini terdiri dari 3 soal:

### ✅ Soal 1: Pemrograman - "Kode Rahasia GDGoC"
**Lokasi:** `soal1_pemrograman/`

Implementasi algoritma validasi string dengan aturan:
1. Jumlah 'G' harus sama dengan jumlah 'C'
2. Tidak boleh ada substring "DGD"

**Files:**
- `BE_Pemrog_Nuredy_Rahma_Gunawan.py` - Solusi lengkap dengan comments
- `HOW_TO_TEST.md` - Panduan testing dengan 10 test cases

**Complexity:**
- Time: O(n)
- Space: O(1)

**Testing:**
```bash
cd soal1_pemrograman
python BE_Pemrog_Nuredy_Rahma_Gunawan.py
```

---

### ✅ Soal 2: Studi Kasus I - "Native CRUD Implementation"
**Lokasi:** `soal2_studi_kasus/`

Platform tiket event online dengan CRUD lengkap dan anti-overselling mechanism.

**Structure:**
```
program/
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Event.js
│   ├── Booking.js
│   └── index.js
├── controllers/
│   ├── userController.js
│   ├── eventController.js
│   └── bookingController.js
├── routes/
│   ├── userRoutes.js
│   ├── eventRoutes.js
│   └── bookingRoutes.js
├── utils/
│   └── response.js
├── server.js
├── package.json
├── .env.example
├── HOW_TO_TEST.md
└── README.md
```

**Features:**
- ✅ CRUD: Users, Events, Bookings
- ✅ Database relationships (1:N, N:1)
- ✅ Anti-overselling dengan Sequelize transactions
- ✅ Row locking (SELECT FOR UPDATE)
- ✅ MVC Architecture (Models, Controllers, Routes)
- ✅ Clean, modular code structure

**Tech Stack:**
- Node.js + Express.js
- MySQL + Sequelize ORM
- bcryptjs untuk password hashing
- Native implementation (no authentication)

**Testing:**
```bash
cd soal2_studi_kasus/program
npm install
cp .env.example .env
# Edit .env dengan database credentials
npm start
```
Port: **3000**

---

### ✅ Soal 3: Studi Kasus II - "Framework with JWT Authentication"
**Lokasi:** `soal3_studi_kasus_lanjutan/`

Platform tiket event dengan JWT authentication dan role-based authorization.

**Structure:**
```
program/
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Event.js
│   ├── Booking.js
│   └── index.js
├── controllers/
│   ├── authController.js      # 🆕 Register, Login
│   ├── eventController.js
│   └── bookingController.js
├── routes/
│   ├── authRoutes.js          # 🆕 Auth endpoints
│   ├── eventRoutes.js
│   └── bookingRoutes.js
├── middleware/
│   ├── authMiddleware.js      # 🆕 JWT verification
│   └── roleMiddleware.js      # 🆕 Role-based access
├── utils/
│   ├── jwt.js                 # 🆕 Token utilities
│   └── response.js
├── server.js
├── package.json
├── .env.example
├── HOW_TO_TEST.md
└── README.md
```

**Features:**
- ✅ JWT Authentication (Register & Login)
- ✅ Role-Based Authorization (Admin & User)
- ✅ Protected Routes dengan middleware
- ✅ Admin: Full CRUD events, view all bookings
- ✅ User: Create bookings, view only own bookings
- ✅ Anti-overselling dengan transactions
- ✅ MVC + Middleware Architecture

**Tech Stack:**
- Node.js + Express.js
- MySQL + Sequelize ORM
- **jsonwebtoken** untuk JWT
- **bcryptjs** untuk password hashing
- express-validator untuk validation

**Testing:**
```bash
cd soal3_studi_kasus_lanjutan/program
npm install
cp .env.example .env
# Edit .env (gunakan database & port berbeda dari Soal 2)
npm start
```
Port: **3000** (sama dengan Soal 2 - jalankan secara bergantian)

**Key Differences from Soal 2:**
| Aspect | Soal 2 | Soal 3 |
|--------|--------|--------|
| Authentication | ❌ None | ✅ JWT |
| Authorization | ❌ None | ✅ Role-based |
| Middleware | ❌ None | ✅ Auth + Role |
| Event CRUD | Public | Admin only |
| Booking Access | All visible | Role-filtered |
| Port | 3000 | 3000 |
| Database | gdgoc | gdgoc (shared) |
---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v14+)
- **MySQL** (v5.7+)
- **npm** or **yarn**

### Soal 1: Python Algorithm
```bash
cd soal1_pemrograman
python BE_Pemrog_[Nama_Anda].py
# Follow the prompts
```

### Soal 2: Native CRUD (No Auth)
```bash
cd soal2_studi_kasus/program

# 1. Install dependencies
npm install

# 2. Create database (import gdgoc.sql)
mysql -u fullstack -p gdgoc < gdgoc.sql
# Password: Rama1917

# 3. Setup environment
cp .env.example .env
# Database already configured for gdgoc

# 4. Run server
npm start

# Server running at http://localhost:3000
```

### Soal 3: Framework + JWT
```bash
cd soal3_studi_kasus_lanjutan/program

# 1. Install dependencies
npm install

# 2. Create database (shared dengan Soal 2)
mysql -u fullstack -p gdgoc < database_setup.sql
# Password: Rama1917

# 3. Setup environment
cp .env.example .env
# Database already configured for gdgoc

# 4. Run server
npm start

# Server running at http://localhost:3000
```

---

## 📖 Testing Documentation

Setiap soal memiliki panduan testing lengkap:

- **Soal 1**: `soal1_pemrograman/HOW_TO_TEST.md`
  - 10 test cases dengan expected output
  - Manual input dan file input testing
  
- **Soal 2**: `soal2_studi_kasus/program/HOW_TO_TEST.md`
  - cURL commands untuk semua endpoints
  - Anti-overselling testing scenarios
  - Database verification queries
  
- **Soal 3**: `soal3_studi_kasus_lanjutan/program/HOW_TO_TEST.md`
  - JWT authentication flow
  - Role-based access testing
  - Protected routes testing
  - Complete testing matrix

---

## 🏗️ Architecture Overview

### Soal 2 & 3: MVC Pattern
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP Request
┌──────▼──────────────────┐
│      Routes             │  (API Endpoints)
│  - userRoutes.js        │
│  - eventRoutes.js       │
│  - bookingRoutes.js     │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│    Middleware           │  (Soal 3 only)
│  - authMiddleware       │
│  - roleMiddleware       │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│    Controllers          │  (Business Logic)
│  - userController.js    │
│  - eventController.js   │
│  - bookingController.js │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│      Models             │  (Data Layer)
│  - User.js              │
│  - Event.js             │
│  - Booking.js           │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│    MySQL                │  (Database)
│  - Sequelize ORM        │
└─────────────────────────┘
```

---

## 🔑 Key Features Implementation

### Anti-Overselling Mechanism
Menggunakan **Sequelize Transaction + Row Locking**:

```javascript
// bookingController.js
const transaction = await sequelize.transaction();

// Lock event row to prevent concurrent modifications
const event = await Event.findByPk(event_id, {
  lock: transaction.LOCK.UPDATE,  // Row-level lock
  transaction
});

// Check availability
if (event.available_tickets < quantity) {
  await transaction.rollback();
  return error('Insufficient stock');
}

// Atomic update
await event.update({
  available_tickets: event.available_tickets - quantity
}, { transaction });

await Booking.create({...}, { transaction });
await transaction.commit();
```

**Benefits:**
- ✅ Prevents race conditions
- ✅ Atomic operations (all-or-nothing)
- ✅ Handles concurrent requests
- ✅ Auto-rollback on errors

### JWT Authentication (Soal 3)
```javascript
// Register/Login returns JWT token
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: '24h' }
);

// Protected routes use middleware
router.post('/bookings', authenticateToken, createBooking);

// Role-based access
router.post('/events', authenticateToken, requireAdmin, createEvent);
```

### Password Security
```javascript
// Auto-hash on create/update (Model hook)
beforeCreate: async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
}

// Compare password
user.comparePassword(candidatePassword)
```

---

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐           ┌─────────────────┐
│     Users       │           │     Events      │
├─────────────────┤           ├─────────────────┤
│ id (PK)         │           │ id (PK)         │
│ name            │◄─────────┐│ organizer_id    │
│ email (unique)  │         1 │ name            │
│ password (hash) │          ││ description     │
│ role (enum)     │          ││ location        │
└─────────────────┘          ││ event_date      │
        △                    ││ ticket_price    │
        │ 1                  ││ total_tickets   │
        │                    ││ available_tix   │
        │                    │└─────────────────┘
        │                    │         △
        │                    │         │ N
┌───────┴─────────┐          │    ┌────┴────────────┐
│    Bookings     │          │    │                 │
├─────────────────┤          │    │                 │
│ id (PK)         │──────────┘    │                 │
│ user_id (FK)    │ N             │                 │
│ event_id (FK)   │───────────────┘                 │
│ quantity        │                                  │
│ total_price     │          1:N Relations:          │
│ status (enum)   │          - User has many Events  │
└─────────────────┘          - User has many Bookings│
                             - Event has many Bookings│
```

---

## 📖 API Documentation

### Soal 2 Endpoints (No Auth)
```
Users
├── GET    /api/users           List all users
├── GET    /api/users/:id       Get user by ID
├── POST   /api/users           Create user
├── PUT    /api/users/:id       Update user
└── DELETE /api/users/:id       Delete user

Events
├── GET    /api/events          List all events
├── GET    /api/events/:id      Get event by ID
├── POST   /api/events          Create event
├── PUT    /api/events/:id      Update event
└── DELETE /api/events/:id      Delete event

Bookings
├── GET    /api/bookings        List all bookings
├── GET    /api/bookings/:id    Get booking by ID
├── POST   /api/bookings        Create booking (Anti-Overselling)
├── PATCH  /api/bookings/:id/status  Update status
└── DELETE /api/bookings/:id    Delete booking
```

### Soal 3 Endpoints (JWT Required)
```
Auth
├── POST   /api/auth/register   Register new user
├── POST   /api/auth/login      Login user
└── GET    /api/auth/me         Get profile (🔒 Protected)

Events
├── GET    /api/events          List events (Public)
├── GET    /api/events/:id      Get event (Public)
├── POST   /api/events          Create event (🔒 Admin only)
├── PUT    /api/events/:id      Update event (🔒 Admin only)
└── DELETE /api/events/:id      Delete event (🔒 Admin only)

Bookings (All Protected)
├── GET    /api/bookings        List bookings (role-filtered)
├── GET    /api/bookings/:id    Get booking (own or admin)
├── POST   /api/bookings        Create booking
├── PATCH  /api/bookings/:id/status  Update status (own or admin)
└── DELETE /api/bookings/:id    Delete booking (own or admin)
```

---

## 🧪 Testing Examples

### Soal 2: Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-here",
    "event_id": "uuid-here",
    "quantity": 2
  }'
```

### Soal 3: Login & Create Booking
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}' \
  | jq -r '.data.token')

# 2. Create booking with token
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "event_id": "uuid-here",
    "quantity": 2
  }'
```

---

## 📁 Project Structure Summary

```
belakang/
├── soal1_pemrograman/
│   ├── BE_Pemrog_[Nama_Anda].py
│   └── HOW_TO_TEST.md
│
├── soal2_studi_kasus/
│   └── program/
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── utils/
│       ├── server.js
│       ├── package.json
│       ├── .env.example
│       ├── HOW_TO_TEST.md
│       └── README.md
│
├── soal3_studi_kasus_lanjutan/
│   └── program/
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/        # 🆕
│       ├── utils/
│       ├── server.js
│       ├── package.json
│       ├── .env.example
│       ├── HOW_TO_TEST.md
│       └── README.md
│
└── README.md                  # This file
```

---

## 📝 Dokumentasi Lengkap

Setiap soal memiliki dokumentasi lengkap:

### Soal 1
- **File**: `BE_Pemrog_[Nama_Anda].py`
- **Testing Guide**: `HOW_TO_TEST.md`
- **Content**: Algorithm explanation, test cases, usage

### Soal 2
- **README**: API documentation, setup guide
- **HOW_TO_TEST.md**: Complete testing scenarios dengan cURL
- **Code**: Clean MVC structure dengan comments

### Soal 3
- **README**: JWT flow, role-based access, security features
- **HOW_TO_TEST.md**: Authentication testing, protected routes
- **Code**: MVC + Middleware dengan JWT integration

### 2. ERD & Flowchart (Soal 2)
Lihat file: `soal2_studi_kasus/BE_Flowchart_ERD_Nuredy_Rahma_Gunawan.pdf`

### 3. API Documentation (Soal 2 & 3)
Lihat file: `soal2_studi_kasus/program/README.md`

### 4. Testing Guide
Lihat file: `soal2_studi_kasus/program/TESTING_GUIDE.md`

### 5. Submission Guide
Lihat file: `PANDUAN_SUBMISSION.md`

---

## 🎯 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login & get JWT token
- `GET /api/auth/me` - Get current user (Auth)

### Users (CRUD)
- `GET /api/users` - Get all users
---

## ✅ Completion Checklist

### Soal 1: Pemrograman ✅
- [x] Python solution dengan O(n) time complexity
- [x] Comments explaining algorithm
- [x] HOW_TO_TEST.md dengan 10 test cases
- [x] Manual dan file input testing

### Soal 2: Native CRUD ✅
- [x] MVC architecture (Models, Controllers, Routes)
- [x] User, Event, Booking CRUD
- [x] Anti-overselling dengan transactions
- [x] Row locking (SELECT FOR UPDATE)
- [x] Database relationships (1:N, N:1)
- [x] Password hashing (bcrypt)
- [x] Clean, modular code structure
- [x] Complete HOW_TO_TEST.md
- [x] README dengan API documentation

### Soal 3: Framework + JWT ✅
- [x] JWT authentication (Register, Login)
- [x] Role-based authorization (Admin, User)
- [x] Protected routes dengan middleware
- [x] authMiddleware (JWT verification)
- [x] roleMiddleware (Role checking)
- [x] Admin-only event CRUD
- [x] User-filtered bookings
- [x] Complete authentication flow
- [x] Complete HOW_TO_TEST.md
- [x] README dengan security documentation

---

## 🎯 Key Highlights

### Code Quality
- ✅ **Clean Code**: Meaningful variable names, proper comments
- ✅ **Modular**: Separated concerns (MVC + Middleware)
- ✅ **DRY Principle**: No code duplication
- ✅ **Error Handling**: Proper try-catch, error messages
- ✅ **Validation**: Input validation, data sanitization

### Security
- ✅ **Password**: bcrypt hashing (10 salt rounds)
- ✅ **JWT**: Token-based authentication dengan expiry
- ✅ **Authorization**: Role-based access control
- ✅ **SQL Injection**: Protected by Sequelize ORM
- ✅ **Environment**: Secrets in .env file

### Performance
- ✅ **Anti-Overselling**: Transaction + row locking
- ✅ **Database**: Indexed foreign keys
- ✅ **Connection Pool**: Configurable pool size
- ✅ **Atomic Operations**: All-or-nothing updates

### Documentation
- ✅ **README**: Complete setup & API docs
- ✅ **HOW_TO_TEST**: Testing guides dengan examples
- ✅ **Code Comments**: Explaining complex logic
- ✅ **API Examples**: cURL commands for all endpoints

---

## 🛠️ Tech Stack Summary

| Component | Soal 1 | Soal 2 | Soal 3 |
|-----------|--------|--------|--------|
| **Language** | Python 3.x | JavaScript (Node.js) | JavaScript (Node.js) |
| **Framework** | - | Express.js | Express.js |
| **Database** | - | MySQL (gdgoc) | MySQL (gdgoc) |
| **ORM** | - | Sequelize | Sequelize |
| **Auth** | - | - | JWT (jsonwebtoken) |
| **Password** | - | bcryptjs | bcryptjs |
| **Validation** | - | express-validator | express-validator |
| **Architecture** | Algorithm | MVC | MVC + Middleware |

---

## 📞 Troubleshooting

### Common Issues

#### Database Connection Failed
```
Error: connect ECONNREFUSED ::1:3306
```
**Solution:**
- Check MySQL is running
- Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in .env
- Check database exists: `mysql -u fullstack -p -e "SHOW DATABASES;"`

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
- Change PORT in .env
- Or kill process: `netstat -ano | findstr :3000` (Windows)

#### JWT Token Invalid
```
Error: Invalid or expired token
```
**Solution:**
- Check Authorization header format: `Bearer {token}`
- Token might be expired (check JWT_EXPIRES_IN)
- Verify JWT_SECRET matches

#### Anti-Overselling Not Working
```
Multiple bookings succeed for last ticket
```
**Solution:**
- Ensure using transactions correctly
- Check `lock: transaction.LOCK.UPDATE` is set
- Test with concurrent requests (multiple terminals)

---

## 🚀 Future Improvements

### Potential Enhancements
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] API documentation dengan Swagger/OpenAPI
- [ ] Unit & Integration tests (Jest/Mocha)
- [ ] Rate limiting (express-rate-limit)
- [ ] Logging (Winston, Morgan)
- [ ] Caching (Redis)
- [ ] File upload (multer) untuk event images
- [ ] Email notifications (nodemailer)
- [ ] Payment integration (Midtrans, Stripe)

---

## 👨‍💻 Developer Notes

### Development Best Practices Used
1. **Separation of Concerns**: Models, Controllers, Routes terpisah
2. **Environment Variables**: Sensitive data di .env
3. **Error Handling**: Try-catch di semua async operations
4. **Validation**: Input validation sebelum database operations
5. **Security**: Password hashing, JWT expiry, role-based access
6. **Database**: Transactions untuk atomic operations
7. **Code Style**: Consistent naming, proper indentation
8. **Documentation**: README, HOW_TO_TEST, code comments

### Time Complexity Analysis
**Soal 1: Kode Rahasia GDGoC**
- Time: O(n) - single pass through string
- Space: O(1) - constant variables (counter_g, counter_c)

---

## 📄 License

ISC License

---

## 🎓 About This Project

This is a backend development assignment submission for **Google Developer Groups on Campus (GDGoC) UNSRI**.

**Submitted by:** Nuredy Rahma Gunawan  
**Date:** 28 December 2025  
**Program:** Backend Development Track  
**University:** Universitas Sriwijaya

---

## 🙏 Acknowledgments

- GDGoC UNSRI Team untuk assignment yang menantang
- MySQL & Sequelize documentation
- Express.js & Node.js community
- JWT.io untuk JWT resources

---

**📬 Contact:** nuredy.rahma@example.com  
**🔗 GitHub:** github.com/nuredy

---

**⭐ Terima kasih telah mereview submission ini! ⭐**

---

## 📂 Project Structure

```
BE_SubmissionMember_Nuredy_Rahma_Gunawan/
│
├── README.md                         ← File ini
├── PANDUAN_SUBMISSION.md             ← Panduan finalisasi
├── repository_link.txt               ← Link GitHub repository
│
├── soal1_pemrograman/
│   └── BE_Pemrog_Nuredy_Rahma_Gunawan.py
│
├── soal2_studi_kasus/
│   ├── BE_Flowchart_ERD_Nuredy_Rahma_Gunawan.pdf
│   └── program/
│       ├── server.js
│       ├── package.json
│       ├── .env.example
│       ├── .gitignore
│       ├── README.md
│       └── TESTING_GUIDE.md
│
└── soal3_studi_kasus_lanjutan/
    └── README.md
```

---

## 💡 Highlights

### Soal 1: Pemrograman
- ✨ Clean & efficient algorithm
- ✨ Proper comments & documentation
- ✨ O(n) time complexity

### Soal 2: Native Implementation
- ✨ Complete CRUD operations
- ✨ Proper database relationships
- ✨ ERD & Flowchart documentation
- ✨ Anti-overselling mechanism

### Soal 3: Framework + Security
- ✨ JWT authentication
- ✨ Role-based authorization
- ✨ Password hashing
- ✨ Input validation
- ✨ Transaction management
- ✨ Complete API documentation

### Bonus Features
- ✨ All-in-one architecture (easy to review)
- ✨ Comprehensive documentation
- ✨ Testing guide included
- ✨ Clean code with comments
- ✨ Error handling
- ✨ Environment variables
- ✨ Git-ready (.gitignore)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Runtime | Node.js v14+ |
| Framework | Express.js |
| Database | MySQL |
| ORM | Sequelize |
| Authentication | JWT (jsonwebtoken) |
| Password | bcrypt |
| Validation | express-validator |
| Environment | dotenv |
| Language | JavaScript (ES6+) |
| Python | Python 3.x (Soal 1) |

---

## 📊 Database Schema

### Users Table
- id (UUID, PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- role (ENUM: user, admin)
- timestamps

### Events Table
- id (UUID, PK)
- organizer_id (UUID, FK → users.id)
- name (VARCHAR)
- description (TEXT)
- location (VARCHAR)
- event_date (TIMESTAMP)
- ticket_price (DECIMAL)
- total_tickets (INTEGER)
- available_tickets (INTEGER)
- timestamps

### Bookings Table
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- event_id (UUID, FK → events.id)
- quantity (INTEGER)
- total_price (DECIMAL)
- status (ENUM: pending, confirmed, cancelled)
- booking_date (TIMESTAMP)
- timestamps

---

## 🎓 Learning Outcomes

Dari assignment ini, saya telah mempelajari:

1. **Algorithm Design**
   - String manipulation
   - Time & space complexity analysis

2. **Backend Development**
   - RESTful API design
   - CRUD operations
   - Database relationships

3. **Security**
   - Authentication dengan JWT
   - Authorization dengan role-based access
   - Password hashing
   - Input validation

4. **Database**
   - Relational database design
   - ORM usage (Sequelize)
   - Transactions
   - Row-level locking

5. **Best Practices**
   - Clean code
   - Error handling
   - Documentation
   - Git workflow

---

## 🐛 Known Issues & Future Improvements

### Current Limitations
- No pagination on list endpoints
- No search/filter functionality
- No file upload for event images
- No email notification system

### Future Improvements
1. Add pagination & sorting
2. Implement search & filter
3. Add event categories
4. Add payment integration
5. Add email notifications
6. Add unit & integration tests
7. Add Docker support
8. Add CI/CD pipeline

---

## 📞 Contact

**Author:** Nuredy Rahma Gunawan  
**Email:** nuredy.rahma@example.com  
**GitHub:** github.com/nuredy  
**Institution:** GDGoC UNSRI  
**Division:** Backend Development

---

## 📄 License

This project is for educational purposes (GDGoC UNSRI Backend Assignment).

---

## 🙏 Acknowledgments

- GDGoC UNSRI Team untuk assignment yang challenging
- Node.js & Express.js community
- Sequelize documentation
- MySQL documentation
- Stack Overflow untuk troubleshooting

---

## ⏰ Submission Info

**Deadline:** Minggu, 28 Desember 2025 pukul 23.59 WIB  
**Format:** `BE_SubmissionMember_Nuredy_Rahma_Gunawan.ZIP`  
**GitHub Repository:** [Paste URL di repository_link.txt]

---

## ✅ Final Checklist

```
[ ] Semua [Nama Anda] sudah diganti
[ ] Python file sudah di-test
[ ] ERD & Flowchart sudah diconvert ke PDF/PNG
[ ] Watermark nama sudah ditambahkan
[ ] Aplikasi berhasil di-run
[ ] Database setup working
[ ] Semua endpoint berhasil di-test
[ ] GitHub repository sudah dibuat
[ ] README.md terlihat bagus di GitHub
[ ] repository_link.txt sudah diisi
[ ] ZIP file sudah dibuat
[ ] Ready to submit!
```

---

**🚀 Happy Coding & Good Luck!**

---

_Generated with ❤️ for GDGoC UNSRI Backend Development Assignment_
