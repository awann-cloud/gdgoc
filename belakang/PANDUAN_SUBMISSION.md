# 🎯 PANDUAN LENGKAP SUBMISSION
## GDGoC UNSRI - Backend Development Assignment

---

## 📦 Struktur Folder yang Sudah Dibuat

```
belakang/
│
├── soal1_pemrograman/
│   └── BE_Pemrog_[Nama_Anda].py
│       ↳ Solusi untuk validasi "Kode Rahasia GDGoC"
│
├── soal2_studi_kasus/
│   ├── BE_Flowchart_ERD_Documentation.md
│   │   ↳ ERD dan Flowchart (convert ke PDF/PNG)
│   │
│   └── program/
│       ├── server.js           ← Main application (COMPLETE!)
│       ├── package.json         ← Dependencies
│       ├── .env.example         ← Environment template
│       ├── .gitignore           ← Git ignore rules
│       └── README.md            ← Complete API documentation
│
├── soal3_studi_kasus_lanjutan/
│   └── README.md
│       ↳ Penjelasan bahwa Soal 3 sudah include di Soal 2
│
└── repository_link.txt
    ↳ Template untuk link GitHub repository
```

---

## ✅ CHECKLIST SEBELUM SUBMIT

### 1. Soal 1: Pemrograman ✅
- [x] File Python sudah dibuat
- [ ] **GANTI `[Nama_Anda]` dengan nama Anda di nama file**
- [ ] **GANTI `[Nama Anda]` di dalam kode Python**
- [ ] Test dengan sample input yang diberikan
- [ ] Verifikasi output sesuai expected

**Lokasi:** `soal1_pemrograman/BE_Pemrog_[Nama_Anda].py`

---

### 2. Soal 2: Studi Kasus I ✅

#### A. ERD & Flowchart
- [x] Dokumentasi ERD sudah dibuat (format Markdown)
- [ ] **CONVERT `BE_Flowchart_ERD_Documentation.md` ke PDF/PNG**
  - Gunakan tools: draw.io, dbdiagram.io, Lucidchart
  - Atau screenshot Markdown preview dan save as PDF
- [ ] **TAMBAHKAN WATERMARK nama Anda di diagram**
- [ ] **RENAME file menjadi:** `BE_Flowchart_ERD_[Nama_Anda].pdf`

**Lokasi:** `soal2_studi_kasus/BE_Flowchart_ERD_[Nama_Anda].pdf`

#### B. Program
- [x] `server.js` sudah complete dengan semua fitur
- [x] `package.json` sudah ada
- [x] `.env.example` sudah ada
- [x] `.gitignore` sudah ada
- [x] `README.md` documentation lengkap
- [ ] **GANTI `[Nama Anda]` di semua file**
- [ ] **Test aplikasi berjalan dengan baik**

**Lokasi:** `soal2_studi_kasus/program/`

---

### 3. Soal 3: Studi Kasus II (Opsional) ✅
- [x] Sudah terimplementasi di Soal 2 (all-in-one)
- [x] JWT Authentication ✅
- [x] Role-based Authorization ✅
- [x] Anti-overselling ✅
- [x] Complete Documentation ✅
- [ ] **Tidak perlu file terpisah** (sudah satu dengan Soal 2)

---

### 4. Repository & Documentation
- [ ] **Buat repository GitHub (public)**
- [ ] **Push semua file ke GitHub**
- [ ] **Pastikan README.md terlihat bagus di GitHub**
- [ ] **Test clone repository dan setup ulang**
- [ ] **Copy URL repository ke `repository_link.txt`**

---

## 🛠️ LANGKAH-LANGKAH FINALISASI

### Step 1: Ganti Semua Placeholder Nama

**File yang perlu di-edit:**

1. **`soal1_pemrograman/BE_Pemrog_[Nama_Anda].py`**
   - Line 3: `# Author: [Nama Anda]` → Ganti dengan nama Anda
   - Rename file: `BE_Pemrog_[Nama_Anda].py` → `BE_Pemrog_Budi_Santoso.py` (contoh)

2. **`soal2_studi_kasus/program/server.js`**
   - Line 3: `// Author: [Nama Anda]`
   - Line 245: `author: '[Nama Anda]'`

3. **`soal2_studi_kasus/program/package.json`**
   - Line 16: `"author": "[Nama Anda]"`

4. **`soal2_studi_kasus/program/README.md`**
   - Line 5: `**Author:** [Nama Anda]`
   - Line 802: `**[Nama Anda]**`
   - Line 803: `- Email: [email@example.com]`
   - Line 804: `- GitHub: [github.com/username]`

5. **`repository_link.txt`**
   - Line 41: `Nama: [Nama Anda]`
   - Line 42: `Email: [email@example.com]`

---

### Step 2: Convert ERD & Flowchart ke Format Visual

**Option 1: Screenshot + Edit**
1. Buka `BE_Flowchart_ERD_Documentation.md` di VS Code
2. Preview Markdown (Ctrl+Shift+V)
3. Screenshot diagram-diagram
4. Edit di Paint/Photoshop/Canva
5. **TAMBAHKAN WATERMARK NAMA ANDA**
6. Save as PDF: `BE_Flowchart_ERD_[Nama_Anda].pdf`

**Option 2: Gunakan Tools Online**
1. Buka https://dbdiagram.io atau https://draw.io
2. Recreate diagram dari dokumentasi Markdown
3. **TAMBAHKAN TEXT BOX dengan nama Anda sebagai watermark**
4. Export as PDF/PNG: `BE_Flowchart_ERD_[Nama_Anda].pdf`

---

### Step 3: Setup & Test Aplikasi

```bash
# Navigate ke folder program
cd soal2_studi_kasus/program

# Install dependencies
npm install

# Setup PostgreSQL database
createdb ticket_platform

# Copy dan edit .env
cp .env.example .env
# Edit .env dengan database credentials Anda

# Run server
npm run dev

# Test di browser
# Buka: http://localhost:3000
# Harus muncul JSON dengan endpoints list
```

**Test Endpoints dengan cURL:**
```bash
# 1. Register admin
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"admin123","role":"admin"}'

# 2. Login admin (save token!)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# 3. Create event (ganti YOUR_TOKEN)
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Event","location":"UNSRI","event_date":"2025-02-15T10:00:00Z","ticket_price":50000,"total_tickets":100}'
```

---

### Step 4: Setup GitHub Repository

```bash
# 1. Buat repository baru di GitHub
# - Nama: gdgoc-backend-assignment (contoh)
# - Visibility: Public
# - Jangan init dengan README (kita sudah punya)

# 2. Navigate ke root folder
cd d:\ALL_DOCUMENT\Git\GDGoC\belakang

# 3. Initialize git
git init

# 4. Add all files
git add .

# 5. Commit
git commit -m "Initial commit: GDGoC Backend Assignment - [Nama Anda]"

# 6. Add remote (ganti dengan URL repo Anda)
git remote add origin https://github.com/username/gdgoc-backend-assignment.git

# 7. Push
git branch -M main
git push -u origin main
```

**Pastikan:**
- ✅ README.md terlihat bagus di GitHub homepage
- ✅ File `.env` TIDAK ter-push (harus di-ignore)
- ✅ Repository bisa di-clone oleh orang lain
- ✅ File structure jelas dan rapi

---

### Step 5: Finalisasi Submission

1. **Copy URL Repository**
   ```
   https://github.com/username/gdgoc-backend-assignment
   ```

2. **Edit `repository_link.txt`**
   - Paste URL di bagian "GitHub Repository"
   - Isi informasi author (nama, email)

3. **Rename Folder Root** (jika perlu)
   ```
   belakang/ → BE_SubmissionMember_[Nama_Anda]/
   ```

4. **Compress ke ZIP**
   - Right-click folder
   - Send to → Compressed (zipped) folder
   - Rename: `BE_SubmissionMember_[Nama_Anda].ZIP`
   - Contoh: `BE_SubmissionMember_Budi_Santoso.ZIP`

---

## 📋 FINAL CHECKLIST

```
[ ] Semua [Nama Anda] sudah diganti dengan nama asli
[ ] File Python sudah di-rename sesuai format
[ ] ERD & Flowchart sudah di-convert ke PDF/PNG
[ ] Watermark nama sudah ditambahkan di diagram
[ ] Aplikasi berhasil di-run dan di-test
[ ] Database setup berjalan lancar
[ ] GitHub repository sudah dibuat dan di-push
[ ] README.md terlihat bagus di GitHub
[ ] repository_link.txt sudah diisi
[ ] Folder sudah di-rename sesuai format submission
[ ] ZIP file sudah dibuat dengan nama yang benar
```

---

## 🎯 FORMAT NAMA FILE SUBMISSION

**Final ZIP File:**
```
BE_SubmissionMember_[Nama_Anda].ZIP
```

**Contoh:**
```
BE_SubmissionMember_Budi_Santoso.ZIP
BE_SubmissionMember_Siti_Nurhaliza.ZIP
BE_SubmissionMember_Ahmad_Dahlan.ZIP
```

**Isi ZIP:**
```
BE_SubmissionMember_[Nama_Anda]/
├── soal1_pemrograman/
│   └── BE_Pemrog_[Nama_Anda].py
├── soal2_studi_kasus/
│   ├── BE_Flowchart_ERD_[Nama_Anda].pdf
│   └── program/
│       ├── server.js
│       ├── package.json
│       ├── .env.example
│       ├── .gitignore
│       └── README.md
├── soal3_studi_kasus_lanjutan/
│   └── README.md
└── repository_link.txt
```

---

## ⏰ DEADLINE

**Minggu, 28 Desember 2025 pukul 23.59 WIB**

Pastikan submit sebelum deadline!

---

## 🚨 CATATAN PENTING

1. **Jangan Push `.env` ke GitHub**
   - File `.env` sudah ada di `.gitignore`
   - Push `.env.example` saja
   - Reviewer akan copy `.env.example` → `.env`

2. **Test Setup dari Awal**
   - Clone repository ke folder baru
   - Test apakah setup bisa dilakukan dari nol
   - Pastikan README.md jelas

3. **Database Credentials**
   - Jangan hardcode password di kode
   - Gunakan environment variables
   - Dokumentasikan setup di README.md

4. **File Size**
   - Pastikan `node_modules/` tidak ter-zip
   - File `.gitignore` sudah benar
   - ZIP size seharusnya < 1 MB (tanpa node_modules)

---

## 📞 Troubleshooting

### "npm install" error
```bash
# Hapus package-lock.json dan node_modules
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

### Database connection error
```bash
# Cek PostgreSQL running
pg_ctl status

# Start PostgreSQL jika belum running
pg_ctl start

# Create database jika belum ada
createdb ticket_platform
```

### Port already in use
```bash
# Ganti PORT di .env
PORT=3001
```

---

## 🎓 Tips Mendapatkan Nilai Maksimal

1. **Code Quality**
   - Clean code
   - Proper comments
   - Consistent formatting

2. **Documentation**
   - README.md lengkap
   - API endpoints terdokumentasi
   - Setup instructions jelas

3. **Testing**
   - Test semua endpoint
   - Screenshot hasil testing
   - Include di dokumentasi

4. **Extra Features**
   - Error handling yang baik
   - Validation yang lengkap
   - Security best practices

5. **Presentation**
   - ERD & Flowchart rapi
   - Watermark profesional
   - GitHub repository terstruktur

---

## ✨ Good Luck!

Semua file sudah dibuat dan siap digunakan. Tinggal:
1. Ganti nama placeholder
2. Convert diagram ke PDF/PNG
3. Test aplikasi
4. Push ke GitHub
5. Compress dan submit

**You got this! 🚀**

---

**Author:** [Nama Anda]  
**Contact:** [email@example.com]  
**GitHub:** [github.com/username]
