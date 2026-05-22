package repositories

import (
	"fmt"
	"path/filepath"

	"github.com/AlfonDrn/project-management/config"
	"github.com/AlfonDrn/project-management/models"
	"github.com/AlfonDrn/project-management/models/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CardRepository interface {
	Create(card *models.Card) error
	Update(card *models.Card) error
	Delete(id uint) error
	FindByID(id uint) (*models.Card, error)
	FindByPublicID(publicID string) (*models.Card, error)
	FindByListID(listID string) ([]models.Card, error)
	FindCardPositionByListID(id int64) (*models.CardPosition, error)
	UpdatePositon(listID string, position []string) error
	AddAssignees(cardPublicID string, userPublicIDs []string) error
	CreateAttachment(attachment *models.CardAttachment) error
	FindAttachmentByPublicID(publicID string) (*models.CardAttachment, error)
	DeleteAttachment(internalID int64) error
}

type cardRepository struct {

}

func NewCardRepository() CardRepository {
	return &cardRepository{}
}

func (r *cardRepository) Create(card *models.Card) error {
	return config.DB.Create(card).Error
}

func (r *cardRepository) Update(card *models.Card) error {
	return config.DB.Save(card).Error
}

func (r *cardRepository) Delete(id uint) error {
	return config.DB.Delete(&models.Card{}, id).Error
}

func (r *cardRepository) FindByID(id uint) (*models.Card, error) {
	var card models.Card
	err := config.DB.Preload("Labels").Preload("Assignees").First(&card, id).Error

	return &card, err
}

func (r *cardRepository) FindByPublicID(publicID string) (*models.Card, error) {
	var card models.Card
	if err := config.DB.Preload("Assignees.User", func(tx *gorm.DB) *gorm.DB {
		return tx.Select("internal_id", "public_id", "name", "email")
	}).Preload("Attachments").Where("public_id = ?", publicID).First(&card).Error; err != nil {
		return nil, err
	}

	baseUrl := config.AppConfig.APPURL
	
	for i := range card.Attachments {
		card.Attachments[i].FileUrl = fmt.Sprintf("%s/files/%s",
		baseUrl,
		filepath.Base(card.Attachments[i].File),)
	}

	return &card, nil
}

func (r *cardRepository) FindByListID(listID string) ([]models.Card, error) {
	var cards []models.Card
	err := config.DB.Joins("JOIN lists ON lists.internal_id = cards.list_internal_id").
		Where("lists.public_id = ?", listID).
		Order("position ASC").
		Find(&cards).Error
	return cards, err
}

func (r *cardRepository) FindCardPositionByListID(id int64) (*models.CardPosition, error) {
	var position models.CardPosition
	err := config.DB.Where("list_internal_id = ?", id).First(&position).Error
	if err != nil {
		return nil, err
	}
	return &position, nil
}

// func (r *cardRepository) UpdatePositon(listID string, position []string) error {
// 	return config.DB.Model(&models.CardPosition{}).
// 	Where("list_internal_id = (SELECT internal_id FROM lists WHERE public_id = ?)", listID).
// 	Update("card_order", position).Error
// }

func (r *cardRepository) UpdatePositon(listID string, position []string) error {
	// Terjemahkan []string menjadi tipe data UUIDArray yang diterima database
	var cardOrder types.UUIDArray
	for _, pos := range position {
		parsed, err := uuid.Parse(pos)
		if err == nil {
			cardOrder = append(cardOrder, parsed)
		}
	}

	return config.DB.Model(&models.CardPosition{}).
		Where("list_internal_id = (SELECT internal_id FROM lists WHERE public_id = ?)", listID).
		Update("card_order", cardOrder).Error
}

func (r *cardRepository) AddAssignees(cardPublicID string, userPublicIDs []string) error {
	// a. Cari internal_id dari card
	var card models.Card
	if err := config.DB.Where("public_id = ?", cardPublicID).First(&card).Error; err != nil {
		return err
	}

	// b. Mulai transaksi database
	tx := config.DB.Begin()

	// c. Hapus semua assignee lama (sinkronisasi ulang)
	if err := tx.Where("card_internal_id = ?", card.InternalID).Delete(&models.CardAssignee{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	// d. Jika ada member yang dipilih, masukkan ke database
	if len(userPublicIDs) > 0 {
		var users []models.UserLite
		if err := tx.Where("public_id IN ?", userPublicIDs).Find(&users).Error; err != nil {
			tx.Rollback()
			return err
		}

		var newAssignees []models.CardAssignee
		for _, u := range users {
			newAssignees = append(newAssignees, models.CardAssignee{
				CardID: card.InternalID,
				UserID: u.InternalID,
			})
		}
		
		if err := tx.Create(&newAssignees).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}

func (r *cardRepository) CreateAttachment(attachment *models.CardAttachment) error {
	return config.DB.Create(attachment).Error
}

func (r *cardRepository) FindAttachmentByPublicID(publicID string) (*models.CardAttachment, error) {
	var attachment models.CardAttachment
	if err := config.DB.Where("public_id = ?", publicID).First(&attachment).Error; err != nil {
		return nil, err
	}
	return &attachment, nil
}

func (r *cardRepository) DeleteAttachment(internalID int64) error {
	return config.DB.Delete(&models.CardAttachment{}, internalID).Error
}