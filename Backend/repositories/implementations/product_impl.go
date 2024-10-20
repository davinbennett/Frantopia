package implementations

import (
	models "Backend/models/products"
	"Backend/repositories/interfaces"
	"context"
	"errors"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type productImpl struct {
	mongoDB *mongo.Database
}

func NewProductImpl(mongoClient *mongo.Database) interfaces.ProductRepository {
	return &productImpl{
		mongoDB: mongoClient,
	}
}

func (r *productImpl) GetTotalProducts() (int, error) {
	collection := r.mongoDB.Collection("franchises")

	filter := bson.M{}

	count, err := collection.CountDocuments(context.TODO(), filter)

	if err != nil {
		return 0, errors.New("failed to fetch total products from MongoDB")
	}

	return int(count), nil
}

func (r *productImpl) GetCategoryByFranchiseID(franchiseID string) (string, error) {
	var franchise models.Franchise

	objectId, err := primitive.ObjectIDFromHex(franchiseID)
	if err != nil {
		return "", fmt.Errorf("invalid franchise ID format: %v", err)
	}

	filter := bson.D{{Key: "_id", Value: objectId}}

	ctx := context.TODO()

	err = r.mongoDB.Collection("franchises").FindOne(ctx, filter).Decode(&franchise)

	if err != nil {
		// fmt.Println(err)
		return "", err
	}

	return franchise.Category, nil
}

func (r *productImpl) FindByName(name string) ([]*models.Franchise, error) {
	var products []*models.Franchise

	filter := bson.M{"name": bson.M{"$regex": name, "$options": "i"}}

	cursor, err := r.mongoDB.Collection("franchises").Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var product models.Franchise
		err := cursor.Decode(&product)
		if err != nil {
			return nil, err
		}
		products = append(products, &product)
	}

	if len(products) == 0 {
		return nil, nil
	}

	return products, nil
}
