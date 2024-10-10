package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Franchise struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Name              string             `bson:"name" json:"name,omitempty"`
	Category          string             `bson:"category" json:"category ,omitempty"`
	Established       int                `bson:"established" json:"established ,omitempty"`
	Description       string             `bson:"description" json:"description ,omitempty"`
	Price             int                `bson:"price" json:"price ,omitempty"`
	Licensed          string             `bson:"licensed" json:"licensed ,omitempty"`
	Rating            float32            `bson:"rating" json:"rating ,omitempty"`
	Location          string             `bson:"location" json:"location ,omitempty"`
	Deposit           int                `bson:"deposit" json:"deposit ,omitempty"`
	RoyaltyFee        int                `bson:"royalty_fee" json:"royalty_fee ,omitempty"`
	OutletSales       int                `bson:"outlet_sales" json:"outlet_sales ,omitempty"`
	CreatedAt         time.Time          `bson:"created_at,omitempty" json:"created_at,omitempty"`
	UpdatedAt         time.Time          `bson:"updated_at,omitempty" json:"updated_at,omitempty"`
	PackageFranchises []PackageFranchise `bson:"package_franchises"`
	Income            []Income           `bson:"income"`
}
