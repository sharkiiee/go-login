package routes

import (
	"login-backend/controllers"
	"login-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func UserRoutes(server *gin.Engine) {
	user := server.Group("/")
	{
		user.POST("/login", controllers.LoginHandler)
		user.POST("/signup", controllers.SignupHandler)
		user.POST("/verifyotp", controllers.OtpController)
		user.POST("/forget-password", controllers.ForgetPasswordController)
		user.GET("/verify", middlewares.AuthMiddleware, controllers.DashboardHandler)
	}
}
