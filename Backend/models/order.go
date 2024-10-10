package models

import (
	"math/big"
	"time"
)

type Orders struct {
	ID                  int64      `json:"order_id"`
	UserID              int64      `json:"user_id"`
	BankID              int64      `json:"bank_id"`
	Franchiseid         int64      `json:"franchise_id"`
	Status              string     `json:"status"`
	PaymentType         string     `json:"payment_type"`
	TotalAmount         *big.Float `json:"total_amount"`
	ShippingID          int64      `json:"shipping_id"`
	OrderDate           *time.Time `json:"order_date"`
	ShipmentPriceTotal  *big.Float `json:"shipment_price_total"`
	InsurancePriceTotal *big.Float `json:"insurance_price"`
	AdminPaymentPrice   *big.Float `json:"admin_payment_price"`
	FailureReason       string     `json:"failure_reason"`
	CreatedAt           *time.Time `json:"created_at"`
	UpdateAt            *time.Time `json:"update_at"`
}
