package utils

import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {

	// taking password and cost 14
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)

	// converting bytes slice to string
	return string(bytes),err
}

func CheckPasswordHash(password, hashedPassword string) bool {
	// comparing password with hash
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}