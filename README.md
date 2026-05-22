# Project Management App

Aplikasi manajemen proyek *full-stack* yang dikembangkan sebagai bagian dari pembelajaran di **WPU (Web Programming Unpas) Course**. Aplikasi ini memungkinkan pengguna untuk membuat papan proyek (*board*), daftar kategori tugas (*list*), dan kartu tugas (*card*) dengan fitur interaktif *drag-and-drop*, pengelolaan kolaborasi anggota tim, hingga fitur unggahan berkas lampiran pada setiap kartu tugas.

---

## Fitur Utama

- **Otentikasi Pengguna & Sesi Aman**: Fitur registrasi akun dan masuk (*login*) menggunakan sistem token otentikasi JWT (JSON Web Token) dengan pengamanan enkripsi kata sandi menggunakan Bcrypt.
- **Manajemen Board Proyek**: Pengguna dapat membuat papan proyek baru, melihat daftar papan, memperbarui judul, serta menghapus papan proyek yang dimiliki.
- **Kolaborasi Tim (Board Members)**: Pemilik papan dapat mengundang dan menambahkan pengguna lain ke dalam papan proyek berdasarkan ID pengguna untuk kolaborasi kerja secara bersama-sama.
- **Manajemen Daftar Kategori (Lists)**: Membuat daftar pengelompokan tugas di dalam papan proyek, serta menghapus daftar tersebut jika sudah selesai digunakan.
- **Interaktif Drag & Drop (List & Card)**: Menggeser urutan posisi daftar (*list*) atau memindahkan kartu tugas (*card*) antar-kategori dengan mulus menggunakan pustaka `@dnd-kit/sortable`. Perubahan susunan posisi ini akan langsung disimpan secara permanen ke dalam *database*.
- **Manajemen Kartu Tugas (Cards)**: Membuat kartu tugas baru, mengubah rincian detail kartu, menetapkan penanggung jawab (*assignee*), serta menghapus kartu tugas.
- **Sistem Lampiran Berkas (Card Attachments)**: Mengunggah berkas gambar atau dokumen berkas (*file attachment*) langsung ke dalam kartu tugas tertentu melalui *controller* terisolasi, serta menghapusnya kapan saja dari penyimpanan lokal server.

---

## Teknologi yang Digunakan

### Frontend (`/frontend-project-management`)
- **Library Utama**: React.js 19 (menggunakan *build tool* modern Vite v7)
- **Komponen Antarmuka**: Material-UI (MUI) v7 untuk membangun desain UI yang responsif, konsisten, dan mempercepat proses pengembangan.
- **State Management & Context**: React Context API (`DetailProjectContext`, `SnackbarContext`, dll) untuk distribusi data antar-komponen yang efisien.
- **Data Fetching & API**: Axios dengan konfigurasi *interceptor* otomatis untuk menyematkan *Bearer Token* JWT.
- **Form Handling & Validation**: React Hook Form bersama dengan Yup Validator.
- **Drag & Drop Engine**: Pustaka `@dnd-kit/core` dan `@dnd-kit/sortable`.
- **Visualisasi Data**: Recharts untuk menampilkan grafik *workload* dan *task percentage* di Dashboard.

### Backend (`/project-management`)
- **Bahasa Pemrograman**: Go (Golang)
- **Framework Web**: Go Fiber v2 (RESTful API Server)
- **ORM (Object Relational Mapping)**: GORM (`gorm.io/gorm`) untuk interaksi dan pengelolaan *query* secara aman.
- **Database**: PostgreSQL (menggunakan *driver* `gorm.io/driver/postgres`).
- **Pustaka Pihak Ketiga Tambahan**:
  - `github.com/golang-jwt/jwt/v5` untuk pembuatan dan verifikasi klaim token otentikasi.
  - `golang.org/x/crypto` untuk enkripsi (*hashing*) kata sandi menggunakan Bcrypt.
  - `github.com/google/uuid` untuk pembuatan ID unik berskala global (UUID).
  - `github.com/jinzhu/copier` untuk otomatisasi pemetaan data dari model entitas ke objek *response*.
  - `github.com/joho/godotenv` untuk pemuatan variabel lingkungan (*environment*).

---

## 📂 Struktur Repositori

Struktur direktori proyek dirancang secara teratur dengan pendekatan Monorepo sebagai berikut:

```text
📦 project-management (Root Folder Utama)
 ┣ 📂 frontend                         # Aplikasi client berbasis React, Vite, & MUI
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components                   # Komponen UI/UX, Tata Letak (Layout), dan Modals
 ┃ ┃ ┣ 📂 services                     # Handler komunikasi API terintegrasi Axios
 ┃ ┃ ┗ 📂 utils                        # Fungsi utilitas (manajemen sesi, network, datetime)
 ┃ ┗ 📜 package.json                   # Dependensi pustaka Node.js
 ┣ 📂 backend                          # Aplikasi RESTful API Server berbasis Go (Golang)
 ┃ ┣ 📂 config                         # Pengaturan environment berkas dan koneksi database
 ┃ ┣ 📂 controllers                    # Handler HTTP untuk memproses request & response API
 ┃ ┣ 📂 database                       # Direktori berkas migrations SQL dan seeder data admin
 ┃ ┣ 📂 models                         # Definisi struktur data objek entitas tabel database
 ┃ ┣ 📂 repositories                   # Penulisan query database mentah menggunakan GORM
 ┃ ┣ 📂 routes                         # Registrasi pemetaan jalur endpoint API aplikasi
 ┃ ┣ 📂 services                       # Implementasi logika bisnis inti dari aplikasi
 ┃ ┣ 📂 utils                          # Generator JWT token, hashing password, dan format JSON
 ┃ ┣ 📂 public/files                   # Folder lokal penyimpanan berkas unggahan attachment
 ┃ ┗ 📜 main.go                        # Titik masuk utama (entry point) aplikasi Go
 ┣ 📜 .gitignore                       # Konfigurasi pengabaian berkas Git di tingkat root
 ┗ 📜 README.md                        # Dokumentasi utama proyek ini
