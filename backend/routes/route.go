package routes

import (
	"log"

	"github.com/AlfonDrn/project-management/config"
	"github.com/AlfonDrn/project-management/controllers"
	"github.com/AlfonDrn/project-management/utils"
	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func Setup(app *fiber.App,
	uc *controllers.UserController,
	bc *controllers.BoardController,
	lc *controllers.ListController,
	cc *controllers.CardController,
	ac *controllers.AttachmentController) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	app.Post("/v1/auth/register", uc.Register)
	app.Post("/v1/auth/login", uc.Login)

	// JWT PROTECTED ROUTE
	api := app.Group("/api/v1", jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(config.AppConfig.JWTSecret)},
		ContextKey: "user",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return utils.Unauthorized(c, "Error Unauthorized", err.Error())
		},
	}))

	userGroup := api.Group("/users")
	userGroup.Get("/page", uc.GetUserPagination)
	userGroup.Get("/:id", uc.GetUser) // /api/v1/users/:id
	userGroup.Put("/:id", uc.UpdateUser)
	userGroup.Delete("/:id", uc.DeleteUser)

	boardGroup := api.Group("/boards")
	boardGroup.Post("/", bc.CreateBoard)
	boardGroup.Get("/my", bc.GetMyBoardPaginate)
	boardGroup.Put("/:id", bc.UpdateBoard)
	boardGroup.Get("/:id", bc.GetBoardDetail)
	boardGroup.Post("/:id/members", bc.AddBoardmembers)
	boardGroup.Delete("/:id/members", bc.RemoveBoardMembers)
	boardGroup.Get("/:id/members", bc.GetBoardMembers)
	boardGroup.Get("/:board_id/lists", lc.GetListOnBoard)
	boardGroup.Put("/:board_id/positions", lc.UpdateListPosition)

	//list
	listGroup := api.Group("/lists")
	listGroup.Post("/", lc.CreateList)
	listGroup.Put("/:id", lc.UpdateList)
	listGroup.Delete("/:id", lc.DeleteList)
	listGroup.Get("/:list_id/cards", cc.GetCardsByListID)
	listGroup.Put("/:id/positions", cc.UpdateCardPosition)

	//card
	cardGroup := api.Group("/cards")
	cardGroup.Post("/", cc.CreateCard)
	cardGroup.Put("/:id", cc.UpdateCard)
	cardGroup.Get("/:id", cc.GetCardDetail)
	cardGroup.Delete("/:id", cc.DeleteCard)
	cardGroup.Post("/:id/assignees", cc.AddAssignee)

	cardGroup.Post("/:id/attachments", ac.UploadAttachment)
	cardGroup.Get("/:id/attachments", ac.GetAttachments)
	cardGroup.Delete("/:card_id/attachments/:attachment_id", ac.DeleteAttachment)
}
