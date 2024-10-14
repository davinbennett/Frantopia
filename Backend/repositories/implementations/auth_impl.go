package implementations

import (
	"Backend/models"
	"Backend/repositories/interfaces"
	"errors"
	"fmt"
	"gorm.io/gorm"
)

type AuthImpl struct {
	db *gorm.DB
}

func NewAuthImpl(db *gorm.DB) *AuthImpl {
	return &AuthImpl{db: db}
}

var _ interfaces.AuthRepository = (*AuthImpl)(nil)

func (r *AuthImpl) FindOrCreateUser(googleId, email, name, picture, dob string) (*models.User, error) {
	var user models.User

	err := r.db.First(&user, "google_id = ?", googleId).Error
	if err == nil {
		fmt.Println(googleId)
		return &user, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		role := "user"
		if email == "davinbennet99@gmail.com" {
			role = "admin"
		}

		newUser := &models.User{
			GoogleID: googleId,
			Email:    email,
			Role:     role,
			Name: name,
			ProfilePicture: picture,
			DOB: dob,
		}

		// fmt.Println(newUser)

		if err := r.db.Create(newUser).Error; err != nil {
			//fmt.Println(err)
			return nil, err
		}

		return newUser, nil
	}

	return nil, err
}

// func (r *AuthImpl) FindByGoogleID(googleId string) (*models.User, error) {
// 	var user models.User
// 	if err := r.db.Where("google_id = ?", googleId).First(&user).Error; err != nil {
// 		return nil, err
// 	}
// 	return &user, nil
// }

// func (r *AuthImpl) FindByEmail(email string) (*models.User, error) {
// 	var user models.User
// 	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
// 		return nil, err
// 	}
// 	return &user, nil
// }
