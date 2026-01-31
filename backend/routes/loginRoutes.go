package routes

import (
	"login-backend/controllers"

	"github.com/gin-gonic/gin"
)

func LoginRoutes(server *gin.Engine) {
	api := server.Group("/login")
	{
		api.POST("", controllers.LoginHandler)
	}
}