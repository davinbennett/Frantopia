package infrastructure

import (
	"fmt"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var collection *mongo.Collection

func InitPostgresDB() *gorm.DB {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s", "localhost", "postgres", "qwerty12", "frantopia-db", "5432", "disable", "Asia/Jakarta")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
      fmt.Println("Failed to connect to Postgres:", err)
		return db
   }
	fmt.Println("Posgre SUCCESS")
   return db
}

func InitMongoDB() *mongo.Client{
	client, err := mongo.Connect(options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		fmt.Println("Failed to connect to Mongo:", err)
	}
	fmt.Println("Mongo SUCCESS")
	return client
}
