import { generateChatResponse } from '../services/ai.service.js';
import { AppError } from '../middleware/error.middleware.js';

/**
 * Handle chat message and generate AI response
 */
export async function sendMessage(req, res, next) {
  try {
    const { documentId, message, chatHistory } = req.body;

    // Validate input
    if (!documentId) {
      throw new AppError('Document ID is required', 400);
    }

    if (!message || !message.trim()) {
      throw new AppError('Message is required', 400);
    }

    console.log(`Processing chat message for document: ${documentId}`);
    console.log(`Query: "${message}"`);

    // Generate AI response with RAG
    const response = await generateChatResponse(
      documentId,
      message.trim(),
      chatHistory || []
    );

    console.log(`Response generated with ${response.citations.length} citations`);

    res.json({
      success: true,
      data: {
        message: response.text,
        citations: response.citations,
        context: response.context || []
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    next(error);
  }
}

export default {
  sendMessage
};
