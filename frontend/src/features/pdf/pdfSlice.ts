import { createSlice } from "@reduxjs/toolkit";

interface PDFState {
    file: File | null;
    fileName: string;
    documentId: string | null;
    numPages: number;
    currentPage: number;
    scale: number;
    loading: boolean;
    error: string | null;
    textContent: Record<number, string>;
    processed: boolean;
}


const pdfInitialState: PDFState = {
    file: null,
    fileName: '',
    documentId: null,
    numPages: 0,
    currentPage: 1,
    scale: 1.0,
    loading: false,
    error: null,
    textContent: {},
    processed: false
};

const pdfSlice = createSlice({
    name: 'pdf',
    initialState: pdfInitialState,
    reducers: {
        setFile: (state, action) => {
            state.file = action.payload.file;
            state.fileName = action.payload.fileName;
            state.documentId = action.payload.documentId || null;
            state.loading = false;
        },
        setNumPages: (state, action) => {
            state.numPages = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
        ,
        setScale: (state, action) => {
            state.scale = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setTextContent: (state, action) => {
            state.textContent[action.payload.page] = action.payload.text;
        },
        setProcessed: (state, action) => {
            state.processed = action.payload;
        },
        resetPdf: () => pdfInitialState
    }
});

export const { setFile, setNumPages, setCurrentPage, setScale, setLoading, setError, setTextContent, setProcessed, resetPdf } = pdfSlice.actions;
export default pdfSlice.reducer;
