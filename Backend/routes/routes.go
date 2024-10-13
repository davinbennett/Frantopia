package routes

import (
	"Backend/controllers"
	"Backend/middleware"

	"github.com/gin-gonic/gin"
)

func InitRoutes(router *gin.Engine, authController *controllers.AuthController) {
	apiRoutes := router.Group("/api/v1")
	{
		AuthRoutes(apiRoutes, authController)

		protectedRoutes := apiRoutes.Group("/")
		protectedRoutes.Use(middleware.JWTMiddleware())

		{
			// UserRoutes(protectedRoutes)
			// CartRoutes(protectedRoutes)
			// OrderRoutes(protectedRoutes)
			// PaymentRoutes(protectedRoutes)
			// ProductRoutes(protectedRoutes)
			// ShippingRoutes(protectedRoutes)
		}

	}
}
