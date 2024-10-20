package services

import (
	// models "Backend/models/products"
	"Backend/repositories/interfaces"
	// "errors"
)

type ProductService interface {
	GetTotalProducts() (int, error)
	SearchProductByName(name string) ([]map[string]interface{}, error)
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

	// Prepare the response map
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
