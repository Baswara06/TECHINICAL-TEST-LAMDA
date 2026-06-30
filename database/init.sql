CREATE TABLE IF NOT EXISTS jurusan (
    id_jurusan SERIAL PRIMARY KEY,
    nama_jurusan VARCHAR(100) NOT NULL,
    fakultas VARCHAR(100) NOT NULL,
    jenjang VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS mahasiswa (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    umur INT NOT NULL,
    nim VARCHAR(20) UNIQUE NOT NULL,
    tgl_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    id_jurusan INT REFERENCES jurusan(id_jurusan)
);