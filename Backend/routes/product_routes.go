package routes

import (
	"Backend/controllers"

	"github.com/gin-gonic/gin"
)

func ProductRoutes(router *gin.RouterGroup, productController *controllers.ProductController) {
	apiRoutes := router.Group("/product")
	{
		apiRoutes.GET("/total-product", productController.GetTotalProducts())
		apiRoutes.GET("/search", productController.SearchProduct())
	}
}
