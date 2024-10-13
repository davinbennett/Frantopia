package main

import (
	"Backend/controllers"
	"Backend/infrastructure"
	"Backend/repositories/implementations"
	"Backend/routes"
	"Backend/services"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.New()
	router.Use(gin.Logger())

	if err := infrastructure.InitPostgresDB(); err != nil {
		fmt.Println("Error connecting to PostgreSQL:", err)
		return
	}

	if err := infrastructure.InitMongoDB(); err != nil {
		fmt.Println("Error connecting to MongoDB:", err)
		return
	}

	authRepo := implementations.NewAuthImpl(infrastructure.GetPostgresDB()) 
	authService := services.NewAuthService(authRepo)                       
	authController := controllers.NewAuthController(authService)

	routes.InitRoutes(router, authController)

	router.Run()
}
