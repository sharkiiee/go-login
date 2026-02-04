package routes

import (
	"login-backend/controllers"
	"login-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(server *gin.Engine) {
	admin := server.Group("/admin")

	admin.POST("/login", controllers.LoginHandler)
	admin.POST("/signup", controllers.SignupHandler)
	admin.POST("/forget-password",controllers.ForgetPasswordController)

	protected := admin.Group("")
	protected.Use(middlewares.AuthMiddleware)
	{
		protected.POST("/addpost", controllers.AddPostHandler)
		protected.GET("/getposts", controllers.GetPostsHandler)
		protected.PUT("/updatepost", controllers.UpdatePostHandler)
		protected.DELETE("/deletepost", controllers.DeletePostHandler)
		protected.GET("/verify", controllers.DashboardHandler)
	}
}
