import express from 'express';
import { upload } from '../middleware/upload.middleware.js';
import {
  uploadDocument,
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
 * @route   DELETE /api/documents/:id
 * @desc    Delete document
 * @access  Public
 */
router.delete('/:id', deleteDocument);

export default router;
