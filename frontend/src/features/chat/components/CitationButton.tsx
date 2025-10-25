const CitationButton = ({ page, onClick }: { page: number, onClick: (page: number) => void }) => (
    <button
        onClick={() => onClick(page)}
        className="inline-flex items-center px-2 py-1 bg-blue-100 text-[#223050] rounded text-xs font-medium hover:bg-blue-200 transition-colors ml-1"
    >
        Page {page}
    </button>
);
export default CitationButton;