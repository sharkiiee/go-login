package routes

import (
	"login-backend/controllers"

	"github.com/gin-gonic/gin"
)

func ProtectedRoutes(server *gin.Engine) {
	api := server.Group("/protected")
	{
		api.GET("/dashboard", controllers.DashboardHandler)
	}
}