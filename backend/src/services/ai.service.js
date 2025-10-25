import { chatModel } from '../config/gemini.config.js';
import { searchSimilarChunks } from './vector.service.js';
import { AppError } from '../middleware/error.middleware.js';

/**
 * Generate AI response with RAG (Retrieval Augmented Generation)
 */
export async function generateChatResponse(documentId, userMessage, chatHistory = []) {
  try {
    if (!chatModel) {
      throw new AppError('Gemini AI not configured', 500);
    }

    // Step 1: Retrieve relevant context from vector database
    const relevantChunks = await searchSimilarChunks(documentId, userMessage, 5);

    if (relevantChunks.length === 0) {
      return {
        text: "I couldn't find relevant information in the document to answer your question. Please try rephrasing or ask about different content.",
        citations: []
      };
    }

    // Step 2: Build context from retrieved chunks
    const context = relevantChunks
      .map((chunk, idx) =>
        `[Context ${idx + 1} - Page ${chunk.pageNumber}]:\n${chunk.text}`
      )
      .join('\n\n');

    // Step 3: Build prompt with context
    const prompt = buildRAGPrompt(userMessage, context, chatHistory);

    // Step 4: Generate response
    const result = await chatModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Step 5: Extract citations (page numbers mentioned)
    const citations = extractCitations(text, relevantChunks);

    return {
      text,
      citations: [...new Set(citations)], // Remove duplicates
      context: relevantChunks.map(c => ({
        pageNumber: c.pageNumber,
        preview: c.text.substring(0, 200) + '...'
      }))
    };
  } catch (error) {
    console.error('AI response generation error:', error);
    throw new AppError(`Failed to generate response: ${error.message}`, 500);
  }
}

/**
 * Build RAG prompt with context and history
 */
function buildRAGPrompt(userMessage, context, chatHistory) {
  const historyText = chatHistory
    .slice(-5) // Last 5 messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
    .join('\n');

  const prompt = `You are a helpful AI assistant analyzing a PDF document. Use the provided context to answer the user's question accurately and concisely.

CONTEXT FROM DOCUMENT:
${context}

${historyText ? `CHAT HISTORY:\n${historyText}\n` : ''}
USER QUESTION: ${userMessage}

INSTRUCTIONS:
- Answer based ONLY on the provided context
- If the context doesn't contain relevant information, say so
- Be specific and cite page numbers when referencing information
- Keep responses clear and concise
- If referring to specific pages, mention them like "According to page X..."

ANSWER:`;

  return prompt;
}

/**
 * Extract page numbers that should be cited
 */
function extractCitations(responseText, relevantChunks) {
  const citations = [];

  // Get all unique page numbers from relevant chunks
  const pageNumbers = relevantChunks.map(chunk => chunk.pageNumber);

  // Add pages that are explicitly mentioned in response
  const pageMatches = responseText.match(/page\s+(\d+)/gi);
  if (pageMatches) {
    pageMatches.forEach(match => {
      const pageNum = parseInt(match.match(/\d+/)[0]);
      if (pageNumbers.includes(pageNum)) {
        citations.push(pageNum);
      }
    });
  }

  // If no explicit mentions, return the most relevant pages
  if (citations.length === 0) {
    citations.push(...pageNumbers.slice(0, 3));
  }

  return citations.sort((a, b) => a - b);
}

/**
 * Generate summary of document
 */
export async function generateDocumentSummary(documentText) {
  try {
    if (!chatModel) {
      throw new AppError('Gemini AI not configured', 500);
    }

    const prompt = `Please provide a concise summary of the following document in 3-5 sentences:

${documentText.substring(0, 5000)}

Summary:`;

    const result = await chatModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Summary generation error:', error);
    return 'Unable to generate summary at this time.';
  }
}


/**
 * Generate suggested questions based on document content
 */
export async function generateSuggestedQuestions(documentText) {
  try {
    if (!chatModel) {
      throw new AppError('Gemini AI not configured', 500);
    }

    const prompt = `Based on the following document content, generate 3-5 relevant questions that a user might want to ask. 
Return the questions as a JSON array of strings. Focus on key topics, concepts, and important details.

Document content:
${documentText.substring(0, 5000)}

IMPORTANT: Respond with ONLY a JSON array of strings. Example:
["What is the main topic of this document?", "What are the key findings?"]`;

    console.log('Sending prompt to Gemini...', prompt);
    const result = await chatModel.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    console.log('Raw response from Gemini:', responseText);

    try {
      // Clean up the response to handle markdown code blocks
      let jsonString = responseText.trim();
      
      // Remove markdown code block syntax if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*|```$/g, '').trim();
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*|```$/g, '').trim();
      }
      
      // Parse the JSON
      const questions = JSON.parse(jsonString);
      console.log('Parsed questions:', questions);

      if (Array.isArray(questions) && questions.length > 0) {
        return questions;
      }
      
      throw new Error('Invalid response format - not an array or empty');
    } catch (e) {
      console.error('Error parsing response as JSON, trying fallback:', e);
      // Fallback: Extract questions from plain text
      const questionMatches = responseText.match(/\d+[.)]\s*([^\n]+)/g) ||
        responseText.match(/- (.+?)\?/g) ||
        responseText.match(/"(.*?)\?"/g) ||
        [];

      const extractedQuestions = questionMatches
        .map(q => q.replace(/^\d+[.)]\s*|- |"/g, '').trim())
        .filter(q => q.endsWith('?') || q.endsWith('.'))
        .slice(0, 5);

      console.log('Extracted questions from text:', extractedQuestions);
      return extractedQuestions.length > 0 ? extractedQuestions : [
        "What are the main topics covered in this document?",
        "Can you explain the key concepts mentioned?",
        "What are the most important details I should know?"
      ];
    }
  } catch (error) {
    console.error('Error in generateSuggestedQuestions:', error);
    return [
      "What are the main topics covered in this document?",
      "Can you explain the key concepts mentioned?",
      "What are the most important details I should know?"
    ];
  }
}

export default {
  generateChatResponse,
  generateDocumentSummary,
  generateSuggestedQuestions
};
