import express from 'express';
import { sendMessage } from '../controllers/chat.controller.js';

const router = express.Router();

/**
 * @route   POST /api/chat
 * @desc    Send chat message and get AI response
 * @access  Public
 */
router.post('/', sendMessage);

export default router;
