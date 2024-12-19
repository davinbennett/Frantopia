package services

import (
	"Backend/models"
	"Backend/repositories/interfaces"
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
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
	// fetch cart from mongo by userID
	cart, err := s.cartRepo.GetCartByUserID(userID)
	if err != nil {
		return nil, 0, err
	}
	if cart == nil {
		return nil, 0, nil
	}

	// Ambil semua franchise_id dari list cart
	var franchiseIDs []string
	for _, item := range cart.ListCart {
		franchiseID, err := primitive.ObjectIDFromHex(item.FranchiseID) // convert string ke ObjectID
		if err != nil {
			return nil, 0, err
		}
		franchiseIDs = append(franchiseIDs, franchiseID.Hex())
	}

	// Fetch status franchise dari collection franchises
	franchiseStatuses, err := s.cartRepo.GetFranchiseStatusByIDs(franchiseIDs)
	if err != nil {
		return nil, 0, err
	}

	// Mapping status berdasarkan franchise_id
	statusMap := make(map[string]string)
	for franchiseID, status := range franchiseStatuses {
		statusMap[franchiseID] = status
	}

	var listCartResponse []map[string]interface{}

	for _, item := range cart.ListCart {
		updatedStatus := statusMap[item.FranchiseID]

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
			"status":         updatedStatus,
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
