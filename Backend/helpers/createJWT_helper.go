package helpers

import (
	"errors"
	// "fmt"
	"os"
	"time"
	"github.com/joho/godotenv"
	"github.com/golang-jwt/jwt/v5"
)

func CreateJWT(googleID, email string) (string, error) {
	godotenv.Load()
	jwtSecret := os.Getenv("JWT_SECRET_KEY")
	location, err := time.LoadLocation("Asia/Jakarta")
	if jwtSecret == "" {
		return "", errors.New("JWT_SECRET is not set in the environment")
	}

	currentTime := time.Now().In(location)

	// Buat klaim yang akan dimasukkan ke dalam token
	claims := jwt.MapClaims{
		"sub":   googleID,                   
		"email": email,                      
		"exp":   currentTime.Add(time.Hour * 24 * 3).Unix(),
		"iat":   currentTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	jwtToken, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}

	return jwtToken, nil
}
