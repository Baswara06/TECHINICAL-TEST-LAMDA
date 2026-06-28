package handlers

import (
	"mahasiswa-backend/database"
	"mahasiswa-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /api/jurusan
func GetAllJurusan(c *gin.Context) {
	rows, err := database.DB.Query(`
		SELECT id_jurusan, nama_jurusan, fakultas, jenjang
		FROM jurusan
		ORDER BY id_jurusan ASC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var list []models.Jurusan
	for rows.Next() {
		var j models.Jurusan
		rows.Scan(&j.IDJurusan, &j.NamaJurusan, &j.Fakultas, &j.Jenjang)
		list = append(list, j)
	}

	if list == nil {
		list = []models.Jurusan{}
	}

	c.JSON(http.StatusOK, list)
}