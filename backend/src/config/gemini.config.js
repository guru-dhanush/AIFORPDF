import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

let genAI = null;
let embeddingModel = null;
let chatModel = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });

  chatModel = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  });

  console.log('✅ Gemini AI initialized successfully');
} else {
  console.warn('⚠️  GEMINI_API_KEY not found. AI features will be disabled.');
}

export { genAI, embeddingModel, chatModel };
