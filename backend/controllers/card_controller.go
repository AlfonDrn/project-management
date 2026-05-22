package controllers

import (
	// "fmt"
	// "os"
	"time"

	"github.com/AlfonDrn/project-management/models"
	"github.com/AlfonDrn/project-management/services"
	"github.com/AlfonDrn/project-management/utils"
	"github.com/gofiber/fiber/v2"
	// "github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type CardController struct {
	service services.CardService
}

func NewCardController(s services.CardService) *CardController {
	return &CardController{service: s}
}

func (c *CardController) CreateCard(ctx *fiber.Ctx) error {
	type CreateCardRequest struct {
		ListPublicID string    `json:"list_id"`
		Title        string    `json:"title"`
		Description  string    `json:"description"`
		DueDate      time.Time `json:"due_date"`
		Position     int       `json:"positon"`
	}

	var req CreateCardRequest
	if err := ctx.BodyParser(&req); err != nil {
		return utils.BadRequest(ctx, "Gagal Mengambil Data", err.Error())
	}

	card := &models.Card{
		Title:       req.Title,
		Description: req.Description,
		DueDate:     &req.DueDate,
		Position:    req.Position,
	}

	if err := c.service.Create(card, req.ListPublicID); err != nil {
		return utils.InternalServerError(ctx, "Gagal Membuat Card", err.Error())
	}

	return utils.Success(ctx, "Card Berhasil Dibuat", card)
}

func (c *CardController) UpdateCard(ctx *fiber.Ctx) error {
	publicID := ctx.Params("id")

	type updateCardRequest struct {
		ListPublicID string    `json:"list_id"`
		Title        string    `json:"title"`
		Description  string    `json:"description"`
		DueDate      time.Time `json:"due_date"`
		Position     int       `json:"position"`
	}

	var req updateCardRequest
	if err := ctx.BodyParser(&req); err != nil {
		return utils.BadRequest(ctx, "Gagal Parsing Data", err.Error())
	}

	if _, err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx, "ID Tidak Valid", err.Error())
	}

	card := &models.Card{
		Title:       req.Title,
		Description: req.Description,
		DueDate:     &req.DueDate,
		Position:    req.Position,
		PublicID:    uuid.MustParse(publicID),
	}

	if err := c.service.Update(card, req.ListPublicID); err != nil {
		return utils.InternalServerError(ctx, "Gagal Update Data", err.Error())
	}

	return utils.Success(ctx, "Card Berhasil Diperbaharui", card)
}

func (c *CardController) GetCardsByListID(ctx *fiber.Ctx) error {
	listPublicID := ctx.Params("list_id")

	cards, err := c.service.GetByListID(listPublicID)
	if err != nil {
		return utils.NotFound(ctx, "Gagal mengambil data cards", err.Error())
	}

	return utils.Success(ctx, "Berhasil mengambil cards", cards)
}

func (c *CardController) UpdateCardPosition(ctx *fiber.Ctx) error {
	listPublicID := ctx.Params("id")

	var req struct {
		Positions []string `json:"positions"`
	}
	if err := ctx.BodyParser(&req); err != nil {
		return utils.BadRequest(ctx, "Gagal Parsing Data", err.Error())
	}

	if err := c.service.UpdatePositions(listPublicID, req.Positions); err != nil {
		return utils.InternalServerError(ctx, "Gagal Update Posisi Card", err.Error())
	}

	return utils.Success(ctx, "Berhasil Update Posisi Card", nil)
}

func (c *CardController) GetCardDetail(ctx *fiber.Ctx) error {
	cardPublicID := ctx.Params("id")

	card, err := c.service.GetByPublicID(cardPublicID)
	if err != nil {
		return utils.InternalServerError(ctx, "error saat mengambil data", err.Error())
	}
	if card == nil {
		return utils.NotFound(ctx, "Card tidak ditemukan", "")
	}
	return utils.Success(ctx, "Data berhasil diambil", card)
}

func (c *CardController) AddAssignee(ctx *fiber.Ctx) error {
	cardPublicID := ctx.Params("id")

	var req struct {
		UserIDs []string `json:"user_id"`
	}

	if err := ctx.BodyParser(&req); err != nil {
		return utils.BadRequest(ctx, "Gagal Parsing Data", err.Error())
	}

	if err := c.service.AddAssignees(cardPublicID, req.UserIDs); err != nil {
		return utils.InternalServerError(ctx, "Gagal Menambahkan Assignee", err.Error())
	}

	return utils.Success(ctx, "Berhasil Menambahkan Assignee", nil)
}

func (c *CardController) DeleteCard (ctx *fiber.Ctx) error {
	publicID := ctx.Params("id")

	if _ , err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx, "ID tidak valid", err.Error())
	}

	card, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx, "Card tidak ditemukan", err.Error())
	}

	if err := c.service.Delete(uint(card.InternalID)); err != nil {
		return utils.BadRequest(ctx, "Gagal Menghapus Data", err.Error())
	}

	return  utils.Success(ctx, "Card Berhasil Dihapus", publicID)
}