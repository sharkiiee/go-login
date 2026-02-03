package controllers

import (
	"login-backend/models"
	"login-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LoginHandler(c *gin.Context) {
	var user models.LoginInput

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := user.ValidateCredentials()

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false, "message": "Invalid username or password",})
		return
	}

	token, err := utils.GenerateToken(user.Username, user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Internal Server Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"token":    token,
		"message":  "Login Successful",
		"user_id":  user.ID,
		"username": user.Username,
		"role":     user.Role,
	})
}
