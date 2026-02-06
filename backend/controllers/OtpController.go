package controllers

import (
	"login-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func OtpController(c *gin.Context) {
	var otpInput struct {
		Username string `json:"username" binding:"required"`
		OTP      string `json:"otp" binding:"required"`
	}

	if err := c.ShouldBindJSON(&otpInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid input: username and OTP are required",
		})
		return
	}


	isValid, err := models.VerifyOTP(otpInput.Username, otpInput.OTP)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	if !isValid {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid OTP",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "OTP verified successfully",
	})
}

func SendOtpController(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid input: username is required",
		})
		return
	}

	err := models.SendOTP(input.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "OTP sent successfully",
	})
}
