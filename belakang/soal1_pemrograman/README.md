# Cara Testing Soal 1: Pemrograman

## File: BE_Pemrog_Nuredy_Rahma_Gunawan.py

---

## Test Case yang Diberikan

### Input:
```
5
GDGDC
GDC
DGDGC
GGCC
CDG
```

### Expected Output:
```
TIDAK VALID
VALID
TIDAK VALID
VALID
VALID
```

---

## Cara Test

### Method 1: Input Manual di Terminal

```bash
# Navigate ke folder soal 1
cd soal1_pemrograman

# Run program
python BE_Pemrog_Nuredy_Rahma_Gunawan.py

# Ketik input:
5
GDGDC
GDC
DGDGC
GGCC
CDG

# Tekan Enter setelah setiap line
```

---

### Method 2: Menggunakan File Input

**Buat file input.txt:**
```
5
GDGDC
GDC
DGDGC
GGCC
CDG
```

**Run dengan redirect:**
```bash atau Git Bash
python BE_Pemrog_Nuredy_Rahma_Gunawan.py < input.txt
```

**Output harus:**
```
TIDAK VALID
VALID
TIDAK VALID
VALID
VALID
```

---

### Method 3: Test di VS Code

1. Buka file `BE_Pemrog_Nuredy_Rahma_Gunawan.py` di VS Code
2. Klik kanan → Run Python File in Terminal
3. Masukkan input satu per satu
4. Verifikasi output

---

## Penjelasan Test Cases

### Test Case 1: `GDGDC`
- Jumlah G: 2
- Jumlah C: 1
- **Result:** TIDAK VALID (G ≠ C)

### Test Case 2: `GDC`
- Jumlah G: 1
- Jumlah C: 1
- Substring DGD: Tidak ada
- **Result:** VALID ✅

### Test Case 3: `DGDGC`
- Jumlah G: 2
- Jumlah C: 1
- **Result:** TIDAK VALID (G ≠ C)
- Bonus: Ada substring DGD juga

### Test Case 4: `GGCC`
- Jumlah G: 2
- Jumlah C: 2
- Substring DGD: Tidak ada
- **Result:** VALID ✅

### Test Case 5: `CDG`
- Jumlah G: 1
- Jumlah C: 1
- Substring DGD: Tidak ada
- **Result:** VALID ✅

---

## 🧪 Test Cases Tambahan (Optional)

### Test Case 6: Empty String
```python
Input: ""
Expected: VALID (0 G, 0 C, no DGD)
```

### Test Case 7: Only D
```python
Input: "DDD"
Expected: VALID (0 G, 0 C)
```

### Test Case 8: DGD Pattern
```python
Input: "DGDCC"
Expected: TIDAK VALID (ada DGD)
```

### Test Case 9: Multiple DGD
```python
Input: "DGDGDGC"
Expected: TIDAK VALID (ada DGD)
```

### Test Case 10: Complex Valid
```python
Input: "GCGCGCDDD"
Expected: VALID (3 G, 3 C, no DGD)
```

---

## 📊 Verifikasi Algoritma

### Algoritma:
1. Hitung jumlah 'G' → O(n)
2. Hitung jumlah 'C' → O(n)
3. Bandingkan count_g == count_c
4. Cek substring "DGD" → O(n)
5. Return hasil

### Complexity:
- **Time:** O(n) dimana n = panjang string
- **Space:** O(1) hanya menggunakan variable counter

---

## 🎯 Checklist Testing

```
[ v ] Program bisa dijalankan tanpa error
[ v ] Test case 1-5 sesuai expected output
[ v ] Dapat handle empty string
[ v ] Dapat handle string hanya berisi D
[ v ] Dapat detect DGD pattern
[ v ] Output format benar (VALID / TIDAK VALID)
```

---

**Testing Soal 1: SELESAI!**
