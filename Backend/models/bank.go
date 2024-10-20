package models

type Bank struct {
	ID            uint   `gorm:"column:bank_id;primaryKey;autoIncrement" json:"bank_id"`
	UserID        uint   `gorm:"column:user_id" json:"user_id" `
	BankName      string `gorm:"column:bank_name" json:"bank_name"`
	AccountNumber string `gorm:"column:account_number" json:"account_number"`
	AccountHolder string `gorm:"column:account_holder" json:"account_holder"`
}
