package seed

import (
	"log"

	"github.com/AlfonDrn/project-management/config"
	"github.com/AlfonDrn/project-management/models"
	"github.com/AlfonDrn/project-management/utils"
	"github.com/google/uuid"
)

func SeedAdmin() {
	password, _ := utils.HashPassword("admin123")

	admin := models.User{
		Name: "Super Admin",
		Email: "admin@example.com",
		Password: password,
		Role: "admin",
		PublicID: uuid.New(),
	}

	if err := config.DB.FirstOrCreate(&admin, models.User{Email: admin.Email}).Error; err != nil {
		log.Println("Failed to seed admin", err) 
	} else {
		log.Println("Admin user seeded")
	}

}