package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Income struct {
	IncomeID  primitive.ObjectID `bson:"income_id,omitempty"`
	Month     string             `bson:"month" json:"month,omitempty"`
	Income    int                `bson:"income" json:"income,omitempty"`
	CreatedAt time.Time          `bson:"created_at,omitempty"`
	UpdatedAt time.Time          `bson:"updated_at,omitempty"`
}
