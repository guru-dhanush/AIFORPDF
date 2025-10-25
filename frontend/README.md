# Playpower - AI-Powered Document Assistant

A modern web application that allows users to upload PDF documents and interact with them using AI-powered chat.

## Features

- Upload and view PDF documents
- Chat with AI about document content
- Smart search and context-aware responses
- Responsive design for all devices
- Clean and intuitive user interface

## Tech Stack

- **Frontend**: React, TypeScript, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express
- **AI**: Google Gemini AI
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS, Shadcn UI components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/playpower.git
   cd playpower/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a [.env](cci:7://file:///c:/Users/admin/Desktop/Interview%20Preparation%20Resources/frontend/assessment/playpower/frontend/.env:0:0-0:0) file in the frontend directory and add your environment variables:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # API and store configuration
│   ├── features/            # Feature-based modules
│   │   ├── chat/            # Chat functionality
│   │   ├── dashboard/       # Main dashboard
│   │   └── pdf/             # PDF viewer and processing
│   ├── shared/              # Shared components and utilities
│   └── main.tsx             # Application entry point
└── public/                  # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for the backend API |
