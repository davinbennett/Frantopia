package routes

// import (
// 	"Backend/controllers"

// 	"github.com/gin-gonic/gin"
// )

// func PaymentRoutes(router *gin.Engine) {
// 	paymentGroup := router.Group("/payment")
// 	{
// 		paymentGroup.POST("/start", controllers.StartPayment)               // Route untuk memulai transaksi pembayaran
// 		paymentGroup.POST("/notification", controllers.PaymentNotification) // Route untuk menangani callback/notification dari payment gateway
// 		paymentGroup.GET("/verify/:orderID", controllers.VerifyPayment)     // Route untuk memverifikasi status pembayaran
// 		paymentGroup.GET("/status/:orderID", controllers.GetPaymentStatus)  // Route untuk mendapatkan status pembayaran
// 	}
// }
