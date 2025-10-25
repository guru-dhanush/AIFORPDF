import { useRef } from "react";
import apiService from "../apiService";
import { useDispatch } from "react-redux";
import { setError, setFile, setLoading, setNumPages, setProcessed } from "../pdfSlice";
import { setPromptSuggestion } from "../../chat/chatSlice";
import { useUploadDocumentMutation } from "../pdfAPI";
import { FileUp } from "lucide-react";
import { Loader } from "@/shared/components/ai-elements/loader";

const PDFUploader = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'application/pdf') {
            dispatch(setError('Please upload a valid PDF file'));
            return;
        }

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const { data: { documentId, numPages, suggestedQuestions } } = await uploadDocument(file).unwrap();
            const localResult = await apiService.processPDF(file);
            dispatch(setFile({
                file: localResult.pdfDocument,
                fileName: file.name,
                documentId: documentId
            }));
            dispatch(setNumPages(numPages));
            dispatch(setProcessed(true));
            dispatch(setPromptSuggestion(suggestedQuestions));
            console.log('✅ Document uploaded:', documentId);
        } catch (error) {
            dispatch(setError('Failed to process PDF. Please try again.'));
            console.error(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-15 border-6 border-[#223050] rounded-2xl w-[600px] ">
            <div
                className="absolute inset-0 bg-[url('/src/assets/uploadbg.png')] bg-cover bg-center opacity-20"
                style={{ zIndex: -1 }}
            />
            <div className="text-center mb-6">
                <FileUp className="w-16 h-16 mx-auto mb-4 text-[#223050]" />
                <h2 className="text-lg font-semibold mb-2 text-[#223050]">Upload PDF Document</h2>
                <p className="text-sm text-[#223050] font-medium">Start by uploading a PDF to analyze and chat about</p>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 mt-6 bg-[#223050] text-white rounded-2xl hover:bg-[#445580] transition-colors font-medium text-sm"
            >
                {isUploading ? <span className="flex items-center"><Loader className="w-5 h-5 mr-2" /> Uploading...</span> : 'Choose PDF File'}
            </button>
        </div>
    );
};

export default PDFUploader;