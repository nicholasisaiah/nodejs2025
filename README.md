# nodejs2025
Latihan js2025

# Dokumentasi Proyek Website Stopwatch Countdown

## 1. Pendahuluan
Website Stopwatch Countdown adalah aplikasi web yang menyediakan fitur stopwatch, countdown timer, dan jam dunia digital. Aplikasi ini mendukung manajemen pengguna, autentikasi, serta peran admin untuk pengelolaan data. Dikembangkan menggunakan teknologi full-stack JavaScript dengan pendekatan REST API.

---

## 2. Teknologi yang Digunakan
- **Backend**: Node.js, Express.js
- **Frontend**: CSS, JavaScript, EJS
- **Database**: MongoDB
- **Autentikasi**: JWT (JSON Web Token)
- **Middleware**: cookie-parser, dotenv, method-override

---

## 3. Panduan Instalasi
### Prasyarat
- Node.js & npm
- MongoDB lokal atau MongoDB Atlas

### Langkah Instalasi
1. Clone repositori:
   ```bash
   git clone <https://github.com/nicholasisaiah/nodejs2025>
   cd <folder_proyek>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env` dan isi:
   ```env
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=mongodb://localhost:27017/stopwatchdb
   ```

4. Jalankan server:
   ```bash
   nodemon src/index.js
   ```

5. Akses di browser:
   ```
   http://localhost:3000
   ```

---

## 4. Panduan Penggunaan
### Untuk Pengguna
- **Registrasi**: Daftar dengan username dan password yang memenuhi aturan keamanan.
- **Login**: Masuk dengan kredensial yang terdaftar.
- **Stopwatch**: Klik "Mulai" untuk memulai stopwatch, "Lap" untuk mencatat waktu, dan "Reset" untuk mengulang.
- **Countdown**: Pilih durasi preset atau masukkan waktu secara manual.
- **Riwayat**: Lihat catatan waktu yang tersimpan di halaman history.

### Untuk Admin
- Akses halaman admin melalui `/admin-page`.
- Kelola pengguna (ubah role, edit username, hapus akun).
- Kelola data stopwatch (ubah label, hapus record).

---

## 5. API Endpoint
### Autentikasi
| Method | Endpoint             | Deskripsi              |
|--------|----------------------|------------------------|
| POST   | `/api/auth/register` | Registrasi user        |
| POST   | `/api/auth/login`    | Login user             |
| POST   | `/api/auth/logout`   | Logout user            |

### User
| Method | Endpoint                          | Deskripsi            |
|--------|-----------------------------------|----------------------|
| POST   | `/admin/user/update/:id`          | Ubah role user       |
| POST   | `/admin/user/delete/:id`          | Hapus user           |
| POST   | `/admin/user/update-username/:id` | Ubah username        |

### Record / Stopwatch / Countdown
| Method | Endpoint                     | Deskripsi                             |
|--------|------------------------------|---------------------------------------|
| POST   | `/api/records`               | Simpan data waktu stopwatch/countdown |
| GET    | `/api/records`               | Ambil seluruh riwayat pengguna        |
| DELETE | `/api/records/:id`           | Hapus record                          |
| POST   | `/admin/record/label/:id`    | Ubah label record (admin)             |

---

## 6. Struktur Folder (Contoh)
```
StopwatchCountdownApp/
├── public/                      # File statis seperti CSS, JS, dan gambar
│   ├── img/                    # Gambar latar/background
│   ├── app.js                  # Script utama stopwatch & countdown (frontend)
│   ├── style.css               # Style umum
│   ├── styleabout.css          # Style halaman about
│   └── stylehome.css           # Style halaman home
│
├── src/                        # Folder source utama (backend logic)
│   ├── config/                 # Konfigurasi seperti koneksi database
│   │   └── dbConnect.js
│   │
│   ├── controllers/            # Logika utama dari route (controller)
│   │   ├── adminController.js
│   │   └── authController.js
│   │
│   ├── middlewares/           # Middleware untuk otentikasi dan role
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/                 # Model mongoose untuk MongoDB
│   │   ├── recordModel.js
│   │   └── userModel.js
│   │
│   ├── routes/                 # Definisi rute aplikasi (API endpoint)
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── index.js            # Entry point server
│
├── views/                      # Template HTML berbasis EJS
│   ├── partials/               # Komponen template yang dapat digunakan ulang
│   │   ├── header.ejs
│   │   ├── header2.ejs
│   │   └── header3.ejs
│   │
│   ├── about.ejs               # Halaman about
│   ├── admin.ejs               # Halaman admin (manajemen user & data)
│   ├── history.ejs             # Halaman riwayat penggunaan stopwatch/countdown
│   ├── home.ejs                # Halaman utama stopwatch & countdown
│   ├── login.ejs               # Halaman login
│   └── signup.ejs              # Halaman pendaftaran
│
├── .env                        # File environment untuk menyimpan variabel sensitif
├── .gitignore                  # File untuk mengabaikan file di Git
├── LICENSE                     # Lisensi project
├── package.json                # Informasi dan dependensi project
├── package-lock.json           # Lock file dependensi
├── README.md                   # Dokumentasi utama proyek
└── vercel.json                 # Konfigurasi untuk deployment di Vercel (jika digunakan)
```

---

## 7. Penutup
Proyek ini diharapkan memberikan solusi praktis bagi pengguna dalam mencatat dan mengelola waktu aktivitas secara digital. Penggunaan REST API dan arsitektur yang modular memudahkan pengembangan lebih lanjut di masa depan.

Jika ingin deploy ke platform seperti Render atau Vercel, pastikan environment variable dan koneksi database sudah disesuaikan.

