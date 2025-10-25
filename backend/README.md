# Playpower - AI-Powered Document Assistant (Backend)

A modern web application that allows users to upload PDF documents and interact with them using AI-powered chat.


## Features

- **PDF Processing**: Upload and extract text from PDF documents
- **Vector Search**: Store and search document embeddings using ChromaDB
- **AI Chat**: Intelligent Q&A with context-aware responses using Google Gemini AI
- **Citations**: Automatic page number citations for AI responses
- **Firebase Integration**: Document metadata storage and file hosting
- **RAG Pipeline**: Retrieval Augmented Generation for accurate responses

## Tech Stack

- **Node.js + Express** - REST API server
- **Google Gemini AI** - Embeddings and text generation
- **pdf-parse** - PDF text extraction

## Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

## 🔧 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
``

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Health Check
```http
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Upload Document
```http
POST /api/documents/upload
Content-Type: multipart/form-data

Body:
- pdf: [PDF file]
```

Response:
```json
{
  "success": true,
  "message": "Document uploaded and processed successfully",
  "data": {
    "documentId": "uuid",
    "filename": "document.pdf",
    "numPages": 50,
    "SuggestedQuestions": ["What are the main topics covered in this document?","Can you explain the key concepts mentioned?"],
  }
}
```

### Chat with Document
```http
POST /api/chat
Content-Type: application/json

Body:
{
  "documentId": "uuid",
  "message": "What is the main topic of this document?",
  "chatHistory": [
    {
      "role": "user",
      "text": "Previous message..."
    },
    {
      "role": "assistant", 
      "text": "Previous response..."
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "message": "The main topic is...",
    "citations": [1, 3, 5],
    "context": [
      {
        "pageNumber": 1,
        "preview": "Text preview..."
      }
    ]
  }
}
```

### Document Upload Flow
1. User uploads PDF via `/api/documents/upload`
2. Text is extracted page by page
4. Text is chunked into smaller segments
5. Embeddings are generated using Gemini
6. Vectors are stored in inmemory
8. Document summary is generated
9. Returns document ID,Suggested Question to client

### Chat Flow
1. User sends message via `/api/chat`
2. Query embedding is generated
3. Similar chunks are retrieved from In Memory
4. Context is built from relevant chunks
5. Prompt is sent to Gemini with context
6. Response is generated with page citations
7. Returns AI response with page numbers
