import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const PDFPageCanvas = ({ pdfDocument, pageNum, scale, canvasRef }: { pdfDocument: any, pageNum: number, scale: number, canvasRef: any }) => {
    const [rendering, setRendering] = useState(false);

    useEffect(() => {
        if (!pdfDocument || !canvasRef.current) return;

        let cancelled = false;
        setRendering(true);

        const renderPage = async () => {
            try {
                const page = await pdfDocument.getPage(pageNum);

                if (cancelled) return;

                const viewport = page.getViewport({ scale: scale * 1.5 });
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                await page.render(renderContext).promise;

                if (!cancelled) {
                    setRendering(false);
                }
            } catch (error) {
                console.error('Error rendering PDF page:', error);
                if (!cancelled) {
                    setRendering(false);
                }
            }
        };

        renderPage();

        return () => {
            cancelled = true;
        };
    }, [pdfDocument, pageNum, scale, canvasRef]);

    return (
        <div className="relative">
            {rendering && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            )}
            <canvas ref={canvasRef} className="max-w-full h-auto" />
        </div>
    );
};

export default PDFPageCanvas;