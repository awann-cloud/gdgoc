# 📊 ERD & Flowchart - Platform Tiket Event Online
## Author: Nuredy Rahma Gunawan
## Database: MySQL (gdgoc)

---

## 🗄️ Entity Relationship Diagram (ERD)

### Database Schema

```
┌─────────────────────────────────────┐
│            USER (users)             │
├─────────────────────────────────────┤
│ PK │ id (CHAR(36) - UUID)           │
│    │ name (VARCHAR(255))            │
│    │ email (VARCHAR(255) UNIQUE)    │
│    │ password (VARCHAR(255) hashed) │
│    │ role (ENUM: 'user', 'admin')   │
│    │ createdAt (DATETIME)           │
│    │ updatedAt (DATETIME)           │
└─────────────────────────────────────┘
                │
                │ 1:N (as organizer)
                │
                ▼
┌─────────────────────────────────────┐
│           EVENT (events)            │
├─────────────────────────────────────┤
│ PK │ id (CHAR(36) - UUID)           │
│ FK │ organizer_id (CHAR(36))        │
│    │   → users.id (CASCADE)         │
│    │ name (VARCHAR(255))            │
│    │ description (TEXT)             │
│    │ location (VARCHAR(255))        │
│    │ event_date (DATETIME)          │
│    │ ticket_price (DECIMAL(10,2))   │
│    │ total_tickets (INT)            │
│    │ available_tickets (INT)        │
│    │ createdAt (DATETIME)           │
│    │ updatedAt (DATETIME)           │
└─────────────────────────────────────┘
                │
                │ 1:N
                │
                ▼
┌─────────────────────────────────────┐
│         BOOKING (bookings)          │
├─────────────────────────────────────┤
│ PK │ id (CHAR(36) - UUID)           │
│ FK │ user_id (CHAR(36)) → users.id  │
│ FK │ event_id (CHAR(36)) → events.id│
│    │ quantity (INT CHECK >= 1)      │
│    │ total_price (DECIMAL(10,2))    │
│    │ status (ENUM: 'pending',       │
│    │    'confirmed', 'cancelled')   │
│    │ booking_date (DATETIME)        │
│    │ createdAt (DATETIME)           │
│    │ updatedAt (DATETIME)           │
└─────────────────────────────────────┘
                ▲
                │
                │ N:1 (as customer)
                │
        ┌───────┴────────┐
        │  USER (users)  │
        └────────────────┘
```

### Relationships Detail

1. **User → Event (1:N as organizer)**
   - Satu User (admin) dapat membuat banyak Event
   - Field: `events.organizer_id` → `users.id`

2. **User → Booking (1:N as customer)**
   - Satu User dapat memiliki banyak Booking
   - Field: `bookings.user_id` → `users.id`

3. **Event → Booking (1:N)**
   - Satu Event dapat memiliki banyak Booking
   - Field: `bookings.event_id` → `events.id`

### Constraints & Validations

- **users.email**: UNIQUE constraint
- **events.ticket_price**: CHECK (ticket_price >= 0)
- **events.total_tickets**: CHECK (total_tickets >= 0)
- **events.available_tickets**: CHECK (available_tickets >= 0 AND available_tickets <= total_tickets)
- **bookings.quantity**: CHECK (quantity > 0)
- **bookings.total_price**: CHECK (total_price >= 0)

---

## 🔄 Flowchart: Proses Pemesanan Tiket (Booking)

### Anti-Overselling Mechanism

```
                    ┌─────────────────────┐
                    │       START         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  User Request:      │
                    │  POST /api/bookings │
                    │  {user_id,          │
                    │   event_id,         │
                    │   quantity}         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Validasi Input     │
                    │  - user_id valid?   │
                    │  - event_id valid?  │
                    │  - quantity > 0?    │
                    └──────────┬──────────┘
                               │
                        ┌──────┴──────┐
                        │             │
                   INVALID         VALID
                        │             │
                        ▼             ▼
              ┌─────────────┐  ┌──────────────────┐
              │ Return 400  │  │ BEGIN            │
              │ Bad Request │  │ TRANSACTION      │
              └─────────────┘  └────────┬─────────┘
                                                                 │
                                                                 ▼
                                                      ┌──────────────────────┐
                                                      │ LOCK Event Row       │
                                                      │ SELECT ... FOR UPDATE│
                                                      │ (Prevent race        │
                                                      │  condition)          │
                                                      └──────────┬───────────┘
                                                                 │
                                                                 ▼
                                                      ┌──────────────────────┐
                                                      │ Get Event by ID      │
                                                      └──────────┬───────────┘
                                                                 │
                                                        ┌────────┴────────┐
                                                        │                 │
                                                  NOT FOUND            FOUND
                                                        │                 │
                                                        ▼                 ▼
                                              ┌─────────────────┐  ┌──────────────────────┐
                                              │ ROLLBACK        │  │ Check Stock:         │
                                              │ Return 404      │  │ available_tickets    │
                                              │ Event Not Found │  │ >= quantity?         │
                                              └─────────────────┘  └──────────┬───────────┘
                                                                               │
                                                                      ┌────────┴────────┐
                                                                      │                 │
                                                                 INSUFFICIENT       SUFFICIENT
                                                                      │                 │
                                                                      ▼                 ▼
                                                            ┌─────────────────┐  ┌──────────────────────┐
                                                            │ ROLLBACK        │  │ Calculate:           │
                                                            │ Return 400      │  │ total_price =        │
                                                            │ "Stok tiket     │  │ ticket_price *       │
                                                            │  tidak cukup"   │  │ quantity             │
                                                            │ {available: X,  │  └──────────┬───────────┘
                                                            │  requested: Y}  │             │
                                                            └─────────────────┘             ▼
                                                                              ┌──────────────────────┐
                                                                              │ Update Event:        │
                                                                              │ available_tickets -= │
                                                                              │ quantity             │
                                                                              └──────────┬───────────┘
                                                                                         │
                                                                                         ▼
                                                                              ┌──────────────────────┐
                                                                              │ Create Booking:      │
                                                                              │ - user_id            │
                                                                              │ - event_id           │
                                                                              │ - quantity           │
                                                                              │ - total_price        │
                                                                              │ - status: confirmed  │
                                                                              └──────────┬───────────┘
                                                                                         │
                                                                                         ▼
                                                                              ┌──────────────────────┐
                                                                              │ COMMIT TRANSACTION   │
                                                                              │ (All changes saved   │
                                                                              │  atomically)         │
                                                                              └──────────┬───────────┘
                                                                                         │
                                                                                         ▼
                                                                              ┌──────────────────────┐
                                                                              │ Return 201 Success   │
                                                                              │ {booking_data}       │
                                                                              └──────────┬───────────┘
                                                                                         │
                                                                                         ▼
                                                                              ┌──────────────────────┐
                                                                              │        END           │
                                                                              └──────────────────────┘
```

### Penjelasan Mekanisme Anti-Overselling

1. **Database Transaction**
   - Semua operasi (read, update, insert) dilakukan dalam satu transaksi
   - Jika ada error, semua perubahan di-rollback
   - Jika sukses, semua perubahan di-commit secara atomik

2. **Row-Level Locking (SELECT FOR UPDATE)**
   - Ketika Event row dibaca, langsung di-lock
   - User lain yang mencoba booking event yang sama harus menunggu
   - Lock dilepas setelah COMMIT atau ROLLBACK

3. **Race Condition Prevention**
   ```
   Scenario: Event memiliki 1 tiket tersisa
   
   User A:
   - BEGIN TRANSACTION
   - LOCK Event row (FOR UPDATE) ✅
   - Cek stok: 1 ticket available ✅
   - Update: available_tickets = 0
   - Create booking
   - COMMIT ✅
   
   User B (concurrent request):
   - BEGIN TRANSACTION
   - Wait... (Event row masih di-lock oleh User A)
   - LOCK Event row (setelah User A commit) ✅
   - Cek stok: 0 ticket available ❌
   - ROLLBACK
   - Return Error: "Stok tiket tidak cukup"
   ```

4. **Validation Sequence**
   - Authentication check (JWT token)
   - Input validation (event_id, quantity)
   - Stock availability check (inside transaction)
   - Business logic execution (update + create)

---

## 📈 Flowchart: Create Event

```
              ┌─────────────────────┐
              │       START         │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  User Request:      │
              │  POST /api/events   │
              │  + Event Data       │
              │  (organizer_id,     │
              │   name, location,   │
              │   date, price, etc) │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Validate Input:     │
              │ - organizer_id exist│
              │ - name present      │
              │ - location valid    │
              │ - date format OK    │
              │ - price >= 0        │
              │ - total_tickets > 0 │
              └──────────┬──────────┘
                         │
                  ┌──────┴──────┐
                  │             │
              INVALID        VALID
                  │             │
                  ▼             ▼
        ┌─────────────────┐  ┌──────────────────┐
        │  Return 400     │  │ Verify User:     │
        │  Validation Err │  │ organizer_id     │
        └─────────────────┘  │ exists in DB?    │
                             └────────┬─────────┘
                                      │
                              ┌───────┴────────┐
                              │                │
                          NOT FOUND          FOUND
                              │                │
                              ▼                ▼
                    ┌─────────────────┐  ┌──────────────────┐
                    │  Return 404     │  │ Create Event:    │
                    │  User Not Found │  │ - Set all fields │
                    └─────────────────┘  │ - available_tix =│
                                         │   total_tickets  │
                                         └────────┬─────────┘
                                                  │
                                                  ▼
                                        ┌──────────────────┐
                                        │ Return 201       │
                                        │ Event Created    │
                                        └────────┬─────────┘
                                                 │
                                                 ▼
                                        ┌──────────────────┐
                                        │       END        │
                                        └──────────────────┘
```

---

## 💡 Key Technical Decisions

### 1. UUID vs Auto-Increment ID
- **Chosen:** UUID
- **Reason:** 
  - Better for distributed systems
  - No sequential pattern exposure
  - Globally unique without coordination

### 2. Password Hashing
- **Algorithm:** bcrypt
- **Salt Rounds:** 10
- **Reason:** Industry standard, resistant to rainbow table attacks

### 3. Transaction Isolation Level
- **Level:** READ COMMITTED (Sequelize default)
- **Additional:** Row-level locking with `SELECT FOR UPDATE`

### 4. Timestamp Management
- **Fields:** created_at, updated_at
- **Automatic:** Managed by Sequelize

---

## 📊 Performance Considerations

### Database Indexes
Recommended indexes for optimal query performance:

```sql
-- Users table (indexes included in gdgoc.sql)
CREATE INDEX idx_email ON users(email);

-- Events table (indexes included in gdgoc.sql)
CREATE INDEX idx_organizer ON events(organizer_id);
CREATE INDEX idx_event_date ON events(event_date);

-- Bookings table (indexes included in gdgoc.sql)
CREATE INDEX idx_user ON bookings(user_id);
CREATE INDEX idx_event ON bookings(event_id);
CREATE INDEX idx_status ON bookings(status);
```

### Query Optimization
- Use eager loading untuk relasi (include)
- Pagination untuk list endpoints
- Limit fields dengan `attributes` parameter

---

## 🔄 Booking Cancellation Flow

```
              ┌─────────────────────┐
              │  Cancel Booking     │
              │  PATCH /bookings/   │
              │  :id/status         │
              │  {status:cancelled} │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  BEGIN TRANSACTION  │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Find Booking       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Check: status !=   │
              │  'cancelled'?       │
              └──────────┬──────────┘
                         │
                  ┌──────┴──────┐
                  │             │
          ALREADY CANCELLED   NOT CANCELLED
                  │             │
                  ▼             ▼
        ┌─────────────┐  ┌─────────────────┐
        │ Skip return │  │ LOCK Event row  │
        │ of tickets  │  │ (FOR UPDATE)    │
        └──────┬──────┘  └────────┬────────┘
               │                  │
               │                  ▼
               │         ┌─────────────────┐
               │         │ Update Event:   │
               │         │ available_tix +=│
               │         │ booking.quantity│
               │         └────────┬────────┘
               │                  │
               └──────────┬───────┘
                          │
                          ▼
                ┌─────────────────────┐
                │  Update Booking:    │
                │  status = cancelled │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │  COMMIT TRANSACTION │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │  Return 200 Success │
                └─────────────────────┘
```

---

**Note:** Diagram ini dapat di-convert ke format visual menggunakan tools seperti:
- draw.io / diagrams.net (import Mermaid)
- dbdiagram.io (untuk ERD)
- Lucidchart
- PlantUML

Jangan lupa tambahkan **watermark nama Anda** pada diagram visual!
