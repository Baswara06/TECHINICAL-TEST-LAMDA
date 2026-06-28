package routes

import (
	"mahasiswa-backend/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// reset 
		api.DELETE("/mahasiswa/reset", handlers.ResetAllMahasiswa)

		// Mahasiswa CRUD
		api.GET("/mahasiswa", handlers.GetAllMahasiswa)
		api.GET("/mahasiswa/:id", handlers.GetMahasiswaByID)
		api.POST("/mahasiswa", handlers.CreateMahasiswa)
		api.PUT("/mahasiswa/:id", handlers.UpdateMahasiswa)
		api.DELETE("/mahasiswa/:id", handlers.DeleteMahasiswa)

		// Jurusan
		api.GET("/jurusan", handlers.GetAllJurusan)
	}
}