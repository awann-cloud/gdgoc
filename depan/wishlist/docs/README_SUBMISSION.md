# Wishlist App - Guide Lengkap

## 📋 Daftar Isi
1. Cara Menjalankan (Mode Offline & Full-Stack)
2. Fitur CRUD Lengkap
3. Backend API (Nilai Tambah)
4. Cara Menggunakan
5. Tech Stack
6. Deployment

## 🚀 Cara Menjalankan

### Mode 1: Offline (localStorage) - SIMPLE
```bash
# Gunakan Live Server di VS Code
1. Buka folder wishlist/frontend di VS Code
2. Install extension "Live Server" (by Ritwick Dey)
3. Klik kanan pada index.html
4. Pilih "Open with Live Server"
5. Browser otomatis membuka di http://localhost:5500
```

### Mode 2: Full-Stack dengan Backend (NILAI TAMBAH)
```bash
# Terminal 1 - Start Backend
cd wishlist/backend
npm install
npm run dev
# Server running di http://localhost:3000

# Terminal 2 - atau buka Live Server
# Edit frontend/js/config.js
# Ubah: USE_API: true

# Buka frontend/index.html dengan Live Server
```

## 📊 Fitur CRUD Lengkap

### CREATE - Tambah Barang
```
1. Scroll ke section "Wishlist Saya"
2. Isi form "Tambah Barang Baru":
   - Nama barang (REQUIRED)
   - Harga (optional)
   - Kategori (optional)
   - Prioritas (optional)
   - Deskripsi (optional)
   - URL Gambar (optional)
3. Klik "Tambah ke Wishlist"
4. Barang akan muncul di list
```

Validasi:
- Nama minimal 2 karakter
- Harga harus angka positif
- Success notification muncul

### READ - Tampilkan Barang
```
1. Semua barang ditampilkan dalam grid
2. Lihat statistik:
   - Total Barang
   - Sudah Dibeli
   - Total Harga
3. Setiap barang menampilkan:
   - Nama
   - Kategori badge
   - Harga
   - Deskripsi
   - Status dibeli/belum
```

Filter & Sort:
- Filter by kategori
- Toggle show/hide purchased items
- Sort by: Terbaru, Tertua, Harga, Nama

### UPDATE - Edit Barang
```
1. Klik tombol "Edit" pada barang
2. Modal dialog muncul dengan form
3. Edit informasi barang
4. Klik "Simpan Perubahan"
5. Barang terupdate dalam wishlist
```

Atau edit dengan langsung:
- Tandai "Dibeli?" checkbox untuk mark as purchased
- Barang akan semi-transparent
- Tidak dihitung di harga total

### DELETE - Hapus Barang
```
1. Klik tombol "Hapus" pada barang
2. Konfirmasi dialog muncul
3. Klik "OK" untuk confirm
4. Barang dihapus dari wishlist
```

## 🎮 Panduan Lengkap Penggunaan

### 1. Navigasi
- **Home**: Scroll ke atas, lihat hero section
- **Aplikasi**: Main wishlist app dengan CRUD
- **Tentang**: Fitur-fitur app dijelaskan

### 2. Menambah Barang

**Scenario 1: Tambah barang lengkap**
```
Nama: Laptop Gaming ASUS ROG
Harga: 15000000
Kategori: Elektronik
Deskripsi: Laptop 15 inch, RTX 4060, i7-13700H, 16GB RAM
```

**Scenario 2: Tambah barang minimal**
```
Nama: PlayStation 5
(Kategori dan harga optional)
```

### 3. Filter & Urutkan

**Filter Kategori**
- Pilih "Elektronik" → hanya elektronik
- Pilih "Fashion" → hanya fashion
- Pilih "Semua Kategori" → semua

**Toggle Show Purchased**
- Default: hide barang yang sudah dibeli
- Klik button → show barang yang dibeli
- Barang dibeli tampil dengan opacity/strikethrough

**Sort Options**
- Terbaru: Item baru di atas
- Tertua: Item lama di atas
- Harga Terendah: Dari 0 ke besar
- Harga Tertinggi: Dari besar ke 0
- Nama A-Z: Alphabetical order

### 4. Mark as Purchased
```
1. Cari barang yang sudah dibeli
2. Centang checkbox "Dibeli?"
3. Barang jadi semi-transparent
4. Harga tidak dihitung di total
5. Uncheck untuk batal
```

### 5. Edit Barang
```
1. Klik "Edit" pada barang
2. Modal muncul dengan form
3. Ubah salah satu atau semua field
4. Klik "Simpan Perubahan"
5. Atau klik "Batal" untuk cancel
```

### 6. Hapus Barang
```
1. Klik "Hapus" pada barang
2. Confirm dialog muncul
3. Klik "OK" atau "Cancel"
4. Jika OK, barang dihapus
```

### 7. Lihat Statistik
```
Top section menampilkan:
- Total Barang: Jumlah item belum dibeli
- Sudah Dibeli: Jumlah item yang dibeli
- Total Harga: Sum dari semua harga item belum dibeli
```

## 💾 Penyimpanan Data

**Teknologi**: Browser LocalStorage
- Semua data disimpan di browser
- Data persist setelah refresh
- Tidak perlu backend/database
- Private per browser (tidak sync ke device lain)

**Cara melihat data**:
```javascript
// Buka DevTools (F12)
// Pergi ke Application → LocalStorage
// Cari key: "wishlist-app-items"
```

**Cara clear data**:
```javascript
// Di DevTools Console
localStorage.removeItem('wishlist-app-items');
// Atau
localStorage.clear();
```

## 🎨 Customization

### 1. Ubah Warna
File: `css/style.css`
```css
:root {
    --primary-color: #ec4899;      /* Warna pink */
    --secondary-color: #f472b6;    /* Secondary pink */
    --success-color: #10b981;      /* Warna hijau */
    /* ... */
}
```

### 2. Ubah Nama Aplikasi
File: `index.html`
```html
<h1 class="app-title">
    <i class="fas fa-heart"></i> My Wishlist
</h1>
```

### 3. Tambah Kategori Baru
File: `index.html`

Cari `<select id="itemCategory">` dan tambah option:
```html
<option value="mobil">Mobil</option>
<option value="perhiasan">Perhiasan</option>
```

Jangan lupa update juga di:
- Filter select
- Edit modal select
- `getCategoryLabel()` di js/app.js

### 4. Ubah Format Mata Uang
File: `js/app.js`
```javascript
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}
```

## 📤 Deployment

### Frontend: GitHub Pages (Recommended)

**Step 1: Push ke GitHub**
```bash
git init
git add .
git commit -m "Wishlist app with CRUD + Backend API"

# Create repo di GitHub
git remote add origin https://github.com/username/wishlist.git
git branch -M main
git push -u origin main
```

**Step 2: Enable GitHub Pages**
1. Settings → Pages
2. Source: main branch, folder: /frontend
3. Save
4. Deploy otomatis ke `https://username.github.io/wishlist`

### Backend: Railway (GRATIS)

```bash
# 1. Sign up di railway.app
# 2. New Project → Deploy from GitHub
# 3. Select wishlist repo
# 4. Root Directory: backend
# 5. Deploy!

# URL: https://wishlist-api.up.railway.app
```

### Backend: Render (GRATIS)

```bash
# 1. Sign up di render.com
# 2. New → Web Service
# 3. Connect GitHub repo
# 4. Root Directory: backend
# 5. Build Command: npm install
# 6. Start Command: npm start
# 7. Deploy!

# URL: https://wishlist-api.onrender.com
```

### Full-Stack: Vercel

```bash
# Frontend + Backend dengan Vercel

# 1. vercel.com → Import repo
# 2. Deploy frontend folder sebagai Static Site
# 3. Deploy backend folder dengan:
#    - Build: npm install
#    - Output: /
#    - Install Command: npm install
#    - Dev Command: npm run dev
```

### Update API URL di Frontend
Setelah deploy backend, update `frontend/js/config.js`:
```javascript
const CONFIG = {
    API_BASE_URL: 'https://your-backend-url.railway.app/api/v1',
    USE_API: true  // Enable API mode
};
```

## ✅ Testing Checklist

**CRUD Operations**
- [ ] Create barang (semua field)
- [ ] Create barang minimal
- [ ] Read barang ditampilkan
- [ ] Update barang info
- [ ] Update barang mark as purchased
- [ ] Delete barang dengan confirm
- [ ] Delete dengan cancel (data tidak hilang)

**Validasi**
- [ ] Nama kosong → error
- [ ] Nama < 3 char → error
- [ ] Price negatif → error
- [ ] Deskripsi panjang → no issue

**Filter & Sort**
- [ ] Filter category works
- [ ] Toggle purchased works
- [ ] Sort newest works
- [ ] Sort oldest works
- [ ] Sort price-low works
- [ ] Sort price-high works
- [ ] Sort name works

**UI/UX**
- [ ] Responsive mobile (375px)
- [ ] Responsive tablet (768px)
- [ ] Responsive desktop (1920px)
- [ ] Hamburger menu works
- [ ] Modal can open & close
- [ ] Success message shows
- [ ] Statistics update correctly

**Storage**
- [ ] Data persist on refresh
- [ ] Data visible in DevTools
- [ ] Clear data works

## 🐛 Common Issues & Solutions

### Issue: Data hilang saat refresh
**Solution**: Bukan masalah. LocalStorage menyimpan data. Cek di DevTools → Application → LocalStorage

### Issue: Form tidak submit
**Solution**: Periksa console (F12) untuk error. Biasanya nama kosong atau < 3 char.

### Issue: Edit modal tidak muncul
**Solution**: Pastikan JavaScript enabled. Check console untuk error.

### Issue: Filter tidak jalan
**Solution**: Pilih kategori yang sesuai dengan data yang ada.

## � Backend API (NILAI TAMBAH)

### Struktur Backend
```
wishlist/backend/
├── package.json
├── .env
├── .env.example
└── src/
    ├── server.js
    ├── data/
    │   └── wishlist.json
    ├── routes/
    │   └── wishlist.routes.js
    ├── controllers/
    │   └── wishlist.controller.js
    ├── models/
    │   └── wishlist.model.js
    ├── middleware/
    │   ├── error.middleware.js
    │   └── validation.middleware.js
    └── utils/
        └── response.util.js
```

### Setup Backend
```bash
cd wishlist/backend
npm install
npm run dev
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/wishlist | Get all items |
| GET | /api/v1/wishlist/:id | Get item by ID |
| POST | /api/v1/wishlist | Create new item |
| PUT | /api/v1/wishlist/:id | Update item |
| PATCH | /api/v1/wishlist/:id/toggle | Toggle purchased |
| DELETE | /api/v1/wishlist/:id | Delete item |
| DELETE | /api/v1/wishlist/purchased | Delete all purchased |
| GET | /api/v1/wishlist/stats | Get statistics |

### Query Parameters
```
GET /api/v1/wishlist?category=elektronik&isPurchased=false&sortBy=price&sortOrder=asc
```

### Sample Request
```bash
# Create item
curl -X POST http://localhost:3000/api/v1/wishlist \
  -H "Content-Type: application/json" \
  -d '{"name": "MacBook Pro", "price": 25000000, "category": "elektronik"}'

# Get all items
curl http://localhost:3000/api/v1/wishlist

# Toggle purchased
curl -X PATCH http://localhost:3000/api/v1/wishlist/{id}/toggle
```

### Environment Variables (.env)
```
PORT=3000
NODE_ENV=development
```

## 📈 Future Enhancements

- User authentication (register/login)
- Cloud sync (MongoDB/PostgreSQL)
- Multiple wishlists per user
- Share wishlist dengan link
- Image upload (Cloudinary)
- Price tracking/alert
- PWA offline support
- Export to PDF
- Wishlist collaboration

## 🎓 Teknologi yang Dipelajari

- ✅ CRUD operations
- ✅ DOM manipulation
- ✅ Form validation
- ✅ LocalStorage API
- ✅ Array methods (filter, sort, map)
- ✅ Object-oriented JavaScript (Class)
- ✅ Event delegation
- ✅ Modal implementation
- ✅ Responsive CSS Grid
- ✅ CSS Animations

## 📞 Support

Issues atau pertanyaan?
1. Check README ini
2. Review console (F12)
3. Check network tab
4. Inspect HTML elements

---

**Happy Shopping! 🛒**
