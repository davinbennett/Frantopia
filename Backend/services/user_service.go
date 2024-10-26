package services

import (
	"Backend/models"
	"Backend/repositories/interfaces"
)

type UserService interface {
	GetUserAddress(userID int) (*models.User, error)
	UpdateAddress(userID int, address models.User) error
	GetUserProfile(userID int) (map[string]interface{}, error)
}

type userServiceImpl struct {
	userRepo interfaces.UserRepository
}

func NewUserService(repo interfaces.UserRepository) UserService {
	return &userServiceImpl{userRepo: repo}
}

func (s *userServiceImpl) GetUserAddress(userID int) (*models.User, error) {
	return s.userRepo.GetUserAddress(userID)
}

func (s *userServiceImpl) UpdateAddress(userID int, address models.User) error {
	// Periksa apakah alamat user sudah ada
	existingAddress, err := s.userRepo.FindUserAddress(userID)
	if err != nil && err.Error() != "record not found" {
		return err
	}

	userIDuint := uint(userID)

	address.UserID = userIDuint
	if existingAddress == nil {
		// Tambah alamat baru jika tidak ada
		return s.userRepo.CreateUserAddress(address)
	}

	// Update alamat jika sudah ada
	return s.userRepo.UpdateUserAddress(address)
}

func (s *userServiceImpl) GetUserProfile(userID int) (map[string]interface{}, error) {
	user, err := s.userRepo.FindUserProfile(userID)
	if err != nil {
		return nil, err
	}

	response := map[string]interface{}{
		"name":            user.Name,
		"profile_picture": user.ProfilePicture,
		"phone_number":    user.PhoneNumber,
		"dob":             user.DOB,
	}

	return response, nil
}
