package controllers

import (
	"Backend/services"
	// "fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProductController struct {
	productService services.ProductService
}

func NewProductController(productService services.ProductService) *ProductController {
	return &ProductController{productService: productService}
}

func (c *ProductController) GetTotalProducts() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		total, err := c.productService.GetTotalProducts()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"code": http.StatusInternalServerError,
				"data": "Failed to get total products",
			})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{
			"code": http.StatusOK,
			"data": gin.H{
				"total-product": total,
			},
		})
	}
}

func (c *ProductController) SearchProduct() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		productName := ctx.Query("product-name")
		if productName == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "product-name is required"})
			return
		}

		product, err := c.productService.SearchProductByName(productName)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}

		if product == nil {
			ctx.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Product not found"})
			return
		}
		
		ctx.JSON(http.StatusOK, gin.H{
			"code": 200,
			"data": product,
		})
	}
}
