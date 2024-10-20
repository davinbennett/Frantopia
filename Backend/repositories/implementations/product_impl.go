package implementations

import (
	models "Backend/models/products"
	"Backend/repositories/interfaces"
	"context"
	"errors"
	"fmt"
	"strconv"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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

func (r *productImpl) FindByFilters(priceMin, priceMax, location, category string, page, limit int) ([]*models.Franchise, error) {
	var products []*models.Franchise

	filter := bson.M{}
	if priceMin != "" {
		min, _ := strconv.ParseFloat(priceMin, 64)
		filter["price"] = bson.M{"$gte": min}
	}
	if priceMax != "" {
		max, _ := strconv.ParseFloat(priceMax, 64)
		if _, ok := filter["price"]; ok {
			filter["price"].(bson.M)["$lte"] = max
		} else {
			filter["price"] = bson.M{"$lte": max}
		}
	}
	if location != "" {
		filter["location"] = bson.M{"$regex": location, "$options": "i"}
	}
	if category != "" {
		filter["category"] = category
	}

	// Pagination setting
	skip := (page - 1) * limit

	cursor, err := r.mongoDB.Collection("franchises").Find(context.TODO(), filter, options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var product models.Franchise
		if err := cursor.Decode(&product); err != nil {
			return nil, err
		}
		products = append(products, &product)
	}

	return products, nil
}

func (r *productImpl) GetNameByFranchiseID(franchiseID string) (string, error) {
	var franchise models.Franchise

	objectId, err := primitive.ObjectIDFromHex(franchiseID)
	if err != nil {
		return "", fmt.Errorf("invalid franchise ID format: %v", err)
	}

	filter := bson.D{{Key: "_id", Value: objectId}}

	err = r.mongoDB.Collection("franchises").FindOne(context.TODO(), filter).Decode(&franchise)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return "", fmt.Errorf("franchise not found for FranchiseID: %s", franchiseID)
		}
		return "", err
	}

	return franchise.Name, nil
}

func (r *productImpl) FindByID(productID string) (*models.Franchise, error) {
	var product models.Franchise

	objectId, err := primitive.ObjectIDFromHex(productID)

	filter := bson.D{{Key: "_id", Value: objectId}}

	err = r.mongoDB.Collection("franchises").FindOne(context.TODO(), filter).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &product, nil
}

func (r *productImpl) FindGalleryByID(productID string) ([]string, error) {
	var product models.Franchise

	objectId, err := primitive.ObjectIDFromHex(productID)

	filter := bson.D{{Key: "_id", Value: objectId}}

	err = r.mongoDB.Collection("franchises").FindOne(context.TODO(), filter).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return product.Gallery, nil
}

func (r *productImpl) FindPackageByID(productID string, packageID string) (map[string]interface{}, error) {
	var product models.Franchise

	objectId, err := primitive.ObjectIDFromHex(productID)

	filter := bson.D{{Key: "_id", Value: objectId}}

	err = r.mongoDB.Collection("franchises").FindOne(context.TODO(), filter).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	for _, pkg := range product.PackageFranchises {
		if pkg.PackageID.Hex() == packageID {
			return map[string]interface{}{
				"package_id":   pkg.PackageID.Hex(),
				"name":         pkg.Name,
				"size_concept": pkg.SizeConcept,
				"gross_profit": pkg.GrossProfit,
				"income":       pkg.Income,
				"price":        pkg.Price,
			}, nil
		}
	}

	return nil, nil
}
