package models

import (
	"math/big"
	"time"
)

type Shipping struct {
	ID                    int64      `"json:"shipping_id"`
	Method                string     `json:"shipping_method"`
	Cost                  *big.Float `json:"shipping_cost"`
	Status                string     `json:"shipping_status"`
	TrackingNumber        string     `json:"tracking_number"`
	EstimatedDeliveryDate *time.Time `json:"estimated_delivery_date"`
	CreatedAt             *time.Time `json:"created_at"`
}
