package services

import (
	models "Backend/models/products"
	"Backend/repositories/interfaces"
	"math"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	// "errors"
)

type ProductService interface {
	GetTotalProducts() (int, error)
	SearchProductByName(name string) ([]map[string]interface{}, error)
	SearchByFilters(priceMin, priceMax, location, category string, page, limit int) (map[string]interface{}, error)
	GetProductByID(productID string) (map[string]interface{}, error)
	GetProductGallery(productID string) (map[string]interface{}, error)
	GetPackageByID(productID string, packageID string) (map[string]interface{}, error)
	CreateProduct(product models.Franchise) error
	UpdateProduct(productID string, updatedProduct models.Franchise) error
	GetProductCategoryByID(productID string) (string, error)
}

type productServiceImpl struct {
	productRepo interfaces.ProductRepository
}

func NewProductService(repo interfaces.ProductRepository) ProductService {
	return &productServiceImpl{productRepo: repo}
}

func (s *productServiceImpl) GetTotalProducts() (int, error) {
	return s.productRepo.GetTotalProducts()
}
func (s *productServiceImpl) SearchProductByName(name string) ([]map[string]interface{}, error) {
	products, err := s.productRepo.FindByName(name)
	if err != nil {
		return nil, err
	}

	var response []map[string]interface{}

	for _, product := range products {
		response = append(response, map[string]interface{}{
			"id":          product.ID.Hex(),
			"name":        product.Name,
			"category":    product.Category,
			"established": product.Established,
			"price":       product.Price,
			"rating":      product.Rating,
			"location":    product.Location,
			"status":      product.Status,
			"stock":       product.Stock,
			"profile":     product.Profile,
		})
	}

	return response, nil
}

func (s *productServiceImpl) SearchByFilters(priceMin, priceMax, location, category string, page, limit int) (map[string]interface{}, error) {
	products, totalItems, err := s.productRepo.FindByFilters(priceMin, priceMax, location, category, page, limit)
	if err != nil {
		return nil, err
	}

	var response []map[string]interface{}
	for _, product := range products {
		response = append(response, map[string]interface{}{
			"id":          product.ID.Hex(),
			"name":        product.Name,
			"category":    product.Category,
			"established": product.Established,
			"price":       product.Price,
			"rating":      product.Rating,
			"location":    product.Location,
			"status":      product.Status,
			"stock":       product.Stock,
			"profile":     product.Profile,
		})
	}

	totalPages := int(math.Ceil(float64(totalItems) / float64(limit)))

	// Return paginated response
	result := map[string]interface{}{
		"products":     response,
		"total_items":  totalItems,
		"total_pages":  totalPages,
		"current_page": page,
	}

	return result, nil
}

func (s *productServiceImpl) GetProductByID(productID string) (map[string]interface{}, error) {
	product, err := s.productRepo.FindByID(productID)
	if err != nil {
		return nil, err
	}

	if product == nil {
		return nil, nil
	}

	response := map[string]interface{}{
		"product_id":   product.ID.Hex(),
		"name":         product.Name,
		"category":     product.Category,
		"established":  product.Established,
		"description":  product.Description,
		"price":        product.Price,
		"licensed":     product.Licensed,
		"rating":       product.Rating,
		"location":     product.Location,
		"deposit":      product.Deposit,
		"royalty_fee":  product.RoyaltyFee,
		"outlet_sales": product.OutletSales,
		"stock":        product.Stock,
		"profile":      product.Profile,
	}

	return response, nil
}

func (s *productServiceImpl) GetProductGallery(productID string) (map[string]interface{}, error) {
	gallery, err := s.productRepo.FindGalleryByID(productID)
	if err != nil {
		return nil, err
	}

	if gallery == nil {
		return nil, nil
	}

	response := map[string]interface{}{
		"product_id": productID,
		"gallery":    gallery,
	}

	return response, nil
}

func (s *productServiceImpl) GetPackageByID(productID string, packageID string) (map[string]interface{}, error) {
	packageData, err := s.productRepo.FindPackageByID(productID, packageID)
	if err != nil {
		return nil, err
	}

	if packageData == nil {
		return nil, nil
	}

	response := map[string]interface{}{
		"product_id":         productID,
		"package_franchises": packageData,
	}

	return response, nil
}

func (ps *productServiceImpl) CreateProduct(product models.Franchise) error {
	product.CreatedAt = time.Now().UTC().Add(7 * time.Hour)
	product.UpdatedAt = time.Now().Add(7 * time.Hour)

	for i := range product.Income {
		product.Income[i].IncomeID = primitive.NewObjectID()
		product.Income[i].CreatedAt = time.Now().Add(7 * time.Hour)
	}
	for i := range product.PackageFranchises {
		product.PackageFranchises[i].PackageID = primitive.NewObjectID()
		product.PackageFranchises[i].CreatedAt = time.Now().Add(7 * time.Hour)
	}

	err := ps.productRepo.AddProduct(product)
	if err != nil {
		return err
	}
	return nil
}

func (s *productServiceImpl) UpdateProduct(productID string, updatedProduct models.Franchise) error {
	for i := range updatedProduct.Income {
		if updatedProduct.Income[i].IncomeID.IsZero() {
			updatedProduct.Income[i].IncomeID = primitive.NewObjectID()
			updatedProduct.Income[i].UpdatedAt = time.Now().Add(7 * time.Hour)
		}

		updatedProduct.Income[i].UpdatedAt = time.Now().Add(7 * time.Hour)
	}

	for i := range updatedProduct.PackageFranchises {
		if updatedProduct.PackageFranchises[i].PackageID.IsZero() {
			updatedProduct.PackageFranchises[i].PackageID = primitive.NewObjectID()
			updatedProduct.PackageFranchises[i].UpdatedAt = time.Now().Add(7 * time.Hour)
		}

		updatedProduct.PackageFranchises[i].UpdatedAt = time.Now().Add(7 * time.Hour)
	}

	return s.productRepo.UpdateProduct(productID, updatedProduct)
}

func (s *productServiceImpl) GetProductCategoryByID(productID string) (string, error) {
	return s.productRepo.GetProductCategoryByID(productID)
}