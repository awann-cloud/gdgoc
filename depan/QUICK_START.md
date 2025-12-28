# Quick Start Script untuk Submit

## Portfolio Website

### 1. Setup & Push Portfolio
```bash
cd portfolio

# Jika belum ada .git
git init
git add .
git commit -m "Portfolio website"

# Ganti dengan username GitHub Anda
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages untuk Portfolio
- Buka: https://github.com/YOUR_USERNAME/portfolio/settings/pages
- Branch: main
- Folder: / (root)
- Tunggu deploy (biasanya 1-2 menit)
- URL: https://YOUR_USERNAME.github.io/portfolio

---

## Wishlist App

### 1. Setup & Push Wishlist
```bash
cd wishlist

# Jika belum ada .git
git init
git add .
git commit -m "Wishlist app with CRUD"

# Ganti dengan username GitHub Anda
git remote add origin https://github.com/YOUR_USERNAME/wishlist.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages untuk Wishlist
- Buka: https://github.com/YOUR_USERNAME/wishlist/settings/pages
- Branch: main
- Folder: / (root)
- Tunggu deploy
- URL: https://YOUR_USERNAME.github.io/wishlist

---

## Submission Files

### Portfolio
File yang harus ada di `submission/FE_Portofolio_YourName/`:
1. `github.txt` - Berisi URL: https://github.com/YOUR_USERNAME/portfolio
2. `deployment.txt` - Berisi URL: https://YOUR_USERNAME.github.io/portfolio
3. `README_SUBMISSION.md` - Guide lengkap (sudah ada)

### Wishlist
File yang harus ada di `submission/FE_Wishlist_YourName/`:
1. `github.txt` - Berisi URL: https://github.com/YOUR_USERNAME/wishlist
2. `deployment.txt` - Berisi URL: https://YOUR_USERNAME.github.io/wishlist
3. `README_SUBMISSION.md` - Guide lengkap (sudah ada)

---

## Compress Submission

```bash
# Windows PowerShell
cd submission

# Compress Portfolio
Compress-Archive -Path "FE_Portofolio_YourName" -DestinationPath "FE_Portofolio_YourName.zip"

# Compress Wishlist
Compress-Archive -Path "FE_Wishlist_YourName" -DestinationPath "FE_Wishlist_YourName.zip"
```

Hasil:
- `FE_Portofolio_YourName.zip`
- `FE_Wishlist_YourName.zip`

Upload ke platform pengumpulan (Canvas, Google Classroom, dll)

---

## Testing

### Portfolio
```
http://localhost:5500 (jika pakai Live Server)
atau
https://YOUR_USERNAME.github.io/portfolio (live)
```

Cek:
- [ ] Responsive (mobile 375px, tablet 768px, desktop)
- [ ] Navigation smooth scroll
- [ ] Contact form validation
- [ ] Hamburger menu mobile
- [ ] No console errors

### Wishlist
```
http://localhost:5500
atau
https://YOUR_USERNAME.github.io/wishlist
```

Cek:
- [ ] Bisa add item
- [ ] Bisa edit item
- [ ] Bisa delete item
- [ ] Bisa mark as purchased
- [ ] Filter category
- [ ] Sort options
- [ ] Data persist refresh
- [ ] Responsive design
- [ ] No console errors

---

Done! 🎉
