package implementations

import (
	"Backend/models"
	"Backend/repositories/interfaces"
	"errors"
	"fmt"
	"time"

	"strconv"

	"gorm.io/gorm"
)

type AuthImpl struct {
	db *gorm.DB
}

func NewAuthImpl(db *gorm.DB) interfaces.AuthRepository {
	return &AuthImpl{db: db}
}

func (r *AuthImpl) FindOrCreateUser(googleId, email, name, picture, dobStr string, latitudeStr, longitudeStr float64) (*models.User, error) {
	var user models.User

	err := r.db.First(&user, "google_id = ?", googleId).Error
	if err == nil {
		fmt.Println(googleId)
		return &user, nil
	}

	var latitude, longitude float64

	if errors.Is(err, gorm.ErrRecordNotFound) {
		var dob time.Time
		if dobStr != "" {
			var err error
			dob, err = time.Parse("2006-01-02", dobStr)
			if err != nil {
				return nil, errors.New("format tanggal lahir tidak valid, gunakan format yyyy-mm-dd")
			}
		}

		role := "user"
		if email == "davinbennet99@gmail.com" {
			role = "admin"
		}
		longitude, err = strconv.ParseFloat("0", 64)
		latitude, err = strconv.ParseFloat("0", 64)

		newUser := &models.User{
			GoogleID:       googleId,
			Email:          email,
			Role:           &role,
			Name:           &name,
			ProfilePicture: &picture,
			DOB:            &dob,
			Latitude:       &latitude,
			Longitude:      &longitude,
		}

		// fmt.Println(newUser)

		if err := r.db.Create(newUser).Error; err != nil {
			fmt.Println(err)
			return nil, err
		}

		return newUser, nil
	}

	return nil, err
}

func (r *AuthImpl) GetUserID(googleID string) (uint, error) {
	var user models.User
	err := r.db.Select("user_id").Where("google_id = ?", googleID).First(&user).Error
	if err != nil {
		return 0, err
	}
	return user.UserID, nil
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
