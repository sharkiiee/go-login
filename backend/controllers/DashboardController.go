package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func DashboardHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Welcome to the Dashboard!",
	})
}