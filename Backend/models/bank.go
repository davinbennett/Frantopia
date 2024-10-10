package models

type Bank struct {
	ID            int64  `json:"bank_id"`
	UserID        int    `json:"user_id"`
	BankName      string `json:"bank_name"`
	AccountNumber string `json:"account_number"`
	AccountHolder string `json:"account_holder"`
}
