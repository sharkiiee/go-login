package utils

import (
	"errors"
	"login-backend/database"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const secretKey = "sarthak123"

func GenerateToken(username string, userID int64, role string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID":   userID,
		"username": username,
		"role":     role,
		"exp":      time.Now().Add(time.Hour * 2).Unix(),
	})
	return token.SignedString([]byte(secretKey))
}

func VerifyToken(tokenString string) error {
	parsedToken, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Unexpected signing method")
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		return errors.New("Could not parse token.")
	}

	tokenIsValid := parsedToken.Valid
	if !tokenIsValid {
		return errors.New("Invalid token")
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)

	if !ok {
		return errors.New("Invalid claims")
	}

	userID := int64(claims["userID"].(float64))
	username := claims["username"].(string)
	role := claims["role"].(string)

	query := "SELECT username, role FROM users WHERE id = ?"
	var dbUsername, dbRole string
	err = database.DB.QueryRow(query, userID).Scan(&dbUsername, &dbRole)

	if err != nil {
		return errors.New("User not found in database")
	}

	if dbUsername != username || dbRole != role {
		return errors.New("Token credentials do not match database records")
	}

	return nil
}
