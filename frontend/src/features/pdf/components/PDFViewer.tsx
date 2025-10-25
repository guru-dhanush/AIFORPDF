import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setScale } from "../pdfSlice";
import { BookOpen, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import PDFPageCanvas from "./PDFPageCanvas";
import { useRef } from "react";


const PDFViewer = () => {
    const { currentPage, numPages, scale, fileName, file } = useSelector((state: any) => state.pdf)
    const dispatch = useDispatch();
    const canvasRef = useRef(null);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= numPages) {
            dispatch(setCurrentPage(newPage));
        }
    };

    const handleZoom = (delta: number) => {
        const newScale = Math.max(0.5, Math.min(2.0, scale + delta));
        dispatch(setScale(newScale));
    };

    return (
        <div className="flex flex-col rounded-lg m-2 h-[calc(100%-20px)] bg-white">
            {/* PDF Controls */}
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1 border rounded-xl">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1 hover:bg-gray-100 rounded-4xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium">
                        Page {currentPage} of {numPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === numPages}
                        className="p-1 hover:bg-gray-100 rounded-4xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center gap-2 border rounded-xl">
                    <button
                        onClick={() => handleZoom(-0.1)}
                        className="p-1 hover:bg-gray-100 rounded-4xl"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium w-16 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => handleZoom(0.1)}
                        className="p-1 hover:bg-gray-100 rounded-4xl"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* PDF Display Area */}
            <div className="flex-1 overflow-auto p-4 ">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-500 shadow-lg p-4 relative">
                        {file ? (
                            <PDFPageCanvas
                                pdfDocument={file}
                                pageNum={currentPage}
                                scale={scale}
                                canvasRef={canvasRef}
                            />
                        ) : (
                            <div className="aspect-[8.5/11] flex items-center justify-center">
                                <div className="text-center p-8">
                                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-600 font-medium">{fileName}</p>
                                    <p className="text-gray-500 text-sm mt-2">Loading PDF...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;