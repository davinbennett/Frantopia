package models

import (
	"time"
)

type Orders struct {
	ID                    uint       `gorm:"column:order_id;primaryKey;autoIncrement"`
	UserID                uint       `gorm:"column:user_id;type:varchar(255)" json:"user_id"`
	BankID                uint       `gorm:"column:bank_id" json:"bank_id"`
	FranchiseId           string     `gorm:"column:franchise_id" json:"franchise_id"`
	PackageFranchiseId    string     `gorm:"column:package_franchise_id" json:"package_franchise_id"`
	Status                string     `gorm:"column:status" json:"status"`
	PaymentType           string     `gorm:"column:payment_type" json:"payment_type"`
	TotalAmount           float64    `gorm:"column:total_amount" json:"total_amount"`
	ShippingID            uint       `gorm:"column:shipping_id" json:"shipping_id"`
	OrderDate             *time.Time `gorm:"column:order_date" json:"order_date"`
	ShipmentPriceTotal    float64    `gorm:"column:shipment_price_total" json:"shipment_price_total"`
	InsurancePriceTotal   float64    `gorm:"column:insurance_price_total" json:"insurance_price_total"`
	AdminPaymentPrice     float64    `gorm:"column:admin_payment_price" json:"admin_payment_price"`
	FailureReason         string     `gorm:"column:failure_reason" json:"failure_reason"`
	ShippingStatus        string     `gorm:"column:shipping_status" json:"shipping_status"`
	TrackingNumber        string     `gorm:"column:tracking_number" json:"tracking_number"`
	EstimatedDeliveryDate *time.Time `gorm:"column:estimated_delivery_date" json:"estimated_delivery_date"`
	CreatedAt             *time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	UpdateAt              *time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}
