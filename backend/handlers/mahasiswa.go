package handlers

import (
	"mahasiswa-backend/database"
	"mahasiswa-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetAllMahasiswa godoc
// @Summary Ambil semua mahasiswa
// @Description Mengambil seluruh data mahasiswa
// @Tags Mahasiswa
// @Accept json
// @Produce json
// @Param search query string false "Cari berdasarkan nama atau NIM"
// @Success 200 {array} models.Mahasiswa
// @Failure 500 {object} map[string]string
// @Router /api/mahasiswa [get]
// GET /api/mahasiswa?search=xxx
func GetAllMahasiswa(c *gin.Context) {
	search := c.Query("search")

	query := `
		SELECT m.id, m.nama, m.umur, m.nim,
		       TO_CHAR(m.tgl_lahir, 'YYYY-MM-DD'),
		       m.alamat, m.id_jurusan,
		       j.nama_jurusan, j.fakultas, j.jenjang
		FROM mahasiswa m
		LEFT JOIN jurusan j ON m.id_jurusan = j.id_jurusan
	`
	args := []interface{}{}
	if search != "" {
		query += " WHERE m.nama ILIKE $1 OR m.nim ILIKE $1"
		args = append(args, "%"+search+"%")
	}
	query += " ORDER BY m.id ASC"

	rows, err := database.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var list []models.Mahasiswa
	for rows.Next() {
		var m models.Mahasiswa
		rows.Scan(
			&m.ID, &m.Nama, &m.Umur, &m.NIM,
			&m.TglLahir, &m.Alamat, &m.IDJurusan,
			&m.NamaJurusan, &m.Fakultas, &m.Jenjang,
		)
		list = append(list, m)
	}

	if list == nil {
		list = []models.Mahasiswa{}
	}

	c.JSON(http.StatusOK, list)
}

// GetMahasiswaByID godoc
// @Summary Ambil mahasiswa berdasarkan ID
// @Tags Mahasiswa
// @Produce json
// @Param id path int true "ID Mahasiswa"
// @Success 200 {object} models.Mahasiswa
// @Failure 404 {object} map[string]string
// @Router /api/mahasiswa/{id} [get]
// GET /api/mahasiswa/:id
func GetMahasiswaByID(c *gin.Context) {
	id := c.Param("id")
	var m models.Mahasiswa

	err := database.DB.QueryRow(`
		SELECT m.id, m.nama, m.umur, m.nim,
		       TO_CHAR(m.tgl_lahir, 'YYYY-MM-DD'),
		       m.alamat, m.id_jurusan,
		       j.nama_jurusan, j.fakultas, j.jenjang
		FROM mahasiswa m
		LEFT JOIN jurusan j ON m.id_jurusan = j.id_jurusan
		WHERE m.id = $1`, id).
		Scan(
			&m.ID, &m.Nama, &m.Umur, &m.NIM,
			&m.TglLahir, &m.Alamat, &m.IDJurusan,
			&m.NamaJurusan, &m.Fakultas, &m.Jenjang,
		)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mahasiswa tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, m)
}


// CreateMahasiswa godoc
// @Summary Tambah mahasiswa
// @Tags Mahasiswa
// @Accept json
// @Produce json
// @Param mahasiswa body models.MahasiswaInput true "Data Mahasiswa"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Router /api/mahasiswa [post]
// POST /api/mahasiswa
func CreateMahasiswa(c *gin.Context) {
	var input models.MahasiswaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cek apakah jurusan sudah ada
	var idJurusan int
	err := database.DB.QueryRow(`
		SELECT id_jurusan FROM jurusan
		WHERE LOWER(nama_jurusan) = LOWER($1)
		  AND LOWER(fakultas) = LOWER($2)
		  AND LOWER(jenjang) = LOWER($3)`,
		input.NamaJurusan, input.Fakultas, input.Jenjang,
	).Scan(&idJurusan)

	// Kalau belum ada, insert jurusan baru
	if err != nil {
		err = database.DB.QueryRow(`
			INSERT INTO jurusan (nama_jurusan, fakultas, jenjang)
			VALUES ($1, $2, $3)
			RETURNING id_jurusan`,
			input.NamaJurusan, input.Fakultas, input.Jenjang,
		).Scan(&idJurusan)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan jurusan: " + err.Error()})
			return
		}
	}

	// Insert mahasiswa
	var id int
	err = database.DB.QueryRow(`
		INSERT INTO mahasiswa (nama, umur, nim, tgl_lahir, alamat, id_jurusan)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id`,
		input.Nama, input.Umur, input.NIM,
		input.TglLahir, input.Alamat, idJurusan,
	).Scan(&id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Mahasiswa berhasil ditambahkan",
		"id":      id,
	})
}


// UpdateMahasiswa godoc
// @Summary Update mahasiswa
// @Tags Mahasiswa
// @Accept json
// @Produce json
// @Param id path int true "ID Mahasiswa"
// @Param mahasiswa body models.MahasiswaInput true "Data Mahasiswa"
// @Success 200 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/mahasiswa/{id} [put]
// PUT /api/mahasiswa/:id
func UpdateMahasiswa(c *gin.Context) {
	id := c.Param("id")
	var input models.MahasiswaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cek atau buat jurusan
	var idJurusan int
	err := database.DB.QueryRow(`
		SELECT id_jurusan FROM jurusan
		WHERE LOWER(nama_jurusan) = LOWER($1)
		  AND LOWER(fakultas) = LOWER($2)
		  AND LOWER(jenjang) = LOWER($3)`,
		input.NamaJurusan, input.Fakultas, input.Jenjang,
	).Scan(&idJurusan)

	if err != nil {
		err = database.DB.QueryRow(`
			INSERT INTO jurusan (nama_jurusan, fakultas, jenjang)
			VALUES ($1, $2, $3)
			RETURNING id_jurusan`,
			input.NamaJurusan, input.Fakultas, input.Jenjang,
		).Scan(&idJurusan)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan jurusan: " + err.Error()})
			return
		}
	}

	// Update mahasiswa
	result, err := database.DB.Exec(`
		UPDATE mahasiswa
		SET nama=$1, umur=$2, nim=$3, tgl_lahir=$4, alamat=$5, id_jurusan=$6
		WHERE id=$7`,
		input.Nama, input.Umur, input.NIM,
		input.TglLahir, input.Alamat, idJurusan, id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mahasiswa tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data berhasil diperbarui"})
}


// DeleteMahasiswa godoc
// @Summary Hapus mahasiswa
// @Tags Mahasiswa
// @Produce json
// @Param id path int true "ID Mahasiswa"
// @Success 200 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/mahasiswa/{id} [delete]
// DELETE /api/mahasiswa/:id
func DeleteMahasiswa(c *gin.Context) {
	id := c.Param("id")

	result, err := database.DB.Exec("DELETE FROM mahasiswa WHERE id=$1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mahasiswa tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data berhasil dihapus"})
}


// ResetAllMahasiswa godoc
// @Summary Hapus semua mahasiswa
// @Tags Mahasiswa
// @Produce json
// @Success 200 {object} map[string]string
// @Router /api/mahasiswa/reset [delete]
// DELETE /api/mahasiswa/reset - Hapus semua data mahasiswa
func ResetAllMahasiswa(c *gin.Context) {
	_, err := database.DB.Exec("DELETE FROM mahasiswa")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Reset auto increment ID biar mulai dari 1 lagi
	_, err = database.DB.Exec("ALTER SEQUENCE mahasiswa_id_seq RESTART WITH 1")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Semua data mahasiswa berhasil dihapus"})
}