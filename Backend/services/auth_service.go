package services

import (
	"Backend/helpers"
	"Backend/repositories/interfaces"
	"context"
	"errors"
	// "fmt"
	"os"
	"fmt"
	"google.golang.org/api/idtoken"
)

// AuthService interface
type AuthService interface {
	Login(idToken string) (string, error)
}

// authServiceImpl adalah struct yang mengimplementasikan AuthService interface
type authServiceImpl struct {
	authRepo interfaces.AuthRepository
}

// NewAuthService adalah constructor untuk authServiceImpl yang mengimplementasikan AuthService interface
func NewAuthService(repo interfaces.AuthRepository) AuthService {
	return &authServiceImpl{authRepo: repo}
}

// Login melakukan login dengan Google ID token
func (s *authServiceImpl) Login(idToken string) (string, error) {
	// Verifikasi ID token menggunakan Google API
	audience := os.Getenv("GOOGLE_CLIENT_ID") // Client ID dari Google API
	payload, err := verifyGoogleToken(idToken, audience)
	if err != nil {
		return "", err // Invalid ID token
	}

	// Mendapatkan informasi user dari ID token (misalnya email, sub, dll)
	googleID, ok := payload.Claims["sub"].(string)
	if !ok {
		return "", errors.New("user ID not found in Google token")
	}
	email, ok := payload.Claims["email"].(string)
	if !ok {
		return "", errors.New("email not found in Google token")
	}

	// Cari / tambah user di database
	user, err := s.authRepo.FindOrCreateUser(googleID, email) // Gunakan s.authRepo
	if err != nil {
		return "", err // Error saat mencari atau menyimpan user
	}

	// Buat JWT token untuk user jika login berhasil
	jwtToken, err := helpers.CreateJWT(user.GoogleID, email)

	fmt.Println("jwt token: ", jwtToken + " | err: ", err)
	if err != nil {
		return "", errors.New("failed to create JWT")
	}

	return jwtToken, nil
}

// verifyGoogleToken untuk memvalidasi ID token dari Google
func verifyGoogleToken(idToken, audience string) (*idtoken.Payload, error) {
	// Verifikasi ID token dengan Google API
	payload, err := idtoken.Validate(context.Background(), idToken, audience)
	if err != nil {
		return nil, errors.New("invalid Google ID token")
	}
	return payload, nil
}
