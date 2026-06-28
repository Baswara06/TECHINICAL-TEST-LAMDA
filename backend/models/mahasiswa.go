package models

type Mahasiswa struct {
	ID          int    `json:"id"`
	Nama        string `json:"nama"`
	Umur        int    `json:"umur"`
	NIM         string `json:"nim"`
	TglLahir    string `json:"tgl_lahir"`
	Alamat      string `json:"alamat"`
	IDJurusan   int    `json:"id_jurusan"`
	NamaJurusan string `json:"nama_jurusan,omitempty"`
	Fakultas    string `json:"fakultas,omitempty"`
	Jenjang     string `json:"jenjang,omitempty"`
}

type Jurusan struct {
	IDJurusan   int    `json:"id_jurusan"`
	NamaJurusan string `json:"nama_jurusan"`
	Fakultas    string `json:"fakultas"`
	Jenjang     string `json:"jenjang"`
}

type MahasiswaInput struct {
	Nama        string `json:"nama"         binding:"required"`
	Umur        int    `json:"umur"         binding:"required,min=1"`
	NIM         string `json:"nim"          binding:"required"`
	TglLahir    string `json:"tgl_lahir"    binding:"required"`
	Alamat      string `json:"alamat"       binding:"required"`
	NamaJurusan string `json:"nama_jurusan" binding:"required"`
	Fakultas    string `json:"fakultas"     binding:"required"`
	Jenjang     string `json:"jenjang"      binding:"required"`
}