import express from 'express';
import { upload } from '../middleware/upload.middleware.js';
import {
  uploadDocument,
  getDocument,
  getAllDocuments,
  deleteDocument
} from '../controllers/document.controller.js';

const router = express.Router();

/**
 * @route   POST /api/documents/upload
 * @desc    Upload and process PDF document
 * @access  Public
 */
router.post('/upload', upload.single('pdf'), uploadDocument);

/**
 * @route   GET /api/documents
 * @desc    Get all documents
 * @access  Public
 */
router.get('/', getAllDocuments);

/**
 * @route   GET /api/documents/:id
 * @desc    Get document by ID
 * @access  Public
 */
router.get('/:id', getDocument);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete document
 * @access  Public
 */
router.delete('/:id', deleteDocument);

export default router;
