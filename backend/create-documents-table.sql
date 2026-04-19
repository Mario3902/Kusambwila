-- ============================================================================
-- Kusambwila - Documents Table Creation Script
-- This script creates the documents table for storing landlord submissions
-- ============================================================================

-- First, ensure we're using the correct database
USE kusambwila_db;

-- ============================================================================
-- Table: documents
-- Purpose: Store documents submitted by landlords for verification
-- ============================================================================

CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique document ID',
  `userId` INT NOT NULL COMMENT 'ID of the landlord who submitted the document',
  `documentType` ENUM('bi', 'propertyTitle', 'addressProof') NOT NULL COMMENT 'Type of document: bi (Identity), propertyTitle, addressProof',
  `fileName` VARCHAR(255) NOT NULL COMMENT 'Original file name uploaded by user',
  `filePath` VARCHAR(255) NOT NULL COMMENT 'Server path where file is stored (/uploads/filename)',
  `fileSize` INT COMMENT 'File size in bytes',
  `mimeType` VARCHAR(100) COMMENT 'MIME type of the file (application/pdf, image/jpeg, etc)',
  `status` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending' COMMENT 'Current status of the document',
  `rejectionReason` TEXT COMMENT 'Reason why document was rejected (if applicable)',
  `uploadedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When the document was uploaded',
  `verifiedAt` DATETIME COMMENT 'When the document was reviewed by admin',
  `verifiedBy` INT COMMENT 'ID of admin who verified the document',
  `adminNotes` TEXT COMMENT 'Optional notes from admin reviewer',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last update timestamp',

  -- Foreign Keys
  CONSTRAINT `fk_documents_userId` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_documents_verifiedBy` FOREIGN KEY (`verifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,

  -- Indexes for performance
  INDEX `idx_userId` (`userId`),
  INDEX `idx_status` (`status`),
  INDEX `idx_documentType` (`documentType`),
  INDEX `idx_uploadedAt` (`uploadedAt`),
  INDEX `idx_verifiedBy` (`verifiedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores documents submitted by landlords for admin verification';

-- ============================================================================
-- Verification
-- ============================================================================
-- To verify the table was created successfully, run:
-- SHOW CREATE TABLE documents;
-- DESCRIBE documents;

-- ============================================================================
-- Sample Insert Statement (for testing)
-- ============================================================================
-- INSERT INTO `documents` (userId, documentType, fileName, filePath, fileSize, mimeType)
-- VALUES (2, 'bi', 'identity.pdf', '/uploads/bi-1704067200000-abc123.pdf', 524288, 'application/pdf');

-- ============================================================================
-- Drop table (if needed for cleanup)
-- ============================================================================
-- DROP TABLE IF EXISTS `documents`;
