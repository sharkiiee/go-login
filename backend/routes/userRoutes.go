package routes

import (
	"login-backend/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoutes(server *gin.Engine) {
	user := server.Group("/")
	{
		user.POST("/login", controllers.LoginHandler)
		user.POST("/signup", controllers.SignupHandler)
	}
}