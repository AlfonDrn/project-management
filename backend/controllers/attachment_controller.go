package controllers

import (
	"fmt"
	"os"

	"github.com/AlfonDrn/project-management/services"
	"github.com/AlfonDrn/project-management/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type AttachmentController struct {
	service services.AttachmentService
}

// Constructor untuk controller baru
func NewAttachmentController(s services.AttachmentService) *AttachmentController {
	return &AttachmentController{service: s}
}

func (c *AttachmentController) UploadAttachment(ctx *fiber.Ctx) error {
	cardPublicID := ctx.Params("id") // Sesuai dengan route /cards/:id/attachments

	// Ambil data user dari JWT
	userLocals := ctx.Locals("user")
	if userLocals == nil {
		return utils.Unauthorized(ctx, "Akses ditolak: Token tidak ditemukan", uuid.Nil.String())
	}
	userToken := userLocals.(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	// Pastikan pub_id user ada di dalam token 
	userPublicID, ok := claims["pub_id"].(string)
	if !ok {
		return utils.Unauthorized(ctx, "Token tidak valid: pub_id tidak ditemukan", "pub_id_is_missing")
	}

	// Proses File Fisik
	file, err := ctx.FormFile("file")
	if err != nil {
		return utils.BadRequest(ctx, "Gagal mengambil file", err.Error())
	}

	uniqueFilename := uuid.New().String() + "-" + file.Filename
	dirPath := "./public/files"
	if err := os.MkdirAll(dirPath, os.ModePerm); err != nil {
		return utils.InternalServerError(ctx, "Gagal membuat folder", err.Error())
	}
	filePath := fmt.Sprintf("%s/%s", dirPath, uniqueFilename)

	if err := ctx.SaveFile(file, filePath); err != nil {
		return utils.InternalServerError(ctx, "Gagal menyimpan file fisik", err.Error())
	}

	// Simpan ke Database menggunakan service yang dimiliki
	attachment, err := c.service.Create(cardPublicID, userPublicID, uniqueFilename)
	if err != nil {
		return utils.InternalServerError(ctx, "Gagal menyimpan data ke database", err.Error())
	}

	attachment.FileUrl = "/files/" + uniqueFilename
	return utils.Success(ctx, "Berhasil mengunggah file", attachment)
}

func (c *AttachmentController) GetAttachments(ctx *fiber.Ctx) error {
	cardPublicID := ctx.Params("id")

	attachments, err := c.service.GetAttachments(cardPublicID)
	if err != nil {
		return utils.InternalServerError(ctx, "Gagal mengambil daftar attachment", err.Error())
	}

	for i := range attachments {
		attachments[i].FileUrl = "/files/" + attachments[i].File
	}

	return utils.Success(ctx, "Berhasil mengambil daftar attachment", attachments)
}

func (c *AttachmentController) DeleteAttachment(ctx *fiber.Ctx) error {
	attachmentPublicID := ctx.Params("attachment_id")

	parsedUUID, err := uuid.Parse(attachmentPublicID)
	if err != nil {
		return utils.BadRequest(ctx, "Format ID Attachment tidak valid", err.Error())
	}

	if err := c.service.DeleteByPublicID(parsedUUID); err != nil {
		return utils.InternalServerError(ctx, "Gagal menghapus attachment", err.Error())
	}

	return utils.Success(ctx, "Berhasil menghapus attachment", nil)
}