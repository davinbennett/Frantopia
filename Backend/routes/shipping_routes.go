package routes

import (
	"Backend/controllers"

	"github.com/gin-gonic/gin"
)

func ShippingRoutes(router *gin.RouterGroup, shippingController *controllers.ShippingController) {
	apiRoutes := router.Group("/shipping")
	{
		apiRoutes.GET("/", shippingController.GetShippingMethods())
	}
}
