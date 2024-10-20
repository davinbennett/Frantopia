package models

import (
	"time"
)

type User struct {
	UserID         uint       `gorm:"column:user_id;primaryKey;autoIncrement" json:"user_id"`
	GoogleID       string     `gorm:"column:google_id;type:varchar(255)" json:"google_id"`
	Email          string     `gorm:"column:email;type:varchar(255)" json:"email" validate:"required"`
	Name           *string    `gorm:"column:name;type:varchar(255)" json:"name"`
	ProfilePicture *string    `gorm:"column:profile_picture;type:varchar(255)" json:"profile_picture"`
	PhoneNumber    *string    `gorm:"column:phone_number;type:varchar(20)" json:"phone_number"`
	DOB            *time.Time `gorm:"column:dob" json:"dob"`
	Latitude       *float64   `gorm:"column:latitude;type:numeric(9,6)" json:"latitude"`
	Longitude      *float64   `gorm:"column:longitude;type:numeric(9,6)" json:"longitude"`
	PostalCode *string   `gorm:"column:postal_code;type:varchar(10)" json:"postal_code"`
	Role       *string   `gorm:"column:role;type:varchar(20)" json:"role"`
	Address    *string   `gorm:"column:address;type:varchar(255)" json:"address"`
	CreatedAt  time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}
