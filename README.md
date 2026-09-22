# 🚀 InnovFest 2026 - SMK Telkom Malang (Moklet)
### Full-Stack Web App: Formulir Pengajuan Inovasi & Dashboard Real-Time

Aplikasi web modern tipe **Single Page Application (SPA)** yang terintegrasi langsung dengan **Google Sheets** sebagai database, didesain khusus dengan **House Style SMK Telkom Malang (Moklet)** mengombinasikan warna khas Merah Moklet (`#E21E26`), Putih, dan Abu-abu terang menggunakan **Tailwind CSS**.

---

## 📁 Struktur File Proyek

```
innovfest-2026/
├── Code.gs        # Backend Google Apps Script (doGet, doPost, LockService, JSON API)
├── Index.html     # Frontend SPA (Tailwind CSS, Form Input, Dashboard Tabel, Filter)
└── README.md      # Panduan Instalasi dan Deployment Lengkap
```

---

## 📋 Struktur Kolom Database (Google Sheets)

Script akan secara otomatis membuat sheet bernama **`Inovasi`** dan mengatur header jika belum ada:

| Kolom | Nama Kolom | Keterangan |
| :---: | :--- | :--- |
| **A** | `Timestamp` | Otomatis dibuat oleh backend GAS saat data disubmit |
| **B** | `Nama Lengkap` | Teks, Wajib diisi (Ketua / Pengusul) |
| **C** | `Anggota 1` | Teks, Opsional |
| **D** | `Anggota 2` | Teks, Opsional |
| **E** | `Judul Ide` | Teks, Wajib diisi |
| **F** | `Kategori Inovasi` | Dropdown: `Idea`, `Prototype`, `Implementation` |
| **G** | `Status` | Dropdown: `Masih Ide`, `Penulisan Dokumen`, `Terdaftar Xgracias` |

---

## 🛠️ Panduan Langkah demi Langkah (Setup & Deploy)

### Langkah 1: Google Spreadsheet Anda
Spreadsheet ID Anda sudah otomatis terpasang di dalam `Code.gs`:
- **Spreadsheet ID**: `15o582NEU5jmHyDmIfpwzSBorydeDZL7JsY3qkdu8L0M`
- **URL Spreadsheet**: [Buka Spreadsheet di Google Sheets](https://docs.google.com/spreadsheets/d/15o582NEU5jmHyDmIfpwzSBorydeDZL7JsY3qkdu8L0M/edit)

Sheet bernama **`Inovasi`** beserta header merah khas Moklet akan otomatis dibuat di spreadsheet tersebut saat script dijalankan.

---

### Langkah 2: Buka Apps Script Editor
1. Pada menu Google Sheets di bagian atas, klik **Ekstensi** (Extensions) > **Apps Script**.
2. Tab editor kode Google Apps Script akan terbuka.
3. Ubah nama proyek di pojok kiri atas dari *Untitled project* menjadi `InnovFest-Backend`.

---

### Langkah 3: Masukkan Kode `Code.gs`
1. Di panel kiri, klik file **`Code.gs`**.
2. Hapus seluruh kode default yang ada di dalamnya.
3. Salin seluruh isi dari file [Code.gs](file:///d:/chusni/innovfest-2026/Code.gs) yang telah disediakan dan tempelkan (paste) ke editor.
4. Simpan dengan menekan tombol **Ctrl + S** (atau ikon disket).

---

### Langkah 4: Tambahkan File `Index.html`
1. Di panel kiri Apps Script, klik tombol tambah `+` di sebelah tulisan **Files** (File).
2. Pilih opsi **HTML**.
3. Beri nama file tepat: `Index` (Apps Script akan otomatis menyimpannya sebagai `Index.html`).
4. Hapus seluruh kode bawaan di `Index.html`.
5. Salin seluruh isi dari file [Index.html](file:///d:/chusni/innovfest-2026/Index.html) yang telah disediakan dan tempelkan (paste).
6. Simpan dengan menekan tombol **Ctrl + S**.

---

### Langkah 5: Uji Coba Inisialisasi Sheet (Opsional namun Dianjurkan)
1. Pada bilah atas editor Apps Script, di samping tombol *Debug*, pilih fungsi **`getOrCreateSheet`**.
2. Klik tombol **Run** (Jalankan).
3. Jika muncul pop-up izin (*Authorization Required*):
   - Klik **Review Permissions** (Tinjau Izin).
   - Pilih akun Google Anda.
   - Klik tautan kecil **Advanced** (Lanjutan) > Klik **Go to InnovFest-Backend (unsafe)**.
   - Klik **Allow** (Izinkan).
4. Periksa kembali Google Sheets Anda, sheet **`Inovasi`** dengan header merah Moklet telah terbentuk otomatis!

---

### Langkah 6: Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy** > **New deployment** (Terapkan baru).
2. Klik ikon gerigi ⚙️ di sebelah *Select type* (Pilih jenis), lalu pilih **Web app** (Aplikasi web).
3. Konfigurasikan pengaturan berikut secara teliti:
   - **Description**: `InnovFest 2026 Production v1`
   - **Execute as** (Jalankan sebagai): **`Me (email_anda@gmail.com)`**
   - **Who has access** (Siapa yang memiliki akses): **`Anyone`** *(Siapa saja, agar peserta dapat mengakses form tanpa perlu login Google)*.
4. Klik tombol **Deploy**.
5. Salin **Web app URL** yang diberikan (format URL: `https://script.google.com/macros/s/.../exec`).
6. Buka URL tersebut di tab baru browser atau di smartphone Anda untuk mulai menggunakan aplikasi!

---

## ✨ Fitur Unggulan Aplikasi

1. **House Style Moklet**:
   - Skema warna identik SMK Telkom Malang: Merah Moklet (`#E21E26`), putih bersih, dan abu-abu modern.
   - Tipografi elegan menggunakan Google Fonts *Plus Jakarta Sans*.
2. **Single Page Application (SPA)**:
   - Beralih instan antara menu **"Isi Form"** dan **"Dashboard Inovasi"** tanpa reload halaman.
3. **Formulir Cerdas**:
   - Validasi input wajib.
   - Indikator loading saat submit data.
   - Notifikasi sukses/gagal yang intuitif.
4. **Dashboard Interaktif**:
   - **Kartu Statistik KPI**: Menghitung secara otomatis jumlah inovasi per kategori (*Idea*, *Prototype*, *Implementation*).
   - **Pencarian Real-Time**: Cari instan berdasarkan judul, nama ketua, atau anggota.
   - **Filter Kategori**: Menyaring tabel berdasarkan kategori inovasi.
   - **Tabel Responsif**: Dilengkapi zebra-striping, efek hover baris, dan badge berwarna untuk tiap kategori.
5. **Keamanan & Performa**:
   - Menerapkan `LockService` di backend untuk mencegah *race condition* jika banyak peserta submit serentak.
   - Sanitasi input HTML (*anti-XSS*).
   - Timestamp otomatis zona waktu Indonesia (WIB / Asia/Jakarta).
