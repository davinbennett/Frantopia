package interfaces

import (
	models "Backend/models/products"
)

type ProductRepository interface {
	GetTotalProducts() (int, error)
	GetCategoryByFranchiseID(franchiseID string) (string, error)
	FindByName(name string) ([]*models.Franchise, error)
	FindByFilters(priceMin, priceMax, location, category string, page, limit int) ([]*models.Franchise, int64, error)
	GetNameByFranchiseID(franchiseID string) (string, error)
	FindByID(productID string) (*models.Franchise, error)
	FindGalleryByID(productID string) ([]string, error)
	FindPackageByID(productID string, packageID string) (map[string]interface{}, error)
	AddProduct(product models.Franchise) error
	UpdateProduct(productID string, updatedProduct models.Franchise) error
	GetProductCategoryByID(productID string) (string, error)
	GetPackages(productID string) ([]models.PackageFranchises, error)
	GetProfileByID(productID string) (string, error)
	UpdateStatusByProductId(productID string, status string) error
}
