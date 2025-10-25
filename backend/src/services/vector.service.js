import { generateEmbedding } from './embedding.service.js';
import { AppError } from '../middleware/error.middleware.js';

// In-memory vector store
const memoryStore = new Map();

/**
 * Store document chunks with embeddings in vector database
 */
export async function storeDocumentVectors(documentId, chunks) {
  try {
    console.log('Storing chunks in memory');

    // Generate embeddings for all chunks
    const chunksWithEmbeddings = [];

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk.text);
      chunksWithEmbeddings.push({
        ...chunk,
        embedding
      });
    }

    memoryStore.set(documentId, chunksWithEmbeddings);
    console.log(`✅ Stored ${chunks.length} chunks for document ${documentId}`);

    return { success: true, count: chunks.length };
  } catch (error) {
    console.error('Vector storage error:', error);
    throw new AppError(`Failed to store vectors: ${error.message}`, 500);
  }
}

/**
 * Search for similar chunks using query embedding
 */
export async function searchSimilarChunks(documentId, queryText, topK = 5) {
  try {
    console.log('Searching in memory store');
    const chunks = memoryStore.get(documentId) || [];

    if (chunks.length === 0) {
      return [];
    }

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(queryText);

    // Calculate cosine similarity for each chunk
    const results = chunks.map(chunk => {
      const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        text: chunk.text,
        pageNumber: chunk.pageNumber,
        similarity,
        metadata: {
          documentId,
          pageNumber: chunk.pageNumber,
          chunkIndex: chunk.chunkIndex
        }
      };
    });

    // Sort by similarity and return top K
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  } catch (error) {
    console.error('Vector search error:', error);
    throw new AppError(`Failed to search vectors: ${error.message}`, 500);
  }
}

/**
 * Delete all vectors for a document
 */
export async function deleteDocumentVectors(documentId) {
  try {
    memoryStore.delete(documentId);
    console.log(`✅ Deleted vectors for document ${documentId}`);
    return { success: true };
  } catch (error) {
    console.error('Vector deletion error:', error);
    throw new AppError(`Failed to delete vectors: ${error.message}`, 500);
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

export default {
  storeDocumentVectors,
  searchSimilarChunks,
  deleteDocumentVectors
};