package main

import (
	"login-backend/database"
	"login-backend/routes"
	"regexp"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func main() {
	database.ConnectDB()

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("usernameSpecial", validateUsernameSpecial)
	}

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

func validateUsernameSpecial(fl validator.FieldLevel) bool {
	username := fl.Field().String()
	specialCharPattern := `[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]`
	matched, _ := regexp.MatchString(specialCharPattern, username)
	return matched
}
