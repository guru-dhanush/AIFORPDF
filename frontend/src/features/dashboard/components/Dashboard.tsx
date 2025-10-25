import { useDispatch, useSelector } from "react-redux";
import PDFUploader from "../../pdf/components/PDFUploader";
import { resetPdf } from "../../pdf/pdfSlice";
import PDFViewer from "../../pdf/components/PDFViewer";
import ChatInterface from "../../chat/components/ChatInterface";
import { AlertCircle } from "lucide-react";
import { Loader } from "@/shared/components/ai-elements/loader";

const Dashboard = () => {
    const { file, loading, error } = useSelector((state: any) => state.pdf);
    const { sidebarOpen } = useSelector((state: any) => state.ui);
    const dispatch = useDispatch();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <Loader />
                    <p className="text-gray-600 font-medium">Processing PDF...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <button
                        onClick={() => dispatch(resetPdf())}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!file) {
        return (
            <div className="relative flex items-center justify-center h-screen overflow-hidden">
                {/* Blurred background layer */}
                <div
                    className="absolute inset-0 bg-[url('/src/assets/uploadbg.png')] bg-cover bg-center blur-md scale-110 opacity-5"
                    style={{ zIndex: -1 }}
                />

                {/* Content */}
                <PDFUploader />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Header */}
            {/* <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b z-10 flex items-center px-4">
                <button
                    onClick={() => dispatch({ type: 'ui/toggleSidebar' })}
                    className="p-2 hover:bg-gray-100 rounded mr-2"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-blue-600">NotebookLM Clone</h1>
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-gray-600">{fileName}</span>
                    <button
                        onClick={() => {
                            dispatch(resetPdf());
                            dispatch(resetChat());
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div> */}

            {/* Main Content */}
            <div className="flex flex-1">
                {/* PDF Viewer */}
                <div className={`${sidebarOpen ? 'w-1/2' : 'w-full'} transition-all duration-300 h-full`}>
                    <PDFViewer />
                </div>

                {/* Chat Interface */}
                {sidebarOpen && (
                    <div className="w-1/2 h-full">
                        <ChatInterface />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;