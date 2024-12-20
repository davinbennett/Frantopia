package routes

import (
	"Backend/controllers"

	"github.com/gin-gonic/gin"
)

func OrderRoutes(router *gin.RouterGroup, orderController *controllers.OrderController) {
	apiRoutes := router.Group("/order")
	{
		apiRoutes.GET("/total-sold", orderController.GetTotalSold)
		apiRoutes.GET("/sales-analytics", orderController.GetSalesAnalytics)
		apiRoutes.GET("/category-analytics", orderController.GetCategoryAnalytics)
		apiRoutes.GET("/:id", orderController.GetOrderByID)
		apiRoutes.GET("/", orderController.GetOrdersByStatusAndUserId)
		apiRoutes.GET("/franchise-id/:franchiseId", orderController.GetIdOrderByFranchiseId)
		
		apiRoutes.PUT("/:id/status", orderController.UpdateOrderStatus)

		apiRoutes.POST("/", orderController.CreateOrder)
	}
}
