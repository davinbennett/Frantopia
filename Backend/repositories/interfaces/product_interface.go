package interfaces

import (
	models "Backend/models/products"
)

type ProductRepository interface {
	GetTotalProducts() (int, error)
	GetCategoryByFranchiseID(franchiseID string) (string, error)
	FindByName(name string) ([]*models.Franchise, error)
}