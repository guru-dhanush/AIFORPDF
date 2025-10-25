import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


const apiService = {
    processPDF: async (file: File) => {
        try {
            // Convert file to array buffer
            const arrayBuffer = await file.arrayBuffer();
            console.log('PDF file received for processing:', arrayBuffer);
            // Load PDF document
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdfDocument = await loadingTask.promise;

            return {
                pdfDocument,
                numPages: pdfDocument.numPages
            };
        } catch (error) {
            console.error('Error processing PDF:', error);
            throw error;
        }
    },

    extractText: async (pdfDocument: any, pageNum: number) => {
        try {
            const page = await pdfDocument.getPage(pageNum);
            const textContent = await page.getTextContent();
            const text = textContent.items.map((item: any) => item.str).join(' ');

            return { text };
        } catch (error) {
            console.error('Error extracting text:', error);
            throw error;
        }
    }
};

export default apiService;