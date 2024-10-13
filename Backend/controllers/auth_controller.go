package controllers

import (
	"Backend/services"
	// "fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService services.AuthService
}

func NewAuthController(authService services.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

func (c *AuthController) LoginHandler() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var requestBody struct {
			IDToken string `json:"idToken" binding:"required"`
		}

		if err := ctx.ShouldBindJSON(&requestBody); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		jwtToken, err := c.authService.Login(requestBody.IDToken)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"jwtToken": jwtToken,
		})
	}
}

