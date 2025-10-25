import { PDFParse } from 'pdf-parse';


import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/error.middleware.js';

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(buffer) {
  try {
    const parser = new PDFParse({ data: buffer });
    const infoResult = await parser.getInfo({ parsePageInfo: false });
    const textRes = await parser.getText();
    await parser.destroy();

    return {
      text: textRes.text,
      numPages: infoResult.total,
      info: infoResult.info
    };
  } catch (error) {
    throw new AppError(`Failed to parse PDF: ${error.message}`, 400);
  }
}

/**
 * Split text into chunks with metadata
 * Each chunk contains page information for citations
 */
export function chunkTextWithPages(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];

  // Split by pages first (assuming page breaks are marked)
  // For simplicity, we'll chunk the entire text
  const words = text.split(/\s+/);

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push({
        id: uuidv4(),
        text: chunk,
        startIndex: i,
        endIndex: Math.min(i + chunkSize, words.length)
      });
    }
  }

  return chunks;
}

/**
 * Extract text page by page for better citations
 */
export async function extractTextByPages(buffer) {
  try {
    const parser = new PDFParse({ data: buffer });
    const infoResult = await parser.getInfo({ parsePageInfo: false });
    const numPages = infoResult.total;

    const pages = [];
    const pageTexts = [];
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const textRes = await parser.getText({ partial: [pageNum] });
      const pageText = textRes.text || '';
      pageTexts.push(pageText);
      pages.push({
        pageNumber: pageNum,
        text: pageText,
        id: `page_${pageNum}_${uuidv4()}`,
      });
    }

    const fullText = pageTexts.join('\n');
    await parser.destroy();

    return {
      pages,
      numPages,
      fullText,
      info: infoResult.info,
    };
  } catch (error) {
    throw new AppError(`Failed to extract pages: ${error.message}`, 400);
  }
}

/**
 * Create searchable chunks from pages
 */
export function createPageChunks(pages, chunkSize = 800) {
  const chunks = [];

  for (const page of pages) {
    const words = page.text.split(/\s+/);

    if (words.length <= chunkSize) {
      // Page fits in one chunk
      chunks.push({
        id: uuidv4(),
        text: page.text,
        pageNumber: page.pageNumber,
        chunkIndex: 0
      });
    } else {
      // Split page into multiple chunks
      let chunkIndex = 0;
      for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        if (chunk.trim()) {
          chunks.push({
            id: uuidv4(),
            text: chunk,
            pageNumber: page.pageNumber,
            chunkIndex: chunkIndex++
          });
        }
      }
    }
  }

  return chunks;
}

export default {
  extractTextFromPDF,
  chunkTextWithPages,
  extractTextByPages,
  createPageChunks
};
