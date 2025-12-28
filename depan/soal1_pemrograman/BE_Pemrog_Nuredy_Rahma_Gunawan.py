# BE_Pemrog_Nuredy Rahma Gunawan.py
# Soal: Kode Rahasia GDGoC UNSRI
# Author: Nuredy Rahma Gunawan
# Deskripsi: Validasi string dengan aturan:
#            1. Jumlah 'G' harus sama dengan jumlah 'C'
#            2. Tidak boleh ada substring "DGD"

def is_valid_code(s):
    """
    Fungsi untuk memvalidasi kode rahasia GDGoC
    
    Args:
        s (str): String yang akan divalidasi (hanya karakter G, D, C)
        
    Returns:
        str: "VALID" atau "TIDAK VALID"
    
    Complexity:
        - Time: O(n) dimana n = panjang string
        - Space: O(1) karena hanya menggunakan variabel counter
    """
    # Syarat 1: Hitung jumlah 'G' dan 'C', harus sama
    # Method .count() melakukan iterasi O(n) untuk menghitung karakter tertentu
    count_g = s.count('G')
    count_c = s.count('C')
    
    # Jika jumlah G tidak sama dengan C, langsung invalid
    # Validasi ini mencegah pengecekan lebih lanjut jika syarat pertama tidak terpenuhi
    if count_g != count_c:
        return "TIDAK VALID"
    
    # Syarat 2: Cek apakah ada substring "DGD"
    # String tidak boleh mengandung 'G' yang diapit oleh 'D'
    # Operator 'in' melakukan pengecekan substring dengan complexity O(n)
    if "DGD" in s:
        return "TIDAK VALID"
    
    # Jika semua syarat terpenuhi, return VALID
    return "VALID"

# Main Program
# Input jumlah test case
# Baca integer yang merepresentasikan berapa banyak string yang akan divalidasi
t = int(input())

# Proses setiap test case
# Loop sebanyak t kali untuk memproses setiap string input
for _ in range(t):
    # Baca string dan hilangkan whitespace di awal/akhir dengan .strip()
    s = input().strip()
    
    # Panggil fungsi validasi dan print hasilnya
    print(is_valid_code(s))
