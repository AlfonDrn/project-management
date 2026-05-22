package services

import (
	"errors"
	"time"

	"github.com/AlfonDrn/project-management/models"
	"github.com/AlfonDrn/project-management/repositories"
	"github.com/google/uuid"
)

type AttachmentService interface {
	GetByPublicID(pubId uuid.UUID) ( *models.CardAttachment, error )
	Create(cardPublicID, userPublicID, filename string) (*models.CardAttachment, error)
	DeleteByPublicID(pubId uuid.UUID) error
	GetAttachments(cardPublicID string) ([]models.CardAttachment, error)
}

type attachmentService struct {
	attachmentRepo repositories.AttachmentRepository
	cardRepo repositories.CardRepository
	userRepo repositories.UserRepository
}

func NewAttachmentService (
	attachmentRepo repositories.AttachmentRepository,
	cardRepo repositories.CardRepository,
	userRepo repositories.UserRepository,
) AttachmentService {
	return &attachmentService{attachmentRepo, cardRepo, userRepo}
}

func (s *attachmentService) GetByPublicID(pubId uuid.UUID) ( *models.CardAttachment, error ) {
	return s.attachmentRepo.GetByPublicID(pubId)
}

func (s *attachmentService) Create(cardPublicID, userPublicID, filename string) (*models.CardAttachment, error) {
	Card , err := s.cardRepo.FindByPublicID(cardPublicID)
	if err != nil {
		return nil, errors.New("Card not found")
	}
	user, err := s.userRepo.FindByPublicID(userPublicID)
	if err != nil {
		return nil, errors.New("user not found")
	}
	attach := &models.CardAttachment{
		PublicID: uuid.New(),
		CardID: Card.InternalID,
		UserID: user.InternalID,
		File: filename,
		CreatedAt: time.Now(),
	}

	if err := s.attachmentRepo.Create(attach); err != nil {
		return nil, err
	}
	return attach, nil
}

func (s *attachmentService) DeleteByPublicID(pubId uuid.UUID) error {
	return s.attachmentRepo.DeleteByPublicID(pubId)
}

func (s *attachmentService) GetAttachments(cardPublicID string) ([]models.CardAttachment, error) {
	return s.attachmentRepo.FindByCardId(cardPublicID)
}