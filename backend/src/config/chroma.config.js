import { ChromaClient } from 'chromadb';
import dotenv from 'dotenv';

dotenv.config();

let chromaClient = null;
let collection = null;

async function initializeChroma() {
  try {
    chromaClient = new ChromaClient({
      path: process.env.CHROMA_HOST || 'http://localhost:8000'
    });
    
    // Create or get collection
    const collectionName = process.env.CHROMA_COLLECTION_NAME || 'pdf_documents';
    
    try {
      collection = await chromaClient.getOrCreateCollection({
        name: collectionName,
        metadata: { description: 'PDF document embeddings for RAG' }
      });
      console.log('✅ ChromaDB initialized successfully');
    } catch (error) {
      console.log('ℹ️  ChromaDB collection created');
      collection = await chromaClient.createCollection({
        name: collectionName,
        metadata: { description: 'PDF document embeddings for RAG' }
      });
    }
  } catch (error) {
    console.warn('⚠️  ChromaDB not available. Using in-memory fallback.');
    console.warn('   To use ChromaDB, run: docker run -p 8000:8000 chromadb/chroma');
  }
}

// Initialize on module load
initializeChroma();

export { chromaClient, collection };
export default chromaClient;
