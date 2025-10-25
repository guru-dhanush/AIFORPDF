import { v4 as uuidv4 } from 'uuid';
import { extractTextByPages, createPageChunks } from '../services/pdf.service.js';
import { storeDocumentVectors, deleteDocumentVectors } from '../services/vector.service.js';
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

    console.log(`Processing document: ${filename}`);

    // Step 1: Extract text from PDF page by page
    const { pages, numPages, fullText, info } = await extractTextByPages(buffer);
    console.log(`Extracted ${numPages} pages`);

    // Step 2: Create chunks for vectorization
    const chunks = createPageChunks(pages, 800);
    console.log(`Created ${chunks.length} chunks`);

    // Step 3: Store vectors in database
    await storeDocumentVectors(documentId, chunks);
    console.log(`Stored vectors in database`);

    // Step 4: Generate document summary
    // const summary = await generateDocumentSummary(fullText);

    //step 5: generate suggested questions
    const suggestedQuestions = [
      "What are the main topics covered in this document?",
      "Can you explain the key concepts mentioned?",
      "What are the most important details I should know?"
    ]


    res.status(201).json({
      success: true,
      message: 'Document uploaded and processed successfully',
      data: {
        documentId,
        filename,
        numPages,
        suggestedQuestions,
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
}

/**
 * Delete document
 */
export async function deleteDocument(req, res, next) {
  try {
    const { id } = req.params;

    // Delete vectors
    await deleteDocumentVectors(id);

    console.log(`Document deleted: ${id}`);

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
  deleteDocument
};
