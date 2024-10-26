package implementations

import (
	"Backend/models"
	"Backend/repositories/interfaces"
	"context"
	"time"

	// "fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type cartImpl struct {
	mongoDB *mongo.Database
}

func NewCartImpl(mongoClient *mongo.Database) interfaces.CartRepository {
	return &cartImpl{
		mongoDB: mongoClient,
	}
}

func (r *cartImpl) GetCartCountByUserID(userID int) (int, error) {
	var cart models.Cart
	filter := bson.M{"user_id": userID}

	err := r.mongoDB.Collection("carts").FindOne(context.TODO(), filter).Decode(&cart)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return 0, nil
		}
		return 0, err
	}

	return len(cart.ListCart), nil
}

func (r *cartImpl) GetCartByUserID(userID int) (*models.Cart, error) {
	var cart models.Cart
	filter := bson.M{"user_id": userID}

	err := r.mongoDB.Collection("carts").FindOne(context.TODO(), filter).Decode(&cart)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &cart, nil
}

func (r *cartImpl) DeleteCartItem(userID int, cartID string) error {
	cartObjectID, err := primitive.ObjectIDFromHex(cartID)
	if err != nil {
		return err
	}

	// Filter untuk mencari dokumen pengguna berdasarkan `user_id`
	filter := bson.M{"user_id": userID, "list-cart.cart_id": cartObjectID}

	// Update untuk menghapus item tertentu dari array `list-cart`
	update := bson.M{"$pull": bson.M{"list-cart": bson.M{"cart_id": cartObjectID}}}

	_, err = r.mongoDB.Collection("carts").UpdateOne(context.TODO(), filter, update)
	return err
}

func (r *cartImpl) AddToCart(userID int, cartItem models.CartItem) error {
	collection := r.mongoDB.Collection("carts")

	// Check if cart for user already exists
	filter := bson.M{"user_id": userID}
	var cart models.Cart
	err := collection.FindOne(context.Background(), filter).Decode(&cart)
	if err != nil && err != mongo.ErrNoDocuments {
		return err
	}

	now := time.Now().UTC().Add(7 * time.Hour)

	if cart.ID.IsZero() {
		// Create new cart if it doesn't exist
		cart = models.Cart{
			ID:        primitive.NewObjectID(),
			UserID:    userID,
			ListCart:  []models.CartItem{cartItem},
			CreatedAt: now,
			UpdatedAt:  now,
		}
		_, err = collection.InsertOne(context.Background(), cart)
	} else {
		// Update existing cart
		update := bson.M{
			"$push": bson.M{"list-cart": cartItem},
			"$set":  bson.M{"updated_at": time.Now().Add(7 * time.Hour)},
		}
		_, err = collection.UpdateOne(context.Background(), filter, update)
	}

	return err
}
