package routes

import (
	"Backend/controllers"
	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.RouterGroup, authController *controllers.AuthController) {
	apiRoutes := router.Group("/auth")
	{
		apiRoutes.POST("/login", authController.LoginController()) 
	}
}
