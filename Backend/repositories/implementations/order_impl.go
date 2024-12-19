package implementations

import (
	"Backend/models"
	"Backend/repositories/interfaces"
	"strings"

	"database/sql"
	"errors"

	"time"

	"gorm.io/gorm"
)

type orderImpl struct {
	postgresDB *gorm.DB
}

func NewOrderImpl(postgresDB *gorm.DB) interfaces.OrderRepository {
	return &orderImpl{
		postgresDB: postgresDB,
	}
}

func (r *orderImpl) GetSalesAnalytics(period, start, end string) ([]map[string]interface{}, error) {
	var orderData []map[string]interface{}
	currentYear := time.Now().Year()

	var selectClause string
	switch period {
	case "monthly":
		selectClause = "CASE " +
			"WHEN EXTRACT(MONTH FROM order_date) = 1 OR EXTRACT(MONTH FROM order_date) = 2 THEN '1' " +
			"WHEN EXTRACT(MONTH FROM order_date) = 3 OR EXTRACT(MONTH FROM order_date) = 4 THEN '3' " +
			"WHEN EXTRACT(MONTH FROM order_date) = 5 OR EXTRACT(MONTH FROM order_date) = 6 THEN '5' " +
			"WHEN EXTRACT(MONTH FROM order_date) = 7 OR EXTRACT(MONTH FROM order_date) = 8 THEN '7' " +
			"WHEN EXTRACT(MONTH FROM order_date) = 9 OR EXTRACT(MONTH FROM order_date) = 10 THEN '9' " +
			"WHEN EXTRACT(MONTH FROM order_date) = 11 OR EXTRACT(MONTH FROM order_date) = 12 THEN '11' " +
			"END AS period, SUM(total_amount) AS total_sold"
	case "quarterly":
		selectClause = "EXTRACT(QUARTER FROM order_date) AS period, SUM(total_amount) AS total_sold"
	case "yearly":
		selectClause = "EXTRACT(YEAR FROM order_date) AS period, SUM(total_amount) AS total_sold"
	case "day":
		selectClause = "EXTRACT(DAY FROM order_date) AS period, SUM(total_amount) AS total_sold"
	}

	query := r.postgresDB.Model(&models.Orders{}).Select(selectClause)

	// Filter hanya untuk tahun saat ini jika monthly atau quarterly
	if period == "monthly" || period == "quarterly" {
		query = query.Where("EXTRACT(YEAR FROM order_date) = ?", currentYear)
	}

	switch period {
	case "monthly":
		query = query.Where("status = ?", "Completed").
			Group("CASE " +
				"WHEN EXTRACT(MONTH FROM order_date) = 1 OR EXTRACT(MONTH FROM order_date) = 2 THEN '1' " +
				"WHEN EXTRACT(MONTH FROM order_date) = 3 OR EXTRACT(MONTH FROM order_date) = 4 THEN '3' " +
				"WHEN EXTRACT(MONTH FROM order_date) = 5 OR EXTRACT(MONTH FROM order_date) = 6 THEN '5' " +
				"WHEN EXTRACT(MONTH FROM order_date) = 7 OR EXTRACT(MONTH FROM order_date) = 8 THEN '7' " +
				"WHEN EXTRACT(MONTH FROM order_date) = 9 OR EXTRACT(MONTH FROM order_date) = 10 THEN '9' " +
				"WHEN EXTRACT(MONTH FROM order_date) = 11 OR EXTRACT(MONTH FROM order_date) = 12 THEN '11' " +
				"END")
	case "quarterly":
		query = query.Where("status = ?", "Completed").
			Group("EXTRACT(QUARTER FROM order_date)")
	case "yearly":
		query = query.Where("status = ?", "Completed").
			Group("EXTRACT(YEAR FROM order_date)")
	case "day":
		startDate, _ := time.Parse("2006-01-02", start)
		endDate, _ := time.Parse("2006-01-02", end)
		endDate = endDate.AddDate(0, 0, 1)

		query = query.Where("status = ?", "Completed").
			Where("order_date BETWEEN ? AND ?", startDate, endDate).
			Group("EXTRACT(DAY FROM order_date)")
	}

	rows, err := query.Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Mapping data sesuai period
	switch period {
	case "monthly":
		months := map[string]float64{"1": 0, "3": 0, "5": 0, "7": 0, "9": 0, "11": 0}
		for rows.Next() {
			var period sql.NullString
			var totalSold sql.NullFloat64
			err = rows.Scan(&period, &totalSold)
			if err != nil {
				return nil, err
			}
			if period.Valid && totalSold.Valid {
				months[period.String] = totalSold.Float64
			}
		}
		for month, totalSold := range months {
			orderData = append(orderData, map[string]interface{}{
				"month":      month,
				"total-sold": totalSold,
			})
		}

	case "quarterly":
		quarters := map[string]float64{"1": 0, "2": 0, "3": 0, "4": 0}
		for rows.Next() {
			var period sql.NullString
			var totalSold sql.NullFloat64
			err = rows.Scan(&period, &totalSold)
			if err != nil {
				return nil, err
			}
			if period.Valid && totalSold.Valid {
				quarters[period.String] = totalSold.Float64
			}
		}
		for quarter, totalSold := range quarters {
			orderData = append(orderData, map[string]interface{}{
				"quarter":    quarter,
				"total-sold": totalSold,
			})
		}

	case "yearly":
		for rows.Next() {
			var period sql.NullString
			var totalSold sql.NullFloat64
			err = rows.Scan(&period, &totalSold)
			if err != nil {
				return nil, err
			}
			orderData = append(orderData, map[string]interface{}{
				"year":       period.String,
				"total-sold": totalSold.Float64,
			})
		}

	case "day":
		for rows.Next() {
			var period sql.NullString
			var totalSold sql.NullFloat64
			err = rows.Scan(&period, &totalSold)
			if err != nil {
				return nil, err
			}
			orderData = append(orderData, map[string]interface{}{
				"date":       period.String,
				"total-sold": totalSold.Float64,
			})
		}
	}

	return orderData, nil
}

func (r *orderImpl) GetTotalSold(period, start, end string) (float64, error) {
	var totalSold sql.NullFloat64

	query := r.postgresDB.Model(&models.Orders{}).Select("SUM(total_amount)")

	switch period {
	case "monthly":
		query = query.Where("EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM NOW()) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())")
	case "quarterly":
		query = query.Where("EXTRACT(QUARTER FROM order_date) = EXTRACT(QUARTER FROM NOW()) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())")
	case "yearly":
		query = query.Where("EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())")
	case "day":
		startDate, _ := time.Parse("2006-01-02", start)
		endDate, _ := time.Parse("2006-01-02", end)

		endDate = endDate.AddDate(0, 0, 1)

		query = query.Where("order_date BETWEEN ? AND ?", startDate, endDate)
	}

	err := query.Scan(&totalSold).Error
	if err != nil {
		return 0, errors.New("failed to fetch total sold items: " + err.Error())
	}

	return float64(totalSold.Float64), nil
}

func (r *orderImpl) GetOrderFranchiseIDs(period, start, end string) ([]string, error) {
	var franchiseIDs []string

	query := r.postgresDB.Model(&models.Orders{}).Select("franchise_id")

	switch period {
	case "monthly":
		query = query.Where("EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM NOW()) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())").
			Where("status = ?", "Completed")
	case "quarterly":
		query = query.Where("EXTRACT(QUARTER FROM order_date) = EXTRACT(QUARTER FROM NOW()) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())").
			Where("status = ?", "Completed")
	case "yearly":
		query = query.Where("EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())").
			Where("status = ?", "Completed")
	case "day":
		startDate, _ := time.Parse("2006-01-02", start)
		endDate, _ := time.Parse("2006-01-02", end)
		endDate = endDate.AddDate(0, 0, 1)

		query = query.Where("order_date BETWEEN ? AND ?", startDate, endDate).
			Where("status = ?", "Completed")
	}

	err := query.Scan(&franchiseIDs).Error
	if err != nil {
		return nil, err
	}

	return franchiseIDs, nil
}

func (r *orderImpl) FindByID(orderID string) (*models.Orders, error) {
	var order models.Orders

	err := r.postgresDB.Where("order_id = ?", orderID).First(&order).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &order, nil
}

func (r *orderImpl) FindByStatusAndUserId(status string, userId *int, page, limit int) ([]models.Orders, int, error) {
	var orders []models.Orders
	var totalItems int64

	offset := (page - 1) * limit

	lowerStatus := strings.ToLower(status)

	query := r.postgresDB.Model(&models.Orders{})

	// Filter berdasarkan status (case-insensitive)
	if lowerStatus == "confirm" {
		query = query.Where("LOWER(status) IN (?)", []string{"completed", "failed"})
	} else {
		query = query.Where("LOWER(status) = ?", lowerStatus)
	}

	// Filter berdasarkan user_id jika ada
	if userId != nil {
		query = query.Where("user_id = ?", *userId)
	}

	// Hitung total items
	if err := query.Count(&totalItems).Error; err != nil {
		return nil, 0, err
	}

	// Pagination dan ambil data
	if err := query.Limit(limit).Offset(offset).Find(&orders).Error; err != nil {
		return nil, 0, err
	}

	return orders, int(totalItems), nil
}

func (r *orderImpl) UpdateOrderStatus(orderID int, status string) error {
	result := r.postgresDB.Model(&models.Orders{}).Where("order_id = ?", orderID).Update("status", status)
	return result.Error
}

func (r *orderImpl) FindOrderIdByFranchiseId(franchiseId string) (*uint, error) {
	var order models.Orders

	err := r.postgresDB.Where("franchise_id = ?", franchiseId).First(&order).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &order.ID, nil
}

func (r *orderImpl) CreateOrder(order models.Orders) error {
	if err := r.postgresDB.Create(&order).Error; err != nil {
		return err
	}
	return nil
}
