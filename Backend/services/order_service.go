// services/order_service.go
package services

import (
	"Backend/models"
	"Backend/repositories/interfaces"
	"fmt"
	"math"
)

type OrderService interface {
	GetSalesAnalytics(period, start, end string) ([]map[string]interface{}, error)
	GetTotalSold(period, start, end string) (float64, error)
	GetCategoryAnalytics(period, start, end string) (map[string]interface{}, error)
	GetOrderByID(orderID string) (map[string]interface{}, error)
	GetOrdersByStatusAndUserId(status string, userId *int,page, limit int) (map[string]interface{}, error)
	UpdateOrderStatus(orderID int, status string) error
	GetOrderIdByFranchiseId(franchiseId string) (*uint, error)
	CreateOrder(model models.Orders) error
}

type orderServiceImpl struct {
	orderRepo   interfaces.OrderRepository
	productRepo interfaces.ProductRepository
	userRepo    interfaces.UserRepository
}

func NewOrderService(orderRepo interfaces.OrderRepository, productRepo interfaces.ProductRepository, userRepo interfaces.UserRepository) OrderService {
	return &orderServiceImpl{
		userRepo:    userRepo,
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
	// Step 1: Ambil semua franchise_id dari tabel Order
	fmt.Println("period: ", period)
	fmt.Println("start: ", start)
	fmt.Println("end: ", end)
	orderFranchises, err := s.orderRepo.GetOrderFranchiseIDs(period, start, end) // <- SUCCESS
	fmt.Println("order franchise: ", orderFranchises)
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

func (s *orderServiceImpl) GetOrderByID(orderID string) (map[string]interface{}, error) {
	// Step 1: Get the order by ID from the orderRepo (Postgres)
	order, err := s.orderRepo.FindByID(orderID)
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	// Step 2: Use the franchise ID from the order to get the franchise name from MongoDB
	franchiseName, err := s.productRepo.GetNameByFranchiseID(order.FranchiseId)
	if err != nil {
		return nil, err
	}

	// fmt.Println(franchiseName)

	response := map[string]interface{}{
		"name":            franchiseName,
		"status":          order.Status,
		"date":            order.OrderDate,
		"price-total":     order.TotalAmount,
		"shipment-price":  order.ShipmentPriceTotal,
		"insurance-price": order.InsurancePriceTotal,
		"admin-price":     order.AdminPaymentPrice,
	}

	return response, nil
}

func (s *orderServiceImpl) GetOrdersByStatusAndUserId(status string, userId *int, page, limit int) (map[string]interface{}, error) {
	orders, totalItems, err := s.orderRepo.FindByStatusAndUserId(status, userId, page, limit)
	if err != nil {
		return nil, err
	}

	var response []map[string]interface{}

	for _, order := range orders {
		// 1. Ambil data franchise dari MongoDB pake franchise_id
		product, err := s.productRepo.FindByID(order.FranchiseId)
		if err != nil || product == nil {
			continue
		}

		// 2. Ambil data package franchise dari MongoDB menggunakan franchise_id dan package_franchise_id
		packageFranchise, err := s.productRepo.FindPackageByID(order.FranchiseId, order.PackageFranchiseId)
		if err != nil || packageFranchise == nil {
			continue
		}

		// 3. Ambil data user_name dari PostgreSQL menggunakan user_id
		user, err := s.userRepo.FindByID(int(order.UserID))
		if err != nil || user == nil {
			continue
		}

		// 4. Tambahkan data ke response
		response = append(response, map[string]interface{}{
			"order_id":               order.ID,
			"user_id":                order.UserID,
			"product_id":             product.ID,
			"package_franchise_id":   order.PackageFranchiseId,
			"user_name":              user.Name, // Ambil user_name dari tabel Users
			"franchise_name":         product.Name,
			"package_franchise_name": packageFranchise["name"],
			"category":               product.Category,
			"status":                 order.Status,
			"order_date":             order.OrderDate.Format("2006-01-02"),
			"profile":                product.Profile,
			"total_amount":           order.TotalAmount,
		})
	}

	totalPages := int(math.Ceil(float64(totalItems) / float64(limit)))

	result := map[string]interface{}{
		"current_page": page,
		"total_items":  totalItems,
		"total_pages":  totalPages,
		"order_data":   response,
	}

	return result, nil
}

func (s *orderServiceImpl) UpdateOrderStatus(orderID int, status string) error {
	return s.orderRepo.UpdateOrderStatus(orderID, status)
}

func (s *orderServiceImpl) GetOrderIdByFranchiseId(franchiseId string) (*uint, error) {
	return s.orderRepo.FindOrderIdByFranchiseId(franchiseId)
}

func (s *orderServiceImpl) CreateOrder(order models.Orders) error {
	return s.orderRepo.CreateOrder(order)
}
