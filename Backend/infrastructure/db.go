package infrastructure

import (
	"context"
	"fmt"
	"Backend/models"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	mongoClient *mongo.Client
	postgresDB  *gorm.DB
	redisClient *redis.Client
	ctx         = context.Background()
)

// InitPostgresDB initializes the PostgreSQL database connection.
func InitPostgresDB() error {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s", 
		"localhost", "postgres", "qwerty12", "frantopia-db", "5432", "disable", "Asia/Jakarta")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		return fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	err = db.AutoMigrate(&models.User{})
	if err != nil {
		fmt.Println("Failed to migrate User model: ", err)
		return nil
	}

	postgresDB = db
	fmt.Println("PostgreSQL connection successful")
	return nil
}

// InitMongoDB initializes the MongoDB connection.
func InitMongoDB() error {
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	if err = client.Ping(ctx, nil); err != nil {
		return fmt.Errorf("failed to ping MongoDB: %w", err)
	}

	mongoClient = client
	fmt.Println("MongoDB connection successful")
	return nil
}

// InitRedis initializes the Redis client.
func InitRedis() error {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	// Test the Redis connection
	_, err := client.Ping(ctx).Result()
	if err != nil {
		return fmt.Errorf("failed to connect to Redis: %w", err)
	}

	redisClient = client
	fmt.Println("Redis connection successful")
	return nil
}

// GetPostgresDB returns the PostgreSQL client instance.
func GetPostgresDB() *gorm.DB {
	return postgresDB
}

// GetMongoClient returns the MongoDB client instance.
func GetMongoClient() *mongo.Client {
	return mongoClient
}

// GetRedisClient returns the Redis client instance.
func GetRedisClient() *redis.Client {
	return redisClient
}
