import { embeddingModel } from '../config/gemini.config.js';
import { AppError } from '../middleware/error.middleware.js';

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text) {
  if (!embeddingModel) {
    throw new AppError('Gemini API not configured', 500);
  }

  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw new AppError(`Failed to generate embedding: ${error.message}`, 500);
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddings(texts) {
  if (!embeddingModel) {
    throw new AppError('Gemini API not configured', 500);
  }

  try {
    const embeddings = await Promise.all(
      texts.map(async (text) => {
        const result = await embeddingModel.embedContent(text);
        return result.embedding.values;
      })
    );
    return embeddings;
  } catch (error) {
    console.error('Batch embedding error:', error);
    throw new AppError(`Failed to generate embeddings: ${error.message}`, 500);
  }
}

export default {
  generateEmbedding,
  generateEmbeddings
};
