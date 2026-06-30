// @title Mahasiswa REST API
// @version 1.0
// @description REST API Technical Test Lambda
// @host localhost:8080
// @BasePath /

package main

import (
	"log"
	"mahasiswa-backend/database"
	"mahasiswa-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "mahasiswa-backend/docs"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  .env tidak ditemukan, pakai environment variable sistem")
	}

	// Koneksi database
	database.Connect()

	// Setup Gin
	r := gin.Default()
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	// Routes
	routes.SetupRoutes(r)

	log.Println("Server berjalan di http://localhost:8080")
	log.Fatal(r.Run(":8080"))
}
