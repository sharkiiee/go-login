package controllers

import (
	"login-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddPostHandler(c *gin.Context) {
	var post models.Post

	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"message": "values is not in proper json format",
		})
		return
	}

	err := post.Save()
	if err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(201, gin.H{
		"success": true,
		"message": "Post added successfully",
	})
}

func UpdatePostHandler(c *gin.Context) {
	var post models.Post

	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"message": "Invalid JSON format",
		})
		return
	}

	if post.ID == 0 {
		c.JSON(400, gin.H{
			"success": false,
			"message": "Post ID is required",
		})
		return
	}

	err := post.Update()
	if err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"message": "Post updated successfully",
	})
}

func DeletePostHandler(c *gin.Context) {
	var request struct {
		ID int64 `json:"id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"message": "Invalid JSON format or missing ID",
		})
		return
	}

	err := models.DeletePost(request.ID)
	if err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"message": "Post deleted successfully",
	})
}

func GetPostsHandler(c *gin.Context) {
	posts, err := models.GetAllPosts()
	if err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"message": "Failed to retrieve posts",
		})
		return
	}

	c.JSON(http.StatusOK, posts)
}
