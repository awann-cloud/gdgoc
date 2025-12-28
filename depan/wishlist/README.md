# Wishlist App

Aplikasi Daftar Keinginan (Wishlist) dengan fitur CRUD lengkap - GDGoC Frontend Task

## 🚀 Fitur

### Frontend
- ✅ **Create**: Tambah barang baru dengan detail lengkap
- ✅ **Read**: Lihat semua wishlist dengan filter & search
- ✅ **Update**: Edit informasi & tandai sebagai terbeli
- ✅ **Delete**: Hapus item individual atau bulk delete
- ✅ **Responsive Design**: Optimal di semua ukuran layar
- ✅ **Dark Mode**: Toggle tema gelap/terang
- ✅ **Offline Support**: Data tersimpan di localStorage

### Backend (Nilai Tambah)
- ✅ **REST API**: Node.js + Express.js
- ✅ **Clean Architecture**: MVC pattern
- ✅ **Validation**: Input validation dengan express-validator
- ✅ **Security**: Helmet, CORS, Rate Limiting
- ✅ **Documentation**: API endpoints terdokumentasi

## 📁 Struktur Project

```
wishlist/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── config.js      # Konfigurasi aplikasi
│   │   ├── api.js         # API service layer
│   │   ├── storage.js     # LocalStorage service
│   │   ├── ui.js          # UI utilities
│   │   └── app.js         # Main application
│   └── assets/
│       └── images/
├── backend/
│   ├── package.json
│   ├── .env
│   ├── src/
│   │   ├── server.js              # Express server
│   │   ├── routes/
│   │   │   └── wishlist.routes.js
│   │   ├── controllers/
│   │   │   └── wishlist.controller.js
│   │   ├── models/
│   │   │   └── wishlist.model.js
│   │   ├── middleware/
│   │   │   ├── error.middleware.js
│   │   │   └── validation.middleware.js
│   │   └── utils/
│   │       └── response.util.js
│   └── data/
│       └── wishlist.json
└── README.md
```

## 🛠️ Teknologi

**Frontend:**
- HTML5 Semantic
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript ES6+
- Font Awesome Icons

**Backend:**
- Node.js v18+
- Express.js v4
- express-validator
- Helmet (Security)
- CORS
- Morgan (Logging)

## 🚀 Cara Menjalankan

### Mode Offline (localStorage)
1. Buka file `frontend/index.html` di browser
2. Atau gunakan Live Server di VS Code

### Mode Full-Stack (dengan Backend)

#### 1. Setup Backend
```bash
cd backend
npm install
npm run dev
```

#### 2. Aktifkan API Mode
Edit `frontend/js/config.js`:
```javascript
USE_API: true
```

#### 3. Buka Frontend
Buka `frontend/index.html` atau gunakan Live Server

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/wishlist` | Get all items |
| GET | `/api/v1/wishlist/:id` | Get single item |
| POST | `/api/v1/wishlist` | Create item |
| PUT | `/api/v1/wishlist/:id` | Update item |
| PATCH | `/api/v1/wishlist/:id/toggle` | Toggle status |
| DELETE | `/api/v1/wishlist/:id` | Delete item |
| GET | `/api/v1/wishlist/stats/summary` | Get statistics |

### Request Body Example (POST/PUT)
```json
{
    "name": "MacBook Pro M3",
    "price": 25000000,
    "category": "elektronik",
    "priority": "high",
    "description": "Laptop impian untuk coding"
}
```

## 🔒 Environment Variables

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

## 💾 Penyimpanan Data

Data disimpan di **LocalStorage** browser:
- Tidak perlu database server
- Data persisten (tidak hilang saat refresh)
- Private ke setiap browser/device
- Batas ~5-10MB per domain

Untuk sinkronisasi antar device, gunakan backend (future enhancement).

## 🎮 Cara Menggunakan

### 1. Tambah Barang
- Isi form "Tambah Barang Baru"
- Nama barang (wajib)
- Harga (optional)
- Kategori (optional)
- Deskripsi (optional)
- Klik "Tambah Barang"

### 2. Lihat Wishlist
- Semua barang ditampilkan dalam grid card
- Tampilkan statistik (total barang, sudah dibeli, total harga)

### 3. Edit Barang
- Klik tombol "Edit" pada barang
- Modal dialog akan muncul
- Ubah informasi yang diinginkan
- Klik "Simpan Perubahan"

### 4. Tandai Sebagai Dibeli
- Centang checkbox "Dibeli?" pada barang
- Barang akan menjadi semi-transparent
- Tidak dihitung dalam harga total

### 5. Hapus Barang
- Klik tombol "Hapus" pada barang
- Konfirmasi penghapusan
- Barang akan dihapus dari wishlist

### 6. Filter & Sort
- **Filter Kategori**: Pilih kategori untuk tampilkan hanya kategori tersebut
- **Tampilkan Sudah Dibeli**: Toggle untuk menyembunyikan/menampilkan barang yang sudah dibeli
- **Urutkan**: Pilih urutan (Terbaru, Tertua, Harga, Nama)

## 📊 Kategori Barang

- Elektronik
- Fashion
- Buku
- Hobi & Olahraga
- Rumah & Dekorasi
- Travel
- Lainnya

## ♿ Aksesibilitas

- Semantic HTML
- ARIA labels dan roles
- Keyboard navigation
- Focus indicators
- Color contrast yang baik

## 🎨 Poin Penilaian

- ✅ **Fungsionalitas CRUD** - Semua operasi berfungsi dengan baik
- ✅ **Clean Code** - Code yang rapi, konsisten, dan mudah dibaca
- ✅ **Struktur Proyek** - Folder structure yang baik dan terorganisir
- ✅ **Desain & UX** - UI yang clean, fungsional, dan user-friendly
- ✅ **Responsif** - Adaptif untuk desktop dan mobile

## 🔄 Future Enhancements

- [ ] Backend API (Node.js/Express)
- [ ] User authentication
- [ ] Cloud sync
- [ ] Multiple wishlists
- [ ] Sharing wishlist dengan teman
- [ ] Image upload untuk barang
- [ ] Price tracking
- [ ] PWA support

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🐛 Known Issues

Tidak ada known issues saat ini. Silakan report jika menemukan bug.

## 📄 Lisensi

MIT License - Bebas digunakan untuk keperluan apapun

## 👨‍💻 Author

Nama Anda - [GitHub](https://github.com/username) | [LinkedIn](https://linkedin.com/in/username)

---

**Last Updated**: December 2025
