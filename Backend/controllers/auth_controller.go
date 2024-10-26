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

func (c *AuthController) LoginController() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var requestBody struct {
			IDToken string `json:"idToken" binding:"required"`
			AccessToken string `json:"accessToken" binding:"required"`
		}

		if err := ctx.ShouldBindJSON(&requestBody); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"code":  http.StatusBadRequest,
				"error": "Invalid request",
			})
			return
		}

		jwtToken, userID, err := c.authService.Login(requestBody.IDToken, requestBody.AccessToken)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"code":  http.StatusBadRequest,
				"error": err.Error(),
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"code": http.StatusOK,
			"data": gin.H{
				"jwtToken": jwtToken,
				"user_id":  userID,
			},
		})
	}
}
