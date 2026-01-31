package controllers

import (
	"net/http"

	"login-backend/models"

	"github.com/gin-gonic/gin"
)

func SignupHandler(c *gin.Context) {

	var user models.SignupInput

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"message": "Invalid Input",
		})
		return
	}

	if user.Username == "" || user.Password == "" {
		c.JSON(400, gin.H{
			"success": false,
			"message": "Username and Password cannot be empty",
		})
		return
	}

	userExists, err := models.GetUserByUsername(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Error checking user existence",
		})
		return
	}

	if userExists {
		c.JSON(http.StatusConflict, gin.H{
			"success": false,
			"message": "User already exists",
		})
		return
	}

	err = user.Save()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(201, gin.H{
		"success": true,
		"message": "User created successfully",
	})
}
