package main

import (
	"log"

	"github.com/AlfonDrn/project-management/config"
	"github.com/AlfonDrn/project-management/controllers"
	"github.com/AlfonDrn/project-management/database/seed"
	"github.com/AlfonDrn/project-management/repositories"
	"github.com/AlfonDrn/project-management/routes"
	"github.com/AlfonDrn/project-management/services"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	config.LoadEnv()
	config.ConnectDB()
	seed.SeedAdmin()

	app := fiber.New()

	app.Static("/files", "./public/files")

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Mengizinkan web React (dan web lainnya) untuk mengakses API ini
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	//user
	userRepo := repositories.NewUserRepository()
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService)

	//board
	boardRepo := repositories.NewBoardRepository()
	boardMemberRepo := repositories.NewBoardMemberRepository()
	boardService := services.NewBoardService(boardRepo, userRepo, boardMemberRepo)
	boardController := controllers.NewBoardController(boardService)

	//list
	listPosRepo := repositories.NewListPositionRepository()
	listRepo := repositories.NewListRepository()
	listService := services.NewListService(listRepo, boardRepo, listPosRepo)
	listController := controllers.NewListController(listService)

	//card
	cardRepo := repositories.NewCardRepository()
	cardService := services.NewCardService(cardRepo, listRepo, userRepo)
	cardController := controllers.NewCardController(cardService)

	//attachment
	attachmentRepo := repositories.NewAttachmentRepository()
	attachmentService := services.NewAttachmentService(attachmentRepo, cardRepo, userRepo)
	attachmentController := controllers.NewAttachmentController(attachmentService)

	routes.Setup(app, userController, boardController, listController, cardController, attachmentController)

	port := config.AppConfig.AppPort
	log.Println("Server is running on port :", port)
	log.Fatal(app.Listen(":" + port))
}