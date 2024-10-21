package routes

import (
	"Backend/controllers"
	"Backend/infrastructure"
	"Backend/middleware"
	"Backend/repositories/implementations"
	"Backend/services"

	"github.com/gin-gonic/gin"
)

func InitRoutes(router *gin.Engine, authController *controllers.AuthController) {
	apiRoutes := router.Group("/api/v1")
	{
		AuthRoutes(apiRoutes, authController)

		protectedRoutes := apiRoutes.Group("/")
		protectedRoutes.Use(middleware.JWTMiddleware())
		{
			mongoDB := infrastructure.GetMongoClient().Database("frantopia-mongo")
			postgresDB := infrastructure.GetPostgresDB()

			productRepo := implementations.NewProductImpl(mongoDB)
			productService := services.NewProductService(productRepo)
			productController := controllers.NewProductController(productService)

			userRepo := implementations.NewUserImpl(postgresDB)

			orderRepo := implementations.NewOrderImpl(postgresDB)
			orderService := services.NewOrderService(orderRepo, productRepo, userRepo)
			orderController := controllers.NewOrderController(orderService)

			ProductRoutes(protectedRoutes, productController)
			OrderRoutes(protectedRoutes, orderController)
			// UserRoutes(protectedRoutes)
			// CartRoutes(protectedRoutes)
			// PaymentRoutes(protectedRoutes)
			// ProductRoutes(protectedRoutes)
			// ShippingRoutes(protectedRoutes)A
		}
	}
}
