package interfaces

import "Backend/models"

type AuthRepository interface {
	// FindByEmail(email string) (*models.User, error)
	// FindByGoogleID(googleId string) (*models.User, error)
	FindOrCreateUser(googleId, email, name, picture, dobStr string, latitudeStr, longitudeStr float64) (*models.User, error)
	GetUserID(googleID string) (uint, error)
}