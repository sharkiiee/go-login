package controllers

import (
	"fmt"
	"login-backend/models"
	"net/http"
	"github.com/gin-gonic/gin"
)

func ForgetPasswordController(c *gin.Context) {
	var input struct {
		Username    string `json:"username" binding:"required"`
		NewPassword string `json:"newPassword" binding:"required,min=8"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Println("Binding error:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid input: username and new password are required and new password must be at least 8 characters long",
		})
		return
	}

	fmt.Printf("Received: username=%s, newPassword length=%d\n", input.Username, len(input.NewPassword))

	err := models.UpdatePassword(input.Username, input.NewPassword)
	if err != nil {
		fmt.Println("Update password error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password updated successfully",
	})
}
