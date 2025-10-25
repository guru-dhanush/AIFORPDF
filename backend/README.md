# NotebookLM Clone - Backend

A powerful backend API for a Google NotebookLM-like application with RAG (Retrieval Augmented Generation) capabilities.

## 🚀 Features

- **PDF Processing**: Upload and extract text from PDF documents
- **Vector Search**: Store and search document embeddings using ChromaDB
- **AI Chat**: Intelligent Q&A with context-aware responses using Google Gemini AI
- **Citations**: Automatic page number citations for AI responses
- **Firebase Integration**: Document metadata storage and file hosting
- **RAG Pipeline**: Retrieval Augmented Generation for accurate responses

## 🛠️ Tech Stack

- **Node.js + Express** - REST API server
- **Google Gemini AI** - Embeddings and text generation
- **ChromaDB** - Vector database for semantic search
- **Firebase (Firestore + Storage)** - Document metadata and file storage
- **pdf-parse** - PDF text extraction
- **LangChain** - RAG orchestration

## 📋 Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))
- Firebase project setup ([Firebase Console](https://console.firebase.google.com/))
- (Optional) ChromaDB running locally or in Docker

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

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com

# ChromaDB Configuration (optional)
CHROMA_HOST=http://localhost:8000
CHROMA_COLLECTION_NAME=pdf_documents

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Firestore Database** and **Storage**
4. Go to Project Settings > Service Accounts
5. Click "Generate New Private Key"
6. Copy the credentials to your `.env` file

### 4. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

### 5. (Optional) Set Up ChromaDB

**Option A: Using Docker (Recommended)**
```bash
docker run -p 8000:8000 chromadb/chroma
```

**Option B: Using Python**
```bash
pip install chromadb
chroma run --host localhost --port 8000
```

**Note**: If ChromaDB is not available, the backend will use an in-memory fallback.

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
    "summary": "Document summary...",
    "url": "https://storage.url"
  }
}
```

### Get All Documents
```http
GET /api/documents?limit=50
```

Response:
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### Get Document by ID
```http
GET /api/documents/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "document.pdf",
    "numPages": 50,
    "summary": "...",
    ...
  }
}
```

### Delete Document
```http
DELETE /api/documents/:id
```

Response:
```json
{
  "success": true,
  "message": "Document deleted successfully"
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

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── firebase.config.js
│   │   ├── gemini.config.js
│   │   └── chroma.config.js
│   ├── controllers/      # Request handlers
│   │   ├── document.controller.js
│   │   └── chat.controller.js
│   ├── middleware/       # Express middleware
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   ├── routes/           # API routes
│   │   ├── document.routes.js
│   │   └── chat.routes.js
│   ├── services/         # Business logic
│   │   ├── pdf.service.js
│   │   ├── embedding.service.js
│   │   ├── vector.service.js
│   │   ├── ai.service.js
│   │   └── storage.service.js
│   └── index.js          # Entry point
├── .env                  # Environment variables
├── .env.example          # Example environment file
├── package.json
└── README.md
```

## 🔄 How It Works

### Document Upload Flow
1. User uploads PDF via `/api/documents/upload`
2. PDF is stored in Firebase Storage
3. Text is extracted page by page
4. Text is chunked into smaller segments
5. Embeddings are generated using Gemini
6. Vectors are stored in ChromaDB
7. Metadata is saved to Firestore
8. Document summary is generated
9. Returns document ID to client

### Chat Flow
1. User sends message via `/api/chat`
2. Query embedding is generated
3. Similar chunks are retrieved from ChromaDB
4. Context is built from relevant chunks
5. Prompt is sent to Gemini with context
6. Response is generated with page citations
7. Returns AI response with page numbers

## 🧪 Testing

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Upload document
curl -X POST -F "pdf=@document.pdf" http://localhost:5000/api/documents/upload

# Chat
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"documentId": "your-doc-id", "message": "What is this about?"}'
```

## 🐛 Troubleshooting

### ChromaDB Connection Issues
If ChromaDB is not available, the backend will automatically use an in-memory fallback. To use ChromaDB:
```bash
docker run -p 8000:8000 chromadb/chroma
```

### Firebase Errors
- Ensure your service account credentials are correct
- Check that Firestore and Storage are enabled
- Verify the private key format (should include `\n` for line breaks)

### Gemini API Issues
- Verify your API key is valid
- Check API quota limits
- Ensure you're using the correct model names

### CORS Errors
Update `CORS_ORIGIN` in `.env` to match your frontend URL

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `GEMINI_API_KEY` | Google Gemini API key | **Yes** |
| `FIREBASE_PROJECT_ID` | Firebase project ID | **Yes** |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | **Yes** |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | **Yes** |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | **Yes** |
| `CHROMA_HOST` | ChromaDB host URL | No |
| `CORS_ORIGIN` | Frontend URL for CORS | No |

## 🚦 Production Deployment

### Prepare for Production

1. Set `NODE_ENV=production` in `.env`
2. Update `CORS_ORIGIN` to your production domain
3. Ensure all API keys are secure
4. Set up proper Firebase security rules

### Deploy to Cloud Platform

**Render / Railway / Heroku:**
```bash
# Set environment variables in platform dashboard
# Deploy from GitHub repository
```

**Docker:**
```bash
docker build -t notebooklm-backend .
docker run -p 5000:5000 --env-file .env notebooklm-backend
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📧 Support

For issues and questions, please open an issue on GitHub.
