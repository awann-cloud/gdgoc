# Portfolio Website - Guide Lengkap

## 📋 Daftar Isi
1. Cara Menjalankan
2. Fitur Utama
3. Customization
4. Deployment

## 🚀 Cara Menjalankan

### Lokal (Development)
```bash
# Option 1: Gunakan Live Server di VS Code
1. Install extension "Live Server" (by Ritwick Dey)
2. Klik kanan pada index.html
3. Pilih "Open with Live Server"
4. Browser otomatis membuka di http://localhost:5500

# Option 2: Buka langsung di browser
1. Buka folder project di file explorer
2. Double-click index.html
3. Browser akan membuka file
```

### Testing
1. Buka http://localhost:5500 (jika menggunakan Live Server)
2. Test semua fitur:
   - Responsive design (buka DevTools, gunakan Device Toolbar)
   - Smooth scrolling (klik navigation links)
   - Form validation (isi contact form dengan invalid data)
   - Mobile menu (resize ke mobile size, test hamburger menu)

## 🎨 Fitur Utama

### Navigation
- Fixed navbar dengan hamburger menu untuk mobile
- Smooth scroll ke setiap section
- Active link indication

### Hero Section
- Eye-catching banner dengan gradient background
- CTA buttons untuk action
- Social media links

### About Section
- Introduction dan background
- Statistics cards dengan hover effect

### Skills Section
- Organized skill categories
- Responsive grid layout

### Projects Section
- Showcase 3+ projects dengan detail
- Live demo dan GitHub links
- Technology tags

### Contact Section
- Contact form dengan validasi
- Multiple contact channels
- Success/error messaging

### Responsive Design
- Mobile-first approach
- Hamburger menu untuk mobile
- Optimized untuk semua ukuran layar

## 🎯 Customization

### 1. Edit Informasi Personal
File: `index.html`

Cari dan ubah:
```html
<!-- Hero Title -->
<h1 class="hero-title">Hai, Saya adalah <span class="highlight">Developer</span></h1>

<!-- About Section -->
<p>Saya adalah seorang developer berpengalaman...</p>

<!-- Contact Info -->
<a href="mailto:email@example.com">email@example.com</a>
<a href="tel:+6281234567890">+62 812 345 67890</a>
<p>Jakarta, Indonesia</p>

<!-- Social Links -->
<a href="https://github.com/username" target="_blank">GitHub</a>
<a href="https://linkedin.com/in/username" target="_blank">LinkedIn</a>
```

### 2. Tambah/Edit Projects
Cari `<article class="project-card">` dan duplikat untuk tambah project baru:

```html
<article class="project-card">
    <div class="project-image">
        <div class="image-placeholder">
            <i class="fas fa-code"></i>
        </div>
    </div>
    <div class="project-content">
        <h3>Nama Project</h3>
        <p>Deskripsi project...</p>
        <div class="project-tags">
            <span class="tag">Tech 1</span>
            <span class="tag">Tech 2</span>
        </div>
        <div class="project-links">
            <a href="#" class="link-btn">Live</a>
            <a href="#" class="link-btn">Code</a>
        </div>
    </div>
</article>
```

### 3. Ubah Warna
File: `css/style.css`

Ubah CSS variables:
```css
:root {
    --primary-color: #6366f1;      /* Warna utama */
    --secondary-color: #8b5cf6;    /* Warna secondary */
    --accent-color: #ec4899;       /* Warna accent */
    /* ... */
}
```

### 4. Tambah Skill
Cari `.skill-category` dan duplikat:
```html
<div class="skill-category">
    <h3>Category Name</h3>
    <ul class="skill-list">
        <li>Skill 1</li>
        <li>Skill 2</li>
        <li>Skill 3</li>
    </ul>
</div>
```
