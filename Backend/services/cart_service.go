package services

import (
	"Backend/models"
	"Backend/repositories/interfaces"
	"fmt"
)

type CartService interface {
	GetCartCountByUserID(userID int) (int, error)
	GetCartByUserID(userID int) ([]map[string]interface{}, int, error)
	DeleteCartItem(userID int, cartID string) error
	AddToCart(userID int, cartItem models.CartItem) error
	UpdateStatusCart(userID int, cartID, status string) error
}

type cartServiceImpl struct {
	cartRepo interfaces.CartRepository
}

func NewCartService(repo interfaces.CartRepository) CartService {
	return &cartServiceImpl{cartRepo: repo}
}

func (s *cartServiceImpl) GetCartCountByUserID(userID int) (int, error) {
	return s.cartRepo.GetCartCountByUserID(userID)
}

func (s *cartServiceImpl) GetCartByUserID(userID int) ([]map[string]interface{}, int, error) {
	cart, err := s.cartRepo.GetCartByUserID(userID)
	if err != nil {
		return nil, 0, err
	}
	if cart == nil {
		return nil, 0, nil
	}

	var listCartResponse []map[string]interface{}
	for _, item := range cart.ListCart {
		listCartResponse = append(listCartResponse, map[string]interface{}{
			"cart_id":        item.CartID.Hex(),
			"franchise_id":   item.FranchiseID,
			"package_id":     item.PackageID,
			"franchise-name": item.FranchiseName,
			"package-name":   item.PackageName,
			"size_concept":   item.SizeConcept,
			"gross_profit":   item.GrossProfit,
			"income":         item.Income,
			"price":          item.Price,
			"status":         item.Status,
			"profile":        item.Profile,
			"licensed":       item.Licensed,
		})
	}

	var totalPrice int
	for _, item := range cart.ListCart {
		totalPrice += item.Price
	}

	return listCartResponse, totalPrice, nil
}

func (s *cartServiceImpl) DeleteCartItem(userID int, cartID string) error {
	return s.cartRepo.DeleteCartItem(userID, cartID)
}

func (s *cartServiceImpl) AddToCart(userID int, cartItem models.CartItem) error {
	fmt.Println(cartItem.PackageID + " | " + cartItem.FranchiseName)
	return s.cartRepo.AddToCart(userID, cartItem)
}

func (s *cartServiceImpl) UpdateStatusCart(userID int, cartID, status string) error {
	return s.cartRepo.UpdateStatusCart(userID, cartID, status)
}