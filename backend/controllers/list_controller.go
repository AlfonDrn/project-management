package controllers

import (
	"github.com/AlfonDrn/project-management/models"
	"github.com/AlfonDrn/project-management/services"
	"github.com/AlfonDrn/project-management/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ListController struct {
	service services.ListService
}

func NewListController(s services.ListService) *ListController {
	return &ListController{service: s}
}

func (c *ListController) CreateList(ctx *fiber.Ctx) error {
	list := new(models.List)
	if err := ctx.BodyParser(list); err != nil {
		return utils.BadRequest(ctx, "Gagal Membaca Request", err.Error())
	}
	if err := c.service.Create(list); err != nil {
		return utils.BadRequest(ctx, "Gagal Membuat List", err.Error())
	}
	return utils.Success(ctx, "List Berhasil Dibuat", list)
}

func (c *ListController) UpdateList(ctx *fiber.Ctx) error {
	publicID := ctx.Params("id")
	list := new(models.List)

	if err := ctx.BodyParser(list); err != nil {
		return utils.BadRequest(ctx, "Gagal Parsing Data", err.Error())
	}

	if _, err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx, "ID Tidak Valid", err.Error())
	}

	existingList, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx, "List Tidak Ditemukan", err.Error())
	}
	list.InternalID = existingList.InternalID
	list.PublicID = existingList.PublicID

	if err := c.service.Update(list); err != nil {
		return utils.BadRequest(ctx, "Gagal Update List", err.Error())
	}

	updatedList, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx, "List Tidak Ditemukan", err.Error())
	}

	return utils.Success(ctx, "Berhasil Memperbaharui List", updatedList)
}

func (c *ListController) GetListOnBoard(ctx *fiber.Ctx) error {
	boardPublicID := ctx.Params("board_id")
	if _, err := uuid.Parse(boardPublicID); err != nil {
		return utils.BadRequest(ctx, "ID Tidak Valid", err.Error())
	}

	lists, err := c.service.GetByBoardID(boardPublicID)
	if err != nil {
		return utils.NotFound(ctx, "List Tidak Ditemukan", err.Error())
	}

	return utils.Success(ctx, "Data Berhasil Diambil", lists)
}

func (c *ListController) DeleteList(ctx *fiber.Ctx) error {
	publicID := ctx.Params("id")
	if _, err := uuid.Parse(publicID); err != nil {
		return utils.BadRequest(ctx, "ID Tidak Valid", err.Error())
	}

	list, err := c.service.GetByPublicID(publicID)
	if err != nil {
		return utils.NotFound(ctx, "List Tidak Ditemukan", err.Error())
	}
	
	if err := c.service.Delete(uint(list.InternalID)); err != nil {
		return utils.InternalServerError(ctx, "Gagal Menghapus List", err.Error())
	}

	return utils.Success(ctx, "Berhasil Menghapus List", publicID)
}

func (c *ListController) UpdateListPosition(ctx *fiber.Ctx) error {
	boardID := ctx.Params("board_id")
	if _, err := uuid.Parse(boardID); err != nil {
		return utils.BadRequest(ctx, "ID Tidak Valid", err.Error())
	}

	var positionUUID []uuid.UUID
	if err := ctx.BodyParser(&positionUUID); err != nil {
		//jika gagal, coba parse sebagai array of string
		var positionString []string
		if err := ctx.BodyParser(&positionString); err != nil {
			return utils.BadRequest(ctx, "Format JSON posisi tidak valid", err.Error())
		}
		//konversi string ke UUID
		for _, s := range positionString {
			u, err := uuid.Parse(s)
			if err != nil {
				return utils.BadRequest(ctx, "Invalid positon format", err.Error())
			}
			positionUUID = append(positionUUID, u)
		}
	}
	if err := c.service.UpdatePositions(boardID, positionUUID); err != nil {
		return utils.InternalServerError(ctx, "Gagal update list", err.Error())
	}
	return utils.Success(ctx, "positi List berhasil diperbaharui", nil)
}