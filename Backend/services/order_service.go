// services/order_service.go
package services

import (
	"Backend/repositories/interfaces"
	// "fmt"
)

type OrderService interface {
	GetSalesAnalytics(period, start, end string) ([]map[string]interface{}, error)
	GetTotalSold(period, start, end string) (float64, error)
	GetCategoryAnalytics(period, start, end string) (map[string]interface{}, error)
}

type orderServiceImpl struct {
	orderRepo   interfaces.OrderRepository
	productRepo interfaces.ProductRepository
}

func NewOrderService(orderRepo interfaces.OrderRepository, productRepo interfaces.ProductRepository) OrderService {
	return &orderServiceImpl{
		orderRepo:   orderRepo,
		productRepo: productRepo,
	}
}

func (s *orderServiceImpl) GetSalesAnalytics(period, start, end string) ([]map[string]interface{}, error) {
	return s.orderRepo.GetSalesAnalytics(period, start, end)
}

func (s *orderServiceImpl) GetTotalSold(period, start, end string) (float64, error) {
	return s.orderRepo.GetTotalSold(period, start, end)
}

func (s *orderServiceImpl) GetCategoryAnalytics(period, start, end string) (map[string]interface{}, error) {
	// Step 1: Ambil semua franchise_id dari tabel order di Postgres
	orderFranchises, err := s.orderRepo.GetOrderFranchiseIDs(period, start, end) // <- SUCCESS
	if err != nil {
		return nil, err
	}

	// Step 2: Ambil data kategori dari MongoDB dari franchise_id
	categoryData := make(map[string]int)
	for _, franchiseID := range orderFranchises {
		category, err := s.productRepo.GetCategoryByFranchiseID(franchiseID)
		if err != nil {
			return nil, err
		}
		categoryData[category]++
	}

	var categories []map[string]interface{}
	var bestSellingCategory string
	var maxTotal int

	for category, total := range categoryData {
		categories = append(categories, map[string]interface{}{
			"name":  category,
			"total": total,
		})

		if total > maxTotal {
			maxTotal = total
			bestSellingCategory = category
		}
	}

	result := map[string]interface{}{
		"period":              period,
		"bestSellingCategory": bestSellingCategory,
		"categoryData":        categories,
	}

	return result, nil
}