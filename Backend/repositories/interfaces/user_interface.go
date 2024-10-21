package interfaces

import "Backend/models"

type UserRepository interface {
	FindByID(userID int) (*models.User, error)
}