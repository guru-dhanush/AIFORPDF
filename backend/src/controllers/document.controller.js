import { v4 as uuidv4 } from 'uuid';
import { extractTextByPages, createPageChunks } from '../services/pdf.service.js';
import { storeDocumentVectors, deleteDocumentVectors } from '../services/vector.service.js';
import {
  uploadPDFToStorage,
  deletePDFFromStorage,
  saveDocumentMetadata,
  getDocumentMetadata,
  listDocuments,
  deleteDocumentMetadata
} from '../services/storage.service.js';
import { generateSuggestedQuestions } from '../services/ai.service.js';
import { AppError } from '../middleware/error.middleware.js';

/**
 * Upload and process PDF document
 */
export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const documentId = uuidv4();
    const filename = req.file.originalname;
    const buffer = req.file.buffer;

    console.log(`📄 Processing document: ${filename}`);

    // Step 1: Upload PDF to storage
    const { url, path: storagePath } = await uploadPDFToStorage(buffer, filename);

    // Step 2: Extract text from PDF page by page
    const { pages, numPages, fullText, info } = await extractTextByPages(buffer);
    console.log(`📖 Extracted ${numPages} pages`);

    // Step 3: Create chunks for vectorization
    const chunks = createPageChunks(pages, 800);
    console.log(`✂️  Created ${chunks.length} chunks`);

    // Step 4: Store vectors in database
    await storeDocumentVectors(documentId, chunks);
    console.log(`💾 Stored vectors in database`);

    // Step 5: Generate document summary
    // const summary = await generateDocumentSummary(fullText);
    // console.log(summary, "--------------------------------");

    //step 5: generate suggested questions
    const suggestedQuestions = await generateSuggestedQuestions(fullText);
    console.log(suggestedQuestions, "--------------------------------");


    // Step 6: Save metadata to Firestore
    const metadata = {
      id: documentId,
      filename,
      url,
      storagePath,
      numPages,
      numChunks: chunks.length,
      // summary,
      suggestedQuestions,
      fileSize: buffer.length,
      pdfInfo: info,
      status: 'processed'
    };

    await saveDocumentMetadata(metadata);

    console.log(`✅ Document processed successfully: ${documentId}`);

    res.status(201).json({
      success: true,
      message: 'Document uploaded and processed successfully',
      data: {
        documentId,
        filename,
        numPages,
        suggestedQuestions,
        url
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
}

/**
 * Get document by ID
 */
export async function getDocument(req, res, next) {
  try {
    const { id } = req.params;
    const document = await getDocumentMetadata(id);

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List all documents
 */
export async function getAllDocuments(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const documents = await listDocuments(limit);

    res.json({
      success: true,
      data: documents,
      count: documents.length
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete document
 */
export async function deleteDocument(req, res, next) {
  try {
    const { id } = req.params;

    // Get document metadata
    const document = await getDocumentMetadata(id);

    // Delete from storage
    if (document.storagePath) {
      await deletePDFFromStorage(document.storagePath);
    }

    // Delete vectors
    await deleteDocumentVectors(id);

    // Delete metadata
    await deleteDocumentMetadata(id);

    console.log(`🗑️  Document deleted: ${id}`);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  uploadDocument,
  getDocument,
  getAllDocuments,
  deleteDocument
};
