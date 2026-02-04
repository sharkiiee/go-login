package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AbortWithStatusJSON(c *gin.Context) {
	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
		"success": false,
		"message": "Unauthorized: Unauthorized access",
	})
}

