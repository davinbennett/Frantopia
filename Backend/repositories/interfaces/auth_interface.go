package interfaces

import "Backend/models"

type AuthRepository interface {
	FindByEmail(email string) (*models.User, error)
	FindByGoogleID(googleId string) (*models.User, error)
	FindOrCreateUser(googleId, email string) (*models.User, error)
}