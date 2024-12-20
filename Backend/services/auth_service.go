package services

import (
	"Backend/helpers"
	"Backend/repositories/interfaces"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"google.golang.org/api/idtoken"
)

type AuthService interface {
	Login(idToken, accessToken string) (string, uint, error)
}

type authServiceImpl struct {
	authRepo interfaces.AuthRepository
}

func NewAuthService(repo interfaces.AuthRepository) AuthService {
	return &authServiceImpl{authRepo: repo}
}

// Login melakukan login dengan Google ID token
func (s *authServiceImpl) Login(idToken, accessToken string) (string, uint, error) {
	godotenv.Load()
	audience := os.Getenv("GOOGLE_CLIENT_ID")

	payload, err := verifyIdToken(idToken, audience)
	if err != nil {
		return "", 0, err
	}


	// Mendapatkan informasi user dari ID token (misalnya email, sub, dll)
	googleID, ok := payload.Claims["sub"].(string)
	if !ok {
		return "", 0, errors.New("user ID not found in Google token")
	}
	email, ok := payload.Claims["email"].(string)
	if !ok {
		return "", 0, errors.New("email not found in Google token")
	}

	// Verifikasi Access Token dan ambil informasi pengguna
	userInfo, err := getUserInfoFromAccessToken(accessToken)
	if err != nil {
		return "", 0, err
	}

	// Cari / tambah user di database
	user, err := s.authRepo.FindOrCreateUser(googleID, email, userInfo.Name, userInfo.Picture, userInfo.BirthDate, 0.0, 0.0) // Gunakan s.authRepo
	if err != nil {
		return "", 0, err // Error saat mencari atau menyimpan user
	}

	// Ambil user_id dari database
	userID, err := s.authRepo.GetUserID(googleID)
	if err != nil {
		return "", 0, err
	}


	// Buat JWT token untuk user jika login berhasil
	jwtToken, err := helpers.CreateJWT(user.GoogleID, email)

	fmt.Println("jwt token: ", jwtToken+" | err: ", err)
	fmt.Println("info profile: " + userInfo.Picture)
	fmt.Println("info dob: " + userInfo.BirthDate)
	if err != nil {
		return "", 0, errors.New("failed to create JWT")
	}

	return jwtToken, userID, nil
}

func verifyIdToken(idToken, audience string) (*idtoken.Payload, error) {
	
	// Verifikasi ID token dengan Google API
	payload, err := idtoken.Validate(context.Background(), idToken, audience)
	fmt.Println("audience: " + audience)
	if err != nil {
		fmt.Println("verifyIdToken ERROR")
		return nil, err
	}

	return payload, nil
}

type GoogleUserInfo struct {
	Email       string `json:"email"`
	Name        string `json:"name"`
	Picture     string `json:"picture"`
	PhoneNumber string `json:"phone_number,omitempty"`
	BirthDate   string `json:"birthdate,omitempty"`
}

func getUserInfoFromAccessToken(accessToken string) (*GoogleUserInfo, error) {
	// Kirim request ke Google UserInfo API
	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken)
	if err != nil {
		return nil, errors.New("failed to retrieve user info from access token")
	}
	defer resp.Body.Close()

	// Jika status code bukan 200 OK, maka token invalid atau request gagal
	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("invalid access token or failed request to Google UserInfo API")
	}

	// Decode response JSON ke dalam struct GoogleUserInfo
	var userInfo GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, errors.New("failed to decode user info response")
	}

	// Print info yang diperoleh dari Google UserInfo API
	fmt.Println("User Info from Access Token:")
	fmt.Println("Email:", userInfo.Email)
	fmt.Println("Name:", userInfo.Name)
	fmt.Println("Profile Picture:", userInfo.Picture)
	fmt.Println("Phone Number:", userInfo.PhoneNumber)
	fmt.Println("Birth Date:", userInfo.BirthDate)

	return &userInfo, nil
}
