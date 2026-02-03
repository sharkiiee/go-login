package main

import (
	"login-backend/database"
	"login-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "username", "password"},
		AllowCredentials: true,
	}))

	routes.AdminRoutes(r)
	routes.UserRoutes(r)
	r.Run(":7070")
}
