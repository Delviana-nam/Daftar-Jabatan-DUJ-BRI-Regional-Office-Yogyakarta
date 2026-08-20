# Deskripsi Jabatan BRI - Regional Office Yogyakarta

## Struktur folder
```
project2/
├── index.html          -> halaman utama
├── style.css             -> styling
├── script.js              -> logika interaktif (menu, buka detail, dsb)
├── divisions_data.js      -> DATA 13 divisi + 36 jabatan (paling sering diedit)
```

## Cara kerja
1. **Menu hamburger (☰)** di pojok kiri atas membuka daftar isi 13 divisi.
   Klik salah satu nama akan otomatis scroll ke card divisi tersebut.
2. Tiap card divisi punya tombol **DOWNLOAD** yang mengunduh paket file
   lengkap divisi itu.
3. Tiap poin jabatan (misal "REGIONAL SME BANKING HEAD") kalau diklik akan
   membuka halaman detail yang menampilkan preview detail rincian pekerjaan jabatan tersebut.
   Ada tombol **Kembali** untuk balik ke tampilan awal.

## Cara mengedit data (paling penting)
Semua data ada di **`divisions_data.js`**. Bentuknya seperti ini per divisi:

```js
{
  "id": "regional-sme-banking",             // dipakai untuk link menu, harus unik
  "title": "REGIONAL SME BANKING",           // judul yang tampil di card
  "downloadId": "images/2.jpg",              // path tempat file disimpan
  "points": [
    { "title": "REGIONAL SME BANKING HEAD", "fileId": "images/2.jpg" },
    { "title": "SMALL BUSINESS DEPARTMENT HEAD", "fileId": "images/3.jpg" }
  ]
}
```

### Menambah divisi baru
Copy salah satu blok `{ ... }` di dalam `divisions_data.js`, tempel lagi
sebagai anggota array baru, lalu ganti semua isinya. Card baru dan menu
sidebar akan otomatis muncul, tidak perlu edit HTML/CSS sama sekali.

### Menambah/menghapus poin jabatan
Cukup tambah/hapus baris di dalam array `"points"` pada divisi terkait.

## Cara membuka / cek tampilan
Install extension **Live Server** di VS Code, klik kanan pada `index.html`,
pilih **"Open with Live Server"**.

 