package controllers

import (
	models "Backend/models/products"
	"Backend/services"
	"net/http"
	"strconv"

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

func (pc *ProductController) GetProductByFilters() gin.HandlerFunc {
	return func(c *gin.Context) {
		priceMin := c.Query("price-min")
		priceMax := c.Query("price-max")
		location := c.Query("location")
		category := c.Query("category")

		// Pagination parameter
		page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
		if err != nil || page < 1 {
			page = 1
		}

		limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
		if err != nil || limit < 1 {
			limit = 10
		}

		products, err := pc.productService.SearchByFilters(priceMin, priceMax, location, category, page, limit)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"code": 200,
			"data": products,
		})
	}
}

func (c *ProductController) GetProductByID() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		productID := ctx.Param("id")

		productData, err := c.productService.GetProductByID(productID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if productData == nil {
			ctx.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"code": 200, "data": productData})
	}
}

func (c *ProductController) GetProductGallery() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		productID := ctx.Param("id")

		galleryData, err := c.productService.GetProductGallery(productID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if galleryData == nil {
			ctx.JSON(http.StatusNotFound, gin.H{"message": "Gallery not found for the product"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"code": 200, "data": galleryData})
	}
}

func (c *ProductController) GetPackageByID() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		productID := ctx.Param("id")
		packageID := ctx.Param("packageId")

		packageData, err := c.productService.GetPackageByID(productID, packageID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if packageData == nil {
			ctx.JSON(http.StatusNotFound, gin.H{"message": "Package not found"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"code": 200, "data": packageData})
	}
}

func (c *ProductController) CreateProduct() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var product models.Franchise

		if err := ctx.ShouldBindJSON(&product); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		err := c.productService.CreateProduct(product)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"code": 200,
			"data": "Product created successfully",
		})
	}
}

func (c *ProductController) UpdateProduct() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		productID := ctx.Param("id")

		var updatedProduct models.Franchise

		if err := ctx.ShouldBindJSON(&updatedProduct); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		err := c.productService.UpdateProduct(productID, updatedProduct)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"code": 200,
			"data": "Product updated successfully",
		})
	}
}

func (c *ProductController) GetProductCategory(ctx *gin.Context) {
	productID := ctx.Param("id")

	category, err := c.productService.GetProductCategoryByID(productID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if category == "" {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"product_id": productID,
		"category":   category,
	})
}

func (c *ProductController) GetPackages() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		productID := ctx.Param("id")

		packages, err := c.productService.GetPackages(productID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"code":  http.StatusInternalServerError,
				"error": "Failed to fetch packages",
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"code": http.StatusOK,
			"data": packages,
		})
	}
}