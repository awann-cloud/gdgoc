-- ============================================
-- MYSQL SETUP - SOAL 3 (JWT Authentication)
-- Database: gdgoc (shared dengan Soal 2)
-- Port: 3000
-- ============================================

-- Step 1: Drop database jika sudah ada (optional, hati-hati!)
DROP DATABASE IF EXISTS gdgoc;

-- Step 2: Buat database baru
CREATE DATABASE gdgoc 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Step 3: Gunakan database
USE gdgoc;

-- Step 4: Buat tabel users
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 5: Buat tabel events
CREATE TABLE events (
    id CHAR(36) PRIMARY KEY,
    organizer_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    total_tickets INT NOT NULL,
    available_tickets INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_organizer (organizer_id),
    INDEX idx_event_date (event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 6: Buat tabel bookings
CREATE TABLE bookings (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    event_id CHAR(36) NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 1),
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_event (event_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VERIFIKASI
-- ============================================
SHOW TABLES;

-- Cek struktur tabel
DESC users;
DESC events;
DESC bookings;

-- ============================================
-- SUCCESS! Database siap digunakan
-- Jalankan server dengan: npm start
-- Server akan berjalan di: http://localhost:3000
-- ============================================
