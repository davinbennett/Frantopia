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
			userService := services.NewUserService(userRepo)
			userController := controllers.NewUserController(userService)

			cartRepo := implementations.NewCartImpl(mongoDB)
			cartService := services.NewCartService(cartRepo)
			cartController := controllers.NewCartController(cartService)

			orderRepo := implementations.NewOrderImpl(postgresDB)
			orderService := services.NewOrderService(orderRepo, productRepo, userRepo)
			orderController := controllers.NewOrderController(orderService)

			shippingRepo := implementations.NewShippingImpl(postgresDB)
			shippingService := services.NewShippingService(shippingRepo)
			shippingController := controllers.NewShippingController(shippingService)

			ProductRoutes(protectedRoutes, productController)
			OrderRoutes(protectedRoutes, orderController)
			UserRoutes(protectedRoutes, userController, cartController)
			ShippingRoutes(protectedRoutes, shippingController)
			// PaymentRoutes(protectedRoutes)
			// ProductRoutes(protectedRoutes)
			// ShippingRoutes(protectedRoutes)A
		}
	}
}
