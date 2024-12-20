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
		apiRoutes.GET("", productController.GetProductByFilters())
		apiRoutes.GET("/:id", productController.GetProductByID())
		apiRoutes.GET("/:id/gallery", productController.GetProductGallery())
		apiRoutes.GET("/:id/package/:packageId", productController.GetPackageByID())
		apiRoutes.GET("/:id/category", productController.GetProductCategory)
		apiRoutes.GET("/:id/package", productController.GetPackages())
		apiRoutes.GET("/:id/profile", productController.GetProfileByID())

		apiRoutes.POST("/", productController.CreateProduct())

		apiRoutes.PUT("/:id", productController.UpdateProduct())
		apiRoutes.PUT("/:id/status", productController.UpdateStatusByProductId())
	}
}
