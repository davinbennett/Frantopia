package implementations

import (
	"Backend/models"
	"Backend/repositories/interfaces"
	"gorm.io/gorm"
)

type UserImpl struct {
	db *gorm.DB
}

func NewUserImpl(db *gorm.DB) interfaces.UserRepository {
	return &UserImpl{db: db}
}

func (r *UserImpl) FindByID(userID int) (*models.User, error) {
	var user models.User
	err := r.db.Where("user_id = ?", userID).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserImpl) GetUserAddress(userID int) (*models.User, error) {
	var user models.User
	err := r.db.Select("latitude", "longitude", "postal_code", "address").Where("user_id = ?", userID).First(&user).Error
	if err != nil {
		return nil, err
	}

	address := &models.User{
		Latitude:   user.Latitude,
		Longitude:  user.Longitude,
		PostalCode: user.PostalCode,
		Address:    user.Address,
	}
	return address, nil
}

func (r *UserImpl) FindUserAddress(userID int) (*models.User, error) {
	var address models.User
	if err := r.db.First(&address, "user_id = ?", userID).Error; err != nil {
		return nil, err
	}
	return &address, nil
}

func (r *UserImpl) CreateUserAddress(address models.User) error {
	return r.db.Create(&address).Error
}

func (r *UserImpl) UpdateUserAddress(address models.User) error {
	return r.db.Model(&address).Where("user_id = ?", address.UserID).Updates(address).Error
}

func (r *UserImpl) FindUserProfile(userID int) (*models.User, error) {
	var profile models.User
	if err := r.db.First(&profile, userID).Error; err != nil {
		return nil, err
	}
	return &profile, nil
}