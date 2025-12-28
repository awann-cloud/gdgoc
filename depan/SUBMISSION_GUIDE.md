# 📚 PANDUAN LENGKAP SUBMISSION SOAL 2 & SOAL 3

## 🎯 Apa yang Anda Dapatkan

Anda sudah memiliki **2 proyek siap deploy**:
1. ✅ **Portfolio Website** - Responsive, Modern, Professional
2. ✅ **Wishlist App** - Full CRUD Functionality

## 📋 Step-by-Step Submission

### STEP 1: Siapkan GitHub Account
1. Buka https://github.com
2. Sign up atau login
3. Verify email Anda

### STEP 2: Create Repository untuk Portfolio

**STEP 2a: Create Repository**
1. Klik "+" di top-right → "New repository"
2. Nama: `portfolio` (atau nama unik lain)
3. Description: "Professional portfolio website"
4. Pilih "Public" (PENTING!)
5. Klik "Create repository"

**STEP 2b: Push Code ke GitHub**
```bash
# Buka terminal di folder portfolio
cd d:\ALL_DOCUMENT\Git\GDGoC\depan\portfolio

# Configure git (pertama kali saja)
git config --global user.name "Nama Anda"
git config --global user.email "email@example.com"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Professional portfolio website"

# Copy repository URL dari GitHub
# Format: https://github.com/username/portfolio.git

# Add remote
git remote add origin https://github.com/username/portfolio.git

# Push
git branch -M main
git push -u origin main

# Done! Selesai!
```

**STEP 2c: Enable GitHub Pages**
1. Buka repository di GitHub (https://github.com/username/portfolio)
2. Klik "Settings" tab
3. Scroll ke "Pages" (left sidebar)
4. Branch: pilih "main"
5. Folder: pilih "/ (root)"
6. Klik "Save"
7. GitHub akan build & deploy otomatis
8. Copy URL: `https://username.github.io/portfolio`

**STEP 2d: Update Submission Files**
Edit file di `submission/FE_Portofolio_YourName/`:
```
github.txt: https://github.com/username/portfolio
deployment.txt: https://username.github.io/portfolio
```

### STEP 3: Create Repository untuk Wishlist

Ulangi STEP 2 untuk Wishlist:

**STEP 3a: Create Repository**
1. Nama: `wishlist`
2. Description: "Wishlist app with CRUD operations"
3. Public
4. Create

**STEP 3b: Push Code**
```bash
cd d:\ALL_DOCUMENT\Git\GDGoC\depan\wishlist

git init
git add .
git commit -m "Initial commit: Wishlist app with full CRUD"

git remote add origin https://github.com/username/wishlist.git
git branch -M main
git push -u origin main
```

**STEP 3c: Enable GitHub Pages**
1. Settings → Pages
2. Main branch, root folder
3. Save
4. Deploy otomatis
5. Copy URL: `https://username.github.io/wishlist`

**STEP 3d: Update Submission Files**
Edit file di `submission/FE_Wishlist_YourName/`:
```
github.txt: https://github.com/username/wishlist
deployment.txt: https://username.github.io/wishlist
```

### STEP 4: Customize Portfolio Info

Edit `portfolio/index.html`:

```html
<!-- Ubah nama & title -->
<h1 class="hero-title">Hai, Saya adalah <span class="highlight">Nama Anda</span></h1>

<!-- Ubah bio -->
<p>Saya adalah seorang developer berpengalaman...</p>

<!-- Ubah social links -->
<a href="https://github.com/username">GitHub</a>
<a href="https://linkedin.com/in/username">LinkedIn</a>

<!-- Ubah contact info -->
<a href="mailto:email@example.com">email@example.com</a>
<a href="tel:+6281234567890">+62 812 345 67890</a>

<!-- Ubah projects -->
<!-- Cari section "Proyek Terbaru" -->
<!-- Edit atau tambah projects -->
```

Commit & push:
```bash
git add .
git commit -m "Update personal information"
git push
```

### STEP 5: Prepare Submission Folder

**Struktur Final:**
```
submission/
├── FE_Portofolio_YourName/
│   ├── github.txt                  (URL repository)
│   ├── deployment.txt              (URL deployment)
│   └── README_SUBMISSION.md        (Sudah ada)
│
└── FE_Wishlist_YourName/
    ├── github.txt                  (URL repository)
    ├── deployment.txt              (URL deployment)
    └── README_SUBMISSION.md        (Sudah ada)
```

**Edit file-file submission:**

`FE_Portofolio_YourName/github.txt`:
```
https://github.com/username/portfolio
```

`FE_Portofolio_YourName/deployment.txt`:
```
https://username.github.io/portfolio
```

`FE_Wishlist_YourName/github.txt`:
```
https://github.com/username/wishlist
```

`FE_Wishlist_YourName/deployment.txt`:
```
https://username.github.io/wishlist
```

### STEP 6: Compress Submission Folders

**Windows (7-Zip atau WinRAR):**
1. Klik kanan `submission/FE_Portofolio_YourName`
2. Send to → Compressed folder
3. Rename ke `FE_Portofolio_Nama_Anda.zip`
4. Ulangi untuk Wishlist

**Command Line:**
```bash
# Compress Portfolio
cd d:\ALL_DOCUMENT\Git\GDGoC\depan\submission
Compress-Archive -Path "FE_Portofolio_YourName" -DestinationPath "FE_Portofolio_Nama_Anda.zip"

# Compress Wishlist
Compress-Archive -Path "FE_Wishlist_YourName" -DestinationPath "FE_Wishlist_Nama_Anda.zip"
```

### STEP 7: Upload ke Learning Management System

1. Buka platform pengumpulan (Canvas, Google Classroom, dll)
2. Cari folder Soal 2 atau 3
3. Upload file:
   - `FE_Portofolio_Nama_Anda.zip`
   - `FE_Wishlist_Nama_Anda.zip` (jika wajib atau optional)
4. Submit
5. Done! 🎉

## ✅ Verification Checklist

Sebelum submit, pastikan:

### Portfolio
- [ ] Repository PUBLIC di GitHub
- [ ] Website accessible di GitHub Pages URL
- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] Navigation work
- [ ] Contact form work
- [ ] Personal info updated
- [ ] Projects showcase visible
- [ ] No console errors

### Wishlist
- [ ] Repository PUBLIC di GitHub
- [ ] Website accessible di GitHub Pages URL
- [ ] Can ADD item
- [ ] Can READ/VIEW items
- [ ] Can UPDATE item
- [ ] Can DELETE item
- [ ] Filter category work
- [ ] Sort work
- [ ] Responsive design
- [ ] Data persist on refresh
- [ ] No console errors

### Submission Files
- [ ] github.txt berisi URL repository
- [ ] deployment.txt berisi URL deploy
- [ ] README_SUBMISSION.md present
- [ ] Folder di-compress jadi .zip
- [ ] Nama file format: `FE_Portofolio_Nama_Anda.ZIP`

## 📊 Poin Penilaian

### Portfolio (Soal 2)
1. ✅ **Clean Code** - Kode rapi, konsisten, efisien
2. ✅ **Struktur HTML Semantik** - Tag HTML yang tepat
3. ✅ **Desain & UI** - Visual bersih dan menarik
4. ✅ **Desain Responsif** - Adaptif semua ukuran
5. ✅ **Interaktivitas** - JavaScript untuk features dinamis
6. ✅ **Modularitas** - Kode terstruktur & reusable

### Wishlist (Soal 3)
1. ✅ **Fungsionalitas CRUD** - Semua fungsi berfungsi
2. ✅ **Clean Code** - Kode rapi & konsisten
3. ✅ **Struktur Proyek** - Folder structure baik
4. ✅ **Desain & UX** - UI fungsional & user-friendly
5. ✅ **Desain Responsif** - Adaptif desktop & mobile
6. ✅ **Kualitas Backend** - Jika ada (optional)

## 🚀 Tips Nilai Tambah

Untuk nilai maksimal:

### Portfolio
- Tambah smooth animations
- Implement dark mode toggle
- Add blog section
- Implement email integration
- Add project filtering
- Performance optimization
- SEO optimization

### Wishlist
- Add share wishlist feature
- Implement import/export
- Add price tracking
- Implement backend API (Node.js)
- Add user authentication
- Cloud database integration
- PWA support

## 🆘 Troubleshooting

### GitHub Pages tidak muncul
- Pastikan repo PUBLIC
- Pastikan branch "main" selected
- Tunggu 1-2 menit untuk build
- Check Settings → Pages

### Push ke GitHub error
```bash
# Error: could not read Username
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Error: origin already exists
git remote remove origin
git remote add origin <url>

# Error: permission denied
# Gunakan SSH key atau Personal Access Token
```

### Website tidak responsive
- Check viewport meta tag di HTML
- Test dengan DevTools Device Toolbar
- Test di beberapa browser

### Data tidak disimpan (Wishlist)
- Check browser localStorage enabled
- Check DevTools → Application → LocalStorage
- Clear cache & refresh

## 📞 Resources

- MDN Web Docs: https://developer.mozilla.org
- CSS-Tricks: https://css-tricks.com
- JavaScript.info: https://javascript.info
- GitHub Docs: https://docs.github.com
- Dev.to: https://dev.to

## 🎓 Learning Outcomes

Setelah project ini, Anda belajar:
- ✅ Semantic HTML5
- ✅ Modern CSS3 (Grid, Flexbox, Variables)
- ✅ Vanilla JavaScript (ES6+)
- ✅ Form validation & handling
- ✅ Responsive design principles
- ✅ CRUD operations
- ✅ LocalStorage API
- ✅ Git & GitHub workflow
- ✅ Web deployment
- ✅ Accessibility (a11y)

---

## 📅 Timeline

- **Before Submit**: Test everything thoroughly
- **Day of Submit**: Upload ZIP files
- **After Submit**: Monitor feedback
- **Demo**: Be ready to explain code

---

**Good Luck! 🚀**

Jika ada pertanyaan, cek README.md di masing-masing project folder.
