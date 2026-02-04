package models

import (
	"errors"
	"login-backend/database"
	"login-backend/utils"
)

type LoginInput struct {
	ID       int64
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Role string
	OTP string `json:"otp"`
}

func (u *LoginInput) ValidateCredentials() error {
	query := "SELECT id, password FROM users WHERE username = ? AND role = ?"

	row := database.DB.QueryRow(query, u.Username, u.Role)

	var retrievedPassword string

	err := row.Scan(&u.ID, &retrievedPassword)

	if err != nil {
		return err
	}

	passwordValid := utils.CheckPasswordHash(u.Password, retrievedPassword)

	if !passwordValid {
		return errors.New("Credentials Invalid")
	}
	return nil
}
