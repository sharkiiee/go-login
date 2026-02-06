package models

import (
	"crypto/rand"
	"fmt"
	"login-backend/database"
	"login-backend/utils"
	"math/big"
	"time"
)

type SignupInput struct {
	ID        int64
	Username  string     `json:"username" binding:"required,min=1,usernameSpecial"`
	Password  string     `json:"password" binding:"required,min=8"`
	Role      string     `json:"role" binding:"required"`
	OTP       string     `json:"otp"`
	ExpireOtp *time.Time `json:"expireOtp"`
}

func GenerateOTP() string {
	max := big.NewInt(1000000)

	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return ""
	}

	return fmt.Sprintf("%06d", n.Int64())
}

func (u *SignupInput) Save() error {
	query := "INSERT INTO users (username, password, role) VALUES (?, ?, ?)"

	stmt, err := database.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	hashedPassword, err := utils.HashPassword(u.Password)
	if err != nil {
		return err
	}

	result, err := stmt.Exec(u.Username, hashedPassword, u.Role)
	if err != nil {
		return err
	}

	userId, err := result.LastInsertId()
	if err != nil {
		return err
	}
	u.ID = userId
	return nil
}

func SendOTP(username string) error {
	exists, err := GetUserByUsername(username)
	if err != nil {
		return err
	}

	if !exists {
		return fmt.Errorf("user not found")
	}

	otp := GenerateOTP()
	expireTime := time.Now().Add(10 * time.Minute)

	query := "UPDATE users SET otp = ?, expireOtp = ? WHERE username = ?"

	_, err = database.DB.Exec(query, otp, expireTime, username)
	return err
}


func GetUserByUsername(username string) (bool, error) {
	query := "SELECT id FROM users WHERE username = ?"

	var id int64
	err := database.DB.QueryRow(query, username).Scan(&id)

	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return false, nil
		}
		return false, err
	}

	return true, nil
}
