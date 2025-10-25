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
    },
    sendChatMessage: async (message: string, context: string) => {
        console.log("Sending message to AI service:", message);
        console.log("With context from PDF:", context);
        // Simulate AI response with citations
        await new Promise(resolve => setTimeout(resolve, 1500));

        const responses = [
            {
                text: "Based on the document, I can help you with that information. The key points are discussed in detail across several pages.",
                citations: [3, 7, 12]
            },
            {
                text: "According to the PDF content, this topic is covered comprehensively. Let me highlight the relevant sections for you.",
                citations: [5, 8]
            },
            {
                text: "The document provides detailed information about this. Here's what I found from the relevant pages.",
                citations: [2, 9, 15]
            }
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }
};

export default apiService;