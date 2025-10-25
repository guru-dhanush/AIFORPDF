import { collection } from '../config/chroma.config.js';
import { generateEmbedding } from './embedding.service.js';
import { AppError } from '../middleware/error.middleware.js';

// In-memory fallback if ChromaDB is not available
const memoryStore = new Map();

/**
 * Store document chunks with embeddings in vector database
 */
export async function storeDocumentVectors(documentId, chunks) {
  try {
    if (!collection) {
      // Use in-memory fallback
      console.log('Using in-memory vector store');
      memoryStore.set(documentId, chunks);
      return { success: true, count: chunks.length };
    }

    // Generate embeddings for all chunks
    const texts = chunks.map(chunk => chunk.text);
    const embeddings = [];
    
    // Generate embeddings one by one (Gemini API limitation)
    for (const text of texts) {
      const embedding = await generateEmbedding(text);
      embeddings.push(embedding);
    }

    // Prepare data for ChromaDB
    const ids = chunks.map(chunk => `${documentId}_${chunk.id}`);
    const metadatas = chunks.map(chunk => ({
      documentId,
      pageNumber: chunk.pageNumber,
      chunkIndex: chunk.chunkIndex,
      text: chunk.text.substring(0, 500) // Store preview
    }));

    // Add to ChromaDB
    await collection.add({
      ids,
      embeddings,
      metadatas,
      documents: texts
    });

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
    if (!collection) {
      // Use in-memory fallback
      console.log('Using in-memory search');
      const chunks = memoryStore.get(documentId) || [];
      
      // Simple keyword matching fallback
      const query = queryText.toLowerCase();
      const results = chunks
        .map(chunk => ({
          text: chunk.text,
          pageNumber: chunk.pageNumber,
          similarity: chunk.text.toLowerCase().includes(query) ? 0.8 : 0.3
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
      
      return results;
    }

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(queryText);

    // Search in ChromaDB
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
      where: { documentId }
    });

    // Format results
    const formattedResults = [];
    if (results.documents && results.documents[0]) {
      for (let i = 0; i < results.documents[0].length; i++) {
        formattedResults.push({
          text: results.documents[0][i],
          pageNumber: results.metadatas[0][i].pageNumber,
          similarity: 1 - (results.distances[0][i] || 0),
          metadata: results.metadatas[0][i]
        });
      }
    }

    return formattedResults;
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
    if (!collection) {
      memoryStore.delete(documentId);
      return { success: true };
    }

    // Get all IDs for this document
    const results = await collection.get({
      where: { documentId }
    });

    if (results.ids && results.ids.length > 0) {
      await collection.delete({
        ids: results.ids
      });
      console.log(`✅ Deleted ${results.ids.length} vectors for document ${documentId}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Vector deletion error:', error);
    throw new AppError(`Failed to delete vectors: ${error.message}`, 500);
  }
}

export default {
  storeDocumentVectors,
  searchSimilarChunks,
  deleteDocumentVectors
};
