package interfaces

import (
	"Backend/models"
)

type ShippingRepository interface {
	GetAllShippingMethods() ([]models.Shipping, error)
}
