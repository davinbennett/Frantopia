package models

import (
	"time"
)

type User struct {
	User_id        int32      `json:"user_id"`
	GoogleID       string     `json:"google_id"`
	Email          string     `json:"email" validate:"required"`
	Name           string     `json:"name"`
	ProfilePicture string     `json:"profile_picture"`
	PhoneNumber    string     `json:"phone_number"`
	DOB            string     `json:"dob"`
	Latitude       string     `json:"latitude"`
	Longitude      string     `json:"longitude"`
	PostalCode     string     `json:"postal_code"`
	Role           string     `json:"role"`
	Address        string     `json:"address"`
	CreatedAt      *time.Time `json:"created_at"`
	UpdatedAt      *time.Time `json:"updated_at"`
}
