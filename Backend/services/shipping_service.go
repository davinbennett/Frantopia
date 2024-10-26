package services

import (
	"Backend/models"
	"Backend/repositories/interfaces"
)

type ShippingService interface {
	GetShippingMethods() ([]models.Shipping, error)
}

type shippingServiceImpl struct {
	shippingRepo interfaces.ShippingRepository
}

func NewShippingService(shippingRepo interfaces.ShippingRepository) ShippingService {
	return &shippingServiceImpl{shippingRepo: shippingRepo}
}

func (s *shippingServiceImpl) GetShippingMethods() ([]models.Shipping, error) {
	return s.shippingRepo.GetAllShippingMethods()
}
