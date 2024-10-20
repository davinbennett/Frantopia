package implementations

import (
	"Backend/models"
	"Backend/repositories/interfaces"
	"database/sql"
	"errors"

	// "fmt"
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
	period_2 := period

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

	// Filter tahun
	if period_2 == "yearly" {
		query = query.Where("EXTRACT(YEAR FROM order_date) >= EXTRACT(YEAR FROM NOW()) - 5")
	} else {
		query = query.Where("EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM NOW()) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())")
	}

	switch period {
	case "monthly":
		query = query.Group("CASE " +
			"WHEN EXTRACT(MONTH FROM order_date) = 1 OR EXTRACT(MONTH FROM order_date) = 2 THEN '1' " +
			"WHEN EXTRACT(MONTH FROM order_date) = 3 OR EXTRACT(MONTH FROM order_date) = 4 THEN '3' " +
			"WHEN EXTRACT(MONTH FROM order_date) = 5 OR EXTRACT(MONTH FROM order_date) = 6 THEN '5' " +
			"WHEN EXTRACT(MONTH FROM order_date) = 7 OR EXTRACT(MONTH FROM order_date) = 8 THEN '7' " +
			"WHEN EXTRACT(MONTH FROM order_date) = 9 OR EXTRACT(MONTH FROM order_date) = 10 THEN '9' " +
			"WHEN EXTRACT(MONTH FROM order_date) = 11 OR EXTRACT(MONTH FROM order_date) = 12 THEN '11' " +
			"END")
	case "quarterly":
		query = query.Group("EXTRACT(QUARTER FROM order_date)")
	case "yearly":
		query = query.Group("EXTRACT(YEAR FROM order_date)")
	case "day":
		startDate, _ := time.Parse("2006-01-02", start)
		endDate, _ := time.Parse("2006-01-02", end)

		endDate = endDate.AddDate(0, 0, 1)

		query = query.Where("order_date BETWEEN ? AND ?", startDate, endDate).
			Group("EXTRACT(DAY FROM order_date)")
	}

	rows, err := query.Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	switch period_2 {
	case "monthly":
		for rows.Next() {
			var period sql.NullString
			var totalSold sql.NullFloat64
			err = rows.Scan(&period, &totalSold)
			if err != nil {
				return nil, err
			}
			orderData = append(orderData, map[string]interface{}{
				"month":      period.String,
				"total-sold": totalSold.Float64,
			})
		}
	case "quarterly":
		for rows.Next() {
			var period sql.NullString
			var totalSold sql.NullFloat64
			err = rows.Scan(&period, &totalSold)
			if err != nil {
				return nil, err
			}
			orderData = append(orderData, map[string]interface{}{
				"quarter":    period.String,
				"total-sold": totalSold.Float64,
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
		query = query.Where("EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM NOW()) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())")
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
		query = query.Where("EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM NOW()) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())")
	case "quarterly":
		query = query.Where("EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM NOW()) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())")
	case "yearly":
		query = query.Where("EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW())")
	case "day":
		startDate, _ := time.Parse("2006-01-02", start)
		endDate, _ := time.Parse("2006-01-02", end)

		endDate = endDate.AddDate(0, 0, 1)

		query = query.Where("order_date BETWEEN ? AND ?", startDate, endDate)

	}

	err := query.Scan(&franchiseIDs).Error
	if err != nil {
		return nil, err
	}

	return franchiseIDs, nil
}
