package interfaces

import "Backend/models"

type OrderRepository interface {
	GetSalesAnalytics(period, start, end string) ([]map[string]interface{}, error)
	GetTotalSold(period, start, end string) (float64, error)
	GetOrderFranchiseIDs(period, start, end string) ([]string, error)
	FindByID(orderID string) (*models.Orders, error)
	FindByStatusAndUserId(status string, userId *int, page, limit int) ([]models.Orders, int, error)
	UpdateOrderStatus(orderID int, status string) error
	FindOrderIdByFranchiseId(franchiseId string) (*uint, error)
	CreateOrder(order models.Orders) error
}
