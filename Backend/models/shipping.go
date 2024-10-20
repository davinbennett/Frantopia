package models

import (
	"time"
)

type Shipping struct {
	ID        uint       `gorm:"column:shipping_id;primaryKey;autoIncrement"`
	Method    string     `gorm:"column:shipping_method;type:varchar(255)" son:"shipping_method"`
	Cost      *float64   `gorm:"column:shipping_cost;type:numeric(10,2)" json:"shipping_cost"`
	CreatedAt *time.Time `gorm:"column:updated_at;autoUpdateTime" json:"created_at"`
}
