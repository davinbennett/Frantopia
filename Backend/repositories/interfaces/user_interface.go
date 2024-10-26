package interfaces

import "Backend/models"

type UserRepository interface {
	FindByID(userID int) (*models.User, error)
	GetUserAddress(userID int) (*models.User, error)
	FindUserAddress(userID int) (*models.User, error)
	CreateUserAddress(address models.User) error
	UpdateUserAddress(address models.User) error
	FindUserProfile(userID int) (*models.User, error)
}