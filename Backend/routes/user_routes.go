package routes

import (
	"Backend/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.RouterGroup, userController *controllers.UserController, cartController *controllers.CartController) {
	apiRoutes := router.Group("/user")
	{
		apiRoutes.GET("/:id/cart/count", cartController.GetCartCount)
		apiRoutes.GET("/:id/cart", cartController.GetCart)
		apiRoutes.GET("/:id/address", userController.GetUserAddress)
		apiRoutes.GET("/:id/profile", userController.GetUserProfile)

		apiRoutes.DELETE("/:id/cart", cartController.DeleteCartItem)

		apiRoutes.POST("/:id/cart", cartController.AddToCart)

		apiRoutes.PUT("/:id/address", userController.UpdateAddress)
		apiRoutes.PUT("/:id/cart/status", cartController.UpdateStatusCart)
	}
}
