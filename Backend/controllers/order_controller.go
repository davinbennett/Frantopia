// controllers/order_controller.go
package controllers

import (
	"Backend/services"
	"net/http"

	// "fmt"
	"github.com/gin-gonic/gin"
)

type OrderController struct {
	orderService services.OrderService
}

func NewOrderController(service services.OrderService) *OrderController {
	return &OrderController{orderService: service}
}

func (c *OrderController) GetSalesAnalytics(ctx *gin.Context) {
	period := ctx.Query("period")
	start := ctx.Query("start")
	end := ctx.Query("end")
	if period == "day" && (start == "" || end == "") {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "start and end date are required for 'day' period"})
		return
	}

	orderData, err := c.orderService.GetSalesAnalytics(period, start, end)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 200,
		"data": gin.H{
			"period":     period,
			"order-data": orderData,
		},
	})
}

func (c *OrderController) GetTotalSold(ctx *gin.Context) {
	period := ctx.Query("period")
	start := ctx.Query("start")
	end := ctx.Query("end")

	validPeriods := map[string]bool{
		"monthly":   true,
		"quarterly": true,
		"yearly":    true,
	}

	if period == "day" {
		if start == "" || end == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "start and end date are required for 'day' period"})
			return
		}
	} else if !validPeriods[period] {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid period. Allowed values are: monthly, quarterly, yearly, day"})
		return
	}

	totalSold, err := c.orderService.GetTotalSold(period, start, end)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 200,
		"data": gin.H{
			"period":     period,
			"total-sold": totalSold,
		},
	})
}

func (c *OrderController) GetCategoryAnalytics(ctx *gin.Context) {
	period := ctx.Query("period")
	start := ctx.Query("start")
	end := ctx.Query("end")

	categoryData, err := c.orderService.GetCategoryAnalytics(period, start, end)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 200,
		"data": categoryData,
	})
}
