package models

import (
	"time"
)

type User struct {
	ID             int64      `json:"user_id"`
	GoogleID       int        `json:"google_id"`
	Name           string     `json:"name"`
	Email          string     `json:"email"`
	Password       string     `json:"password"`
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
