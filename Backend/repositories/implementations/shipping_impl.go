package implementations

import (
	"Backend/models"
	"Backend/repositories/interfaces"
	"gorm.io/gorm"
)

type shippingImpl struct {
	db *gorm.DB
}

func NewShippingImpl(db *gorm.DB) interfaces.ShippingRepository {
	return &shippingImpl{db: db}
}

func (r *shippingImpl) GetAllShippingMethods() ([]models.Shipping, error) {
	var shipping []models.Shipping
	if err := r.db.Find(&shipping).Error; err != nil {
		return nil, err
	}
	return shipping, nil
}
