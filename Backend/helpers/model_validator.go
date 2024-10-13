package helpers

import (
	"regexp"
	"github.com/go-playground/validator/v10"
)

func ContainsNumber(fl validator.FieldLevel) bool {
	password := fl.Field().String()
	re := regexp.MustCompile(`[0-9]`)
	return re.MatchString(password)
}