package helpers

import (
	"github.com/go-playground/validator/v10"
)

func RegisterCustomValidator() {
	validate := validator.New()
	validate.RegisterValidation("containsnumber", ContainsNumber)
}	