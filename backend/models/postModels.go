package models

import (
	"errors"
	"login-backend/database"
	"time"
)

type Post struct {
	ID          int64      `json:"id"`
	Category    string     `json:"category" binding:"required"`
	Title       string     `json:"title" binding:"required"`
	Description string     `json:"description"`
	CreatedBy   string     `json:"createdBy"`
	DeletedAt   *time.Time `json:"deletedat,omitempty"`
}

func GetAllPosts() ([]Post, error) {
	query := "SELECT id, category, title, description, createdby FROM post WHERE deletedat IS NULL"

	rows, err := database.DB.Query(query)
	if err != nil {
		return nil, errors.New("Failed to execute query")
	}

	defer rows.Close()

	var posts []Post

	for rows.Next() {
		var post Post
		err := rows.Scan(&post.ID, &post.Category, &post.Title, &post.Description, &post.CreatedBy)
		if err != nil {
			return nil, errors.New("Failed to scan row")
		}
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (p *Post) Save() error {
	query := "INSERT INTO post (category, title, description, createdby) VALUES (?, ?, ?, ?)"

	stmt, err := database.DB.Prepare(query)
	if err != nil {
		return errors.New("Query is been not prepared")
	}

	defer stmt.Close()

	result, err := stmt.Exec(p.Category, p.Title, p.Description, p.CreatedBy)

	if err != nil {
		return errors.New("Query is not executed")
	}

	postId, err := result.LastInsertId()
	if err != nil {
		return errors.New("Post ID not found")
	}

	p.ID = postId
	return nil
}

func (p *Post) Update() error {
	query := "UPDATE post SET category = ?, title = ?, description = ?, createdby = ? WHERE id = ?"

	stmt, err := database.DB.Prepare(query)
	if err != nil {
		return errors.New("Failed to prepare update query")
	}

	defer stmt.Close()

	result, err := stmt.Exec(p.Category, p.Title, p.Description, p.CreatedBy, p.ID)
	if err != nil {
		return errors.New("Failed to execute update query")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.New("Failed to get rows affected")
	}

	if rowsAffected == 0 {
		return errors.New("Post not found")
	}

	return nil
}

func DeletePost(id int64) error {
	query := "UPDATE post SET deletedat = ? WHERE id = ? AND deletedat IS NULL"

	stmt, err := database.DB.Prepare(query)
	if err != nil {
		return errors.New("Failed to prepare delete query")
	}

	defer stmt.Close()

	currentTime := time.Now()
	result, err := stmt.Exec(currentTime, id)
	if err != nil {
		return errors.New("Failed to execute delete query")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return errors.New("Failed to get rows affected")
	}

	if rowsAffected == 0 {
		return errors.New("Post not found or already deleted")
	}

	return nil
}
