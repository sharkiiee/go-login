package models

import (
	"database/sql"
	"errors"
	"login-backend/database"
	"login-backend/utils"
)

type OTPData struct {
	Username string
	OTP      string
}

func VerifyOTP(username string, otp string) (bool, error) {
	if username == "" || otp == "" {
		return false, errors.New("username and OTP are required")
	}

	query := "SELECT otp FROM users WHERE username = ?"

	var storedOTP string
	err := database.DB.QueryRow(query, username).Scan(&storedOTP)

	if err != nil {
		if err == sql.ErrNoRows {
			return false, errors.New("user not found")
		}
		return false, err
	}

	if storedOTP != otp {
		return false, nil
	}

	return true, nil
}

// UpdatePassword updates the password for a user
func UpdatePassword(username string, newPassword string) error {
	if username == "" || newPassword == "" {
		return errors.New("username and password are required")
	}

	// Hash the new password
	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}

	query := "UPDATE users SET password = ? WHERE username = ?"

	result, err := database.DB.Exec(query, hashedPassword, username)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}
