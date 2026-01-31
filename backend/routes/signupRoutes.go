package routes

import (
	"login-backend/controllers"

	"github.com/gin-gonic/gin"
)

func SignupRoutes(server *gin.Engine) {
	api := server.Group("/signup")
	{
		api.POST("", controllers.SignupHandler)
	}
}
