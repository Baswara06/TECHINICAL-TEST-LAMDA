# Aplikasi 1 - React + Go + PostgreSQL + Docker

## Identitas
- **Nama**: Raihan Wendra Baswara
- **Branch**: soal-1

## Deskripsi
Aplikasi web CRUD mahasiswa dengan arsitektur REST API. Frontend React hanya berfungsi sebagai consumer API dan tidak ada query database di sisi frontend.

## Teknologi yang Digunakan
- **Frontend**: React (Vite), Axios
- **Backend**: Go 1.21, Gin Framework
- **Database**: PostgreSQL 15
- **API Docs**: Swagger (swaggo)
- **Deployment**: Docker, Docker Compose

## Struktur Project
```bash
mahasiswa-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/     ← semua akses API ada di sini
│   └── Dockerfile
├── backend/
│   ├── handlers/
│   ├── models/
│   ├── routes/
│   ├── database/
│   ├── main.go
│   └── Dockerfile
├── database/
│   └── init.sql
└── docker-compose.yml
```

## Cara Menjalankan
```bash
docker-compose up --build
```

### Akses Aplikasi
|   Service   |                     URL                  |
|-----------  |------------------------------------------|
| Frontend    | http://localhost:3000                    |
| Backend API | http://localhost:8080/api                |
| Swagger UI  | http://localhost:8080/swagger/index.html |

## Endpoint API (akan diupdate setelah projek selesai)

| Method | Endpoint | Deskripsi                            |
|--------|----------|--------------------------------------|
| GET    | /api/mahasiswa | Ambil semua mahasiswa          |
| GET    | /api/mahasiswa?search=nama | Search mahasiswa   |
| GET    | /api/mahasiswa/:id | Ambil mahasiswa by ID      |
| POST   | /api/mahasiswa | Tambah mahasiswa               |
| PUT    | /api/mahasiswa/:id | Update mahasiswa           |
| DELETE | /api/mahasiswa/:id | Hapus mahasiswa            |
| GET    | /api/jurusan | Ambil semua jurusan              |

## Database

```sql
-- Tabel utama
CREATE TABLE jurusan (
    id_jurusan SERIAL PRIMARY KEY,
    nama_jurusan VARCHAR(100),
    fakultas VARCHAR(100),
    jenjang VARCHAR(20)
);

CREATE TABLE mahasiswa (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100),
    umur INT,
    nim VARCHAR(20) UNIQUE,
    tgl_lahir DATE,
    alamat TEXT,
    id_jurusan INT REFERENCES jurusan(id_jurusan)
);
```

## Aturan Pengembangan yang Diterapkan
- Tidak ada query database di sisi frontend
- Frontend hanya akses data melalui endpoint API
- Semua service di-deploy via Docker