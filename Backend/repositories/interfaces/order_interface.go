package interfaces

import "Backend/models"

type OrderRepository interface {
	GetSalesAnalytics(period, start, end string) ([]map[string]interface{}, error)
	GetTotalSold(period, start, end string) (float64, error)
	GetOrderFranchiseIDs(period, start, end string) ([]string, error)
	FindByID(orderID string) (*models.Orders, error)
}
