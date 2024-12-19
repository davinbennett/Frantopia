package implementations

import (
	models "Backend/models/products"
	"Backend/repositories/interfaces"
	"context"
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"

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

	fmt.Println("franchiseID: ", franchiseID)

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

func getFirstWord(location string) string {
	location = strings.ReplaceAll(location, "+", " ")

	location = regexp.MustCompile(`[^\w\s]`).ReplaceAllString(location, "")

	parts := strings.Fields(location)
	firstWord := strings.TrimSpace(parts[0])

	return firstWord
}

func (r *productImpl) FindByFilters(priceMin, priceMax, location, category, status string, page, limit int) ([]*models.Franchise, int64, error) {

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
		firstWord := getFirstWord(location)
		regexPattern := fmt.Sprintf(".*%s.*", firstWord)
		fmt.Println("WORD: ", regexPattern)

		filter["location"] = bson.M{"$regex": `.*` + regexPattern + `.*`, "$options": "i"}

		fmt.Println("fliter:", filter["location"])
	}
	if category != "" {
		filter["category"] = category
	}
	if status != "" {
		filter["status"] = status
	}

	// Pagination setting
	skip := (page - 1) * limit

	totalItems, err := r.mongoDB.Collection("franchises").CountDocuments(context.TODO(), filter)
	if err != nil {
		return nil, 0, err
	}

	cursor, err := r.mongoDB.Collection("franchises").Find(context.TODO(), filter, options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)))
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var product models.Franchise
		if err := cursor.Decode(&product); err != nil {
			return nil, 0, err
		}
		products = append(products, &product)
	}

	if err := cursor.Err(); err != nil {
		return nil, 0, err
	}

	return products, totalItems, nil
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

func (r *productImpl) AddProduct(product models.Franchise) error {
	for i := range product.PackageFranchises {
		product.PackageFranchises[i].PackageID = primitive.NewObjectID()
		product.PackageFranchises[i].CreatedAt = time.Now().Add(7 * time.Hour)
		product.PackageFranchises[i].UpdatedAt = time.Now().Add(7 * time.Hour)
	}

	for i := range product.Income {
		product.Income[i].IncomeID = primitive.NewObjectID()
		product.Income[i].CreatedAt = time.Now().Add(7 * time.Hour)
		product.Income[i].UpdatedAt = time.Now().Add(7 * time.Hour)
	}

	_, err := r.mongoDB.Collection("franchises").InsertOne(context.TODO(), product)
	if err != nil {
		return err
	}
	return nil
}

func (r *productImpl) UpdateProduct(productID string, updatedProduct models.Franchise) error {
	objectId, err := primitive.ObjectIDFromHex(productID)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": objectId}

	update := bson.M{
		"$set": bson.M{
			"name":               updatedProduct.Name,
			"category":           updatedProduct.Category,
			"established":        updatedProduct.Established,
			"description":        updatedProduct.Description,
			"price":              updatedProduct.Price,
			"licensed":           updatedProduct.Licensed,
			"rating":             updatedProduct.Rating,
			"location":           updatedProduct.Location,
			"deposit":            updatedProduct.Deposit,
			"royalty_fee":        updatedProduct.RoyaltyFee,
			"outlet_sales":       updatedProduct.OutletSales,
			"stock":              updatedProduct.Stock,
			"profile":            updatedProduct.Profile,
			"gallery":            updatedProduct.Gallery,
			"package_franchises": updatedProduct.PackageFranchises,
			"income":             updatedProduct.Income,
			"status":             updatedProduct.Status,
			"updated_at":         time.Now().Add(7 * time.Hour),
		},
	}

	_, err = r.mongoDB.Collection("franchises").UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}

	return nil
}

func (r *productImpl) GetProductCategoryByID(productID string) (string, error) {
	objectId, err := primitive.ObjectIDFromHex(productID)
	if err != nil {
		return "", err
	}

	filter := bson.D{{Key: "_id", Value: objectId}}
	projection := bson.D{{Key: "category", Value: 1}}

	var result struct {
		Category string `bson:"category"`
	}

	err = r.mongoDB.Collection("franchises").FindOne(
		context.Background(),
		filter,
		options.FindOne().SetProjection(projection),
	).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return "", nil
		}
		return "", err
	}

	return result.Category, nil
}

func (r *productImpl) GetPackages(productID string) ([]models.PackageFranchises, error) {
	objectID, err := primitive.ObjectIDFromHex(productID)
	if err != nil {
		return nil, fmt.Errorf("invalid product ID")
	}

	filter := bson.M{"_id": objectID}
	var result struct {
		PackageFranchises []models.PackageFranchises `bson:"package_franchises"`
	}
	err = r.mongoDB.Collection("franchises").FindOne(context.Background(), filter).Decode(&result)
	if err != nil {
		return nil, err
	}

	return result.PackageFranchises, nil
}

func (r *productImpl) GetProfileByID(franchiseID string) (string, error) {
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

	return franchise.Profile, nil
}

func (r *productImpl) UpdateStatusByProductId(productID string, status string) error {
	objectId, err := primitive.ObjectIDFromHex(productID)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": objectId}

	update := bson.M{
		"$set": bson.M{
			"status":     status,
			"updated_at": time.Now().Add(7 * time.Hour),
		},
	}

	_, err = r.mongoDB.Collection("franchises").UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}

	return nil
}
