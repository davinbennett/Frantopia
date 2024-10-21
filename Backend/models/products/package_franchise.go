package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PackageFranchises struct {
	PackageID   primitive.ObjectID `bson:"package_id,omitempty" json:"package_id,omitempty"`
	Name        string             `bson:"name" json:"name,omitempty"`
	SizeConcept int                `bson:"size_concept" json:"size_concept,omitempty"` 
	GrossProfit int                `bson:"gross_profit" json:"gross_profit,omitempty"`
	Income      int                `bson:"income" json:"income,omitempty"`
	Price       int                `bson:"price" json:"price,omitempty"`
	CreatedAt   time.Time          `bson:"created_at,omitempty" json:"created_at,omitempty"` 
	UpdatedAt   time.Time          `bson:"updated_at,omitempty" json:"updated_at,omitempty"` 
}
