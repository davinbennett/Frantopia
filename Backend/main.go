package main

import "github.com/gin-gonic/gin"
// import "net/http"
// import "Backend/routes"
import "fmt"
import "Backend/infrastructure"

func main() {
	router := gin.Default()

	// Connect to databases
	postgresDB := infrastructure.InitPostgresDB()
	mongoDB := infrastructure.InitMongoDB()

	// JWT Middleware

	// Initialize routes

	
	// router.GET("/", func(c *gin.Context){
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"name": "Davin",
	// 		"desc": "Bennett",
	// 	})
	// })

	fmt.Println(postgresDB, mongoDB)

	router.Run()
}