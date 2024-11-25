package controllers

import (
	"Backend/models"
	"Backend/services"
	"fmt"
	"net/http"
	"strconv"
	"strings"

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

func (c *OrderController) GetOrderByID(ctx *gin.Context) {
	orderID := ctx.Param("id")
	order, err := c.orderService.GetOrderByID(orderID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Internal server error"})
		return
	}

	if order == nil {
		ctx.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Order not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 200,
		"data": order,
	})
}

func (c *OrderController) GetOrdersByStatus(ctx *gin.Context) {
	status := ctx.Query("status")
	page, _ := strconv.Atoi(ctx.Query("page"))
	limit, _ := strconv.Atoi(ctx.Query("limit"))

	orders, err := c.orderService.GetOrdersByStatus(status, page, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 200,
		"page": page,
		"data": orders,
	})
}

func (c *OrderController) UpdateOrderStatus(ctx *gin.Context) {
	orderIDParam := ctx.Param("id")
	orderID, err := strconv.Atoi(orderIDParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	var requestBody struct {
		Status string `json:"status"`
	}
	if err := ctx.ShouldBindJSON(&requestBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	fmt.Println(requestBody)

	if strings.ToLower(requestBody.Status) != "accept" && strings.ToLower(requestBody.Status) != "decline" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
		return
	}

	status := "Completed"
	if strings.ToLower(requestBody.Status) == "decline" {
		status = "Failed"
	}

	err = c.orderService.UpdateOrderStatus(orderID, status)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Order status updated successfully",
	})
}

func (c *OrderController) GetIdOrderByFranchiseId(ctx *gin.Context) {
	franchiseIdParam := ctx.Param("franchiseId")

	orderID, err := c.orderService.GetOrderIdByFranchiseId(franchiseIdParam)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if orderID == nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 200,
			"data": gin.H{
				"order_id": nil,
			},
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 200,
		"data": gin.H{
			"order_id": *orderID,
		},
	})
}

func (ctrl *OrderController) CreateOrder(ctx *gin.Context) {
	var order models.Orders

	if err := ctx.ShouldBindJSON(&order); err != nil {
		fmt.Println("err: " + err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	fmt.Println("order:", order)

	err := ctrl.orderService.CreateOrder(order)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Order"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 200,
	})
}
