package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Franchise struct {
	ID                primitive.ObjectID `bson:"_id,omitempty"`
	Name              string             `bson:"name" json:"name,omitempty"`
	Category          string             `bson:"category,omitempty" json:"category,omitempty"`
	Established       int32                `bson:"established,omitempty" json:"established,omitempty"`
	Description       string             `bson:"description,omitempty" json:"description,omitempty"`
	Price             int                `bson:"price,omitempty" json:"price,omitempty"`
	Licensed          string             `bson:"licensed,omitempty" json:"licensed,omitempty"`
	Rating            float64            `bson:"rating,omitempty" json:"rating,omitempty"`
	Location          string             `bson:"location,omitempty" json:"location,omitempty"`
	Deposit           int32                `bson:"deposit,omitempty" json:"deposit,omitempty"`
	RoyaltyFee        int32                `bson:"royalty_fee,omitempty" json:"royalty_fee,omitempty"`
	OutletSales       int32                `bson:"outlet_sales,omitempty" json:"outlet_sales,omitempty"`
	CreatedAt         time.Time          `bson:"created_at,omitempty" json:"created_at,omitempty"`
	UpdatedAt         time.Time          `bson:"updated_at,omitempty" json:"updated_at,omitempty"`
	PackageFranchises []PackageFranchises `bson:"package_franchises,omitempty" json:"package_franchises,omitempty"`
	Income            []Income           `bson:"income,omitempty" json:"income,omitempty"`
	Status            string             `bson:"status,omitempty" json:"status,omitempty"`
	Stock             int32                `bson:"stock,omitempty" json:"stock,omitempty"`
	Gallery           []string           `bson:"gallery,omitempty" json:"gallery,omitempty"`
	Profile           string             `bson:"profile,omitempty" json:"profile,omitempty"`
}
