package middlewares

import (
	"login-backend/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(c *gin.Context) {
	token := c.Request.Header.Get("Authorization")

	if token == "" {
		utils.AbortWithStatusJSON(c)	
		return
	}

	err := utils.VerifyToken(token)
	if err != nil {
		utils.AbortWithStatusJSON(c)	
		return
	}

	c.Next()
}