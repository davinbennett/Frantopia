package controllers

import (
	"Backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ShippingController struct {
	shippingService services.ShippingService
}

func NewShippingController(shippingService services.ShippingService) *ShippingController {
	return &ShippingController{shippingService: shippingService}
}

func (c *ShippingController) GetShippingMethods() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		shippings, err := c.shippingService.GetShippingMethods()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"code":  http.StatusInternalServerError,
				"error": err.Error(),
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"code": http.StatusOK,
			"data": shippings,
		})
	}
}
