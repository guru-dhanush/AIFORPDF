import { db, bucket } from '../config/firebase.config.js';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/error.middleware.js';

// In-memory fallback if Firebase is not configured
const memoryDB = new Map();

/**
 * Upload PDF to Firebase Storage
 */
export async function uploadPDFToStorage(buffer, filename) {
  try {
    if (!bucket) {
      console.log('Firebase not configured, using in-memory storage');
      const fileId = uuidv4();
      memoryDB.set(fileId, { buffer, filename });
      return {
        url: `memory://${fileId}`,
        path: `pdfs/${fileId}/${filename}`
      };
    }

    const fileId = uuidv4();
    const filePath = `pdfs/${fileId}/${filename}`;
    const file = bucket.file(filePath);

    await file.save(buffer, {
      metadata: {
        contentType: 'application/pdf',
        metadata: {
          originalName: filename,
          uploadDate: new Date().toISOString()
        }
      }
    });

    // Make file publicly accessible (optional)
    // await file.makePublic();

    // Get signed URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year
    });

    return { url, path: filePath };
  } catch (error) {
    console.error('Storage upload error:', error);
    throw new AppError(`Failed to upload file: ${error.message}`, 500);
  }
}

/**
 * Delete PDF from Firebase Storage
 */
export async function deletePDFFromStorage(filePath) {
  try {
    if (!bucket) {
      const fileId = filePath.split('://')[1];
      memoryDB.delete(fileId);
      return { success: true };
    }

    const file = bucket.file(filePath);
    await file.delete();
    return { success: true };
  } catch (error) {
    console.error('Storage deletion error:', error);
    throw new AppError(`Failed to delete file: ${error.message}`, 500);
  }
}

/**
 * Save document metadata to Firestore
 */
export async function saveDocumentMetadata(documentData) {
  try {
    if (!db) {
      console.log('Firebase not configured, using in-memory database');
      memoryDB.set(documentData.id, documentData);
      return documentData;
    }

    const docRef = db.collection('documents').doc(documentData.id);

    try {
      await docRef.set({
        ...documentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('-------------:', error);
      throw new AppError(`----------: ${error.message}`, 500);
    }

    return documentData;
  } catch (error) {
    console.error('Metadata save error:', error);
    throw new AppError(`Failed to save metadata: ${error.message}`, 500);
  }
}

/**
 * Get document metadata from Firestore
 */
export async function getDocumentMetadata(documentId) {
  try {
    if (!db) {
      const doc = memoryDB.get(documentId);
      if (!doc) {
        throw new AppError('Document not found', 404);
      }
      return doc;
    }

    const docRef = db.collection('documents').doc(documentId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError('Document not found', 404);
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    if (error.statusCode === 404) throw error;
    console.error('Metadata retrieval error:', error);
    throw new AppError(`Failed to get metadata: ${error.message}`, 500);
  }
}

/**
 * List all documents
 */
export async function listDocuments(limit = 50) {
  try {
    if (!db) {
      return Array.from(memoryDB.values()).slice(0, limit);
    }

    const snapshot = await db.collection('documents')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const documents = [];
    snapshot.forEach(doc => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  } catch (error) {
    console.error('Document listing error:', error);
    throw new AppError(`Failed to list documents: ${error.message}`, 500);
  }
}

/**
 * Delete document metadata
 */
export async function deleteDocumentMetadata(documentId) {
  try {
    if (!db) {
      memoryDB.delete(documentId);
      return { success: true };
    }

    await db.collection('documents').doc(documentId).delete();
    return { success: true };
  } catch (error) {
    console.error('Metadata deletion error:', error);
    throw new AppError(`Failed to delete metadata: ${error.message}`, 500);
  }
}

export default {
  uploadPDFToStorage,
  deletePDFFromStorage,
  saveDocumentMetadata,
  getDocumentMetadata,
  listDocuments,
  deleteDocumentMetadata
};
