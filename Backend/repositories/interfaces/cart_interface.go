package interfaces

import (
	models "Backend/models"
)

type CartRepository interface {
	GetCartCountByUserID(userID int) (int, error)
	GetCartByUserID(userID int) (*models.Cart, error)
	DeleteCartItem(userID int, cartID string) error
	AddToCart(userID int, cartItem models.CartItem) error
}