package routes

import (
	"login-backend/controllers"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(server *gin.Engine) {
	admin := server.Group("/admin")
	{
		admin.POST("/login", controllers.LoginHandler)

		admin.POST("/signup", controllers.SignupHandler)

		admin.POST("/addpost", controllers.AddPostHandler)

		admin.GET("/getposts", controllers.GetPostsHandler)

		admin.PUT("/updatepost", controllers.UpdatePostHandler)

		admin.DELETE("/deletepost", controllers.DeletePostHandler)
	}
}