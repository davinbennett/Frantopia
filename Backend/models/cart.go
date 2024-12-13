package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CartItem struct {
	CartID        primitive.ObjectID `bson:"cart_id,omitempty" `
	FranchiseID   string             `bson:"franchise_id" json:"franchise_id,omitempty"`
	PackageID     string             `bson:"package_id" json:"package_id,omitempty"`
	FranchiseName string             `bson:"franchise-name" json:"franchise-name,omitempty"`
	PackageName   string             `bson:"package-name" json:"package-name,omitempty"`
	SizeConcept   int                `bson:"size_concept" json:"size_concept,omitempty"`
	GrossProfit   int                `bson:"gross_profit" json:"gross_profit,omitempty"`
	Income        int                `bson:"income" json:"income,omitempty"`
	Price         int                `bson:"price" json:"price,omitempty"`
	Status        string             `bson:"status" json:"status,omitempty"`
	Profile       string             `bson:"profile" json:"profile,omitempty"`
	Licensed      string             `bson:"licensed" json:"licensed,omitempty"`
}

type Cart struct {
	ID        primitive.ObjectID `bson:"_id"`
	UserID    int                `bson:"user_id"`
	ListCart  []CartItem         `bson:"list-cart"`
	CreatedAt time.Time          `bson:"created_at,omitempty" `
	UpdatedAt time.Time          `bson:"updated_at,omitempty" `
}
